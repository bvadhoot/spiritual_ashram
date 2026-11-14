import { readPublicJson, writePublicJson } from "@/lib/storage";
import { galleryImages, type GalleryImage } from "@/lib/gallery";

const STORED_GALLERY_FILE = "gallery.json";

export async function getStoredGalleryImages(): Promise<GalleryImage[]> {
  return readPublicJson<GalleryImage[]>(STORED_GALLERY_FILE, []);
}

export async function addStoredGalleryImage(
  image: GalleryImage,
): Promise<void> {
  const stored = await getStoredGalleryImages();
  await writePublicJson(STORED_GALLERY_FILE, [
    image,
    ...stored.filter((item) => item.id !== image.id),
  ]);
}

export async function getAllGalleryImages(): Promise<GalleryImage[]> {
  const stored = await getStoredGalleryImages();
  const seen = new Set<string>();
  const merged: GalleryImage[] = [];

  for (const image of [...stored, ...galleryImages]) {
    if (seen.has(image.id) || seen.has(image.src)) continue;
    seen.add(image.id);
    seen.add(image.src);
    merged.push(image);
  }

  return merged;
}

export async function getFeaturedGalleryImages(
  count = 4,
): Promise<GalleryImage[]> {
  const images = await getAllGalleryImages();
  const featured = images.filter((image) => image.featured);
  return [...featured, ...images.filter((image) => !image.featured)].slice(
    0,
    count,
  );
}
