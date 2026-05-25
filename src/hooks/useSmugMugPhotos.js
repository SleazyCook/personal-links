import { useEffect, useState } from "react";

const NODE_KEY = "k6GpLS";
const IMAGE_COUNT = 50;

/**
 * Fetches high-quality public photos from a SmugMug album via Netlify proxy.
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

  // STEP 1: Fetch node details to get the album URI
  // Uses the local Netlify proxy rewrite to bypass CORS
  const nodeUrl = `/api/smugmug/node/${NODE_KEY}?${params()}`;

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

  // STEP 2: Fetch album images
  // We strip '/api/v2/' from the returned albumUri because our Netlify proxy 
  // rule automatically appends 'https://api.smugmug.com/api/v2/' under the hood.
  const cleanAlbumUri = albumUri.replace(/^\/api\/v2\//, "");
  const imagesUrl = `/api/smugmug/${cleanAlbumUri}!images?${params({
    count: IMAGE_COUNT,
    _expand: "ImageSizes"
  })}`;

  console.log("Fetching album images:", imagesUrl);

  const imagesRes = await fetch(imagesUrl);

  if (!imagesRes.ok) {
    throw new Error(`Images fetch failed: ${imagesRes.status}`);
  }

  const imagesData = await imagesRes.json();

  console.log("SmugMug images response:", imagesData);

  const albumImages = imagesData.Response?.AlbumImage ?? [];

  return albumImages.map((img) => {
    const sizes = img.Uris?.ImageSizes?.ImageSizes;

    const src =
      sizes?.OriginalImageUrl ||
      sizes?.X5LargeImageUrl ||
      sizes?.X4LargeImageUrl ||
      sizes?.X3LargeImageUrl ||
      sizes?.X2LargeImageUrl ||
      sizes?.XLargeImageUrl ||
      sizes?.LargeImageUrl ||
      img.ArchivedUri ||   // fallback if expand didn't work
      img.Uri ||
      "";

    return {
      src,
      alt: img.Caption || img.FileName || "Photo",
    };
  });
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