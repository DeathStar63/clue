// Photo helpers: downscale on the phone, and a rough "is this blurry?" check.
// Everything runs locally in the browser. Nothing is uploaded.

/**
 * Laplacian variance (0–255 greyscale, 256px copy) below this counts as blurry.
 * Sharp phone photos of skin usually land well above 100; clearly out-of-focus
 * or shaky shots tend to sit under 40. 60 keeps false alarms low on plain skin,
 * which naturally has little texture.
 */
export const BLUR_THRESHOLD = 60;

const BLUR_SIDE = 256;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not read this image.'));
    img.src = src;
  });
}

/** Decode a file, honouring EXIF rotation where the browser supports it. */
async function decode(file: File): Promise<{ source: CanvasImageSource; width: number; height: number; done: () => void }> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
      return { source: bmp, width: bmp.width, height: bmp.height, done: () => bmp.close() };
    } catch {
      // Fall through to <img>, which also applies EXIF orientation in modern browsers.
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    return { source: img, width: img.naturalWidth, height: img.naturalHeight, done: () => URL.revokeObjectURL(url) };
  } catch (e) {
    URL.revokeObjectURL(url);
    throw e;
  }
}

/** Downscale a picked/taken photo to a JPEG data URL (longest side ≤ maxSide). */
export async function fileToPhotoDataUrl(file: File, maxSide = 1280, quality = 0.82): Promise<string> {
  const { source, width, height, done } = await decode(file);
  try {
    const scale = Math.min(1, maxSide / Math.max(width, height));
    const w = Math.max(1, Math.round(width * scale));
    const h = Math.max(1, Math.round(height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is not available.');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(source, 0, 0, w, h);
    return canvas.toDataURL('image/jpeg', quality);
  } finally {
    done();
  }
}

/**
 * Rough sharpness score: variance of a 3x3 Laplacian over a 256px greyscale copy.
 * Higher = sharper. Compare with BLUR_THRESHOLD.
 */
export async function estimateBlur(dataUrl: string): Promise<number> {
  const img = await loadImage(dataUrl);
  const scale = Math.min(1, BLUR_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(3, Math.round(img.naturalWidth * scale));
  const h = Math.max(3, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return Number.POSITIVE_INFINITY;
  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);

  const grey = new Float32Array(w * h);
  for (let i = 0, p = 0; i < grey.length; i++, p += 4) {
    grey[i] = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
  }

  let sum = 0;
  let sumSq = 0;
  let n = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const lap = grey[i - w] + grey[i + w] + grey[i - 1] + grey[i + 1] - 4 * grey[i];
      sum += lap;
      sumSq += lap * lap;
      n++;
    }
  }
  if (n === 0) return Number.POSITIVE_INFINITY;
  const mean = sum / n;
  return sumSq / n - mean * mean;
}
