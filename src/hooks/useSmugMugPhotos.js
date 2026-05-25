import { useEffect, useState } from "react";

const NODE_KEY = "k6GpLS";
const IMAGE_COUNT = 50;

/**
 * Fetches high-quality public photos from a SmugMug album.
 *
 * Returns:
 * [{ src, alt }]
 */
async function fetchSmugMugPhotos(apiKey) {
  const params = (extra = {}) =>
    new URLSearchParams({
      APIKey: apiKey,
      _accept: "application/json",
      ...extra,
    }).toString();

  // STEP 1:
  // Resolve node → album URI
  const nodeUrl =
    `https://api.smugmug.com/api/v2/node/${NODE_KEY}?${params()}`;

  console.log("Fetching SmugMug node:", nodeUrl);

  const nodeRes = await fetch(nodeUrl);

  if (!nodeRes.ok) {
    throw new Error(`Node fetch failed: ${nodeRes.status}`);
  }

  const nodeData = await nodeRes.json();

  const albumUri = nodeData.Response?.Node?.Uris?.Album?.Uri;

  if (!albumUri) {
    throw new Error("Could not resolve album URI");
  }

  console.log("Resolved album URI:", albumUri);

  // STEP 2:
  // Fetch album images
  const imagesUrl =
    `https://api.smugmug.com${albumUri}!images?${params({
      count: IMAGE_COUNT,
    })}`;

  console.log("Fetching album images:", imagesUrl);

  const imagesRes = await fetch(imagesUrl);

  if (!imagesRes.ok) {
    throw new Error(`Images fetch failed: ${imagesRes.status}`);
  }

  const imagesData = await imagesRes.json();

  console.log("SmugMug images response:", imagesData);

  const albumImages = imagesData.Response?.AlbumImage ?? [];

  return albumImages
    .map((img) => {
      console.log("Album image:", img);

      // SmugMug returns ImageKey + ArchivedUri
      // We can construct higher quality image URLs manually

      const baseUri =
        img.ArchivedUri ||
        img.ImageUri ||
        img.Uri ||
        "";

      // Highest-quality available fallback chain
      const src =
        img.OriginalUrl ||
        img.OriginalImageUrl ||
        img.X5LargeUrl ||
        img.X4LargeUrl ||
        img.X3LargeUrl ||
        img.X2LargeUrl ||
        img.XLargeUrl ||
        img.LargeUrl ||
        img.MediumUrl ||
        img.ThumbnailUrl ||
        baseUri;

      console.log("Chosen image src:", src);

      return {
        src,
        alt: img.Caption || img.FileName || "Photo",
      };
    })
    .filter((photo) => Boolean(photo.src));
}

/**
 * React hook for loading SmugMug photos.
 */
export function useSmugMugPhotos(fallback = []) {
  const [photos, setPhotos] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_SMUGMUG_API_KEY;

    if (!apiKey) {
      console.warn("Missing VITE_SMUGMUG_API_KEY");
      setLoading(false);
      return;
    }

    fetchSmugMugPhotos(apiKey)
      .then((images) => {
        if (images.length > 0) {
          setPhotos(images);
        } else {
          console.warn("No SmugMug images returned.");
        }
      })
      .catch((err) => {
        console.error("SmugMug fetch failed:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fallback]);

  return { photos, loading };
}