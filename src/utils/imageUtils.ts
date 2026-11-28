/**
 * Compresses and resizes uploaded images on the client so up to 6 high-resolution
 * photos remain sharp on A4 print/PNG export while keeping memory usage fast.
 */
export async function processUploadedImage(
  file: File,
  maxDimension = 1400,
  quality = 0.86
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.onload = () => {
      const result = reader.result as string;
      const img = new Image();
      img.onerror = () => resolve(result);
      img.onload = () => {
        const { width, height } = img;
        if (width <= maxDimension && height <= maxDimension && file.size < 900_000) {
          resolve(result);
          return;
        }
        const scale = Math.min(maxDimension / width, maxDimension / height, 1);
        const targetW = Math.round(width * scale);
        const targetH = Math.round(height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }
        ctx.drawImage(img, 0, 0, targetW, targetH);
        const isPng = file.type === 'image/png';
        const outType = isPng && maxDimension <= 512 ? 'image/png' : 'image/jpeg';
        resolve(canvas.toDataURL(outType, quality));
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  });
}

export async function downscaleDataUrlForAi(
  dataUrl: string,
  maxDimension = 640,
  quality = 0.78
): Promise<{ mimeType: string; data: string } | null> {
  const match = dataUrl.match(/^data:(image\/(?:jpeg|jpg|png|webp|gif));base64,(.+)$/i);
  if (!match) return null;

  return new Promise((resolve) => {
    const img = new Image();
    img.onerror = () => {
      resolve({
        mimeType: match[1].toLowerCase() === 'image/jpg' ? 'image/jpeg' : match[1].toLowerCase(),
        data: match[2],
      });
    };
    img.onload = () => {
      const { width, height } = img;
      const scale = Math.min(maxDimension / width, maxDimension / height, 1);
      const targetW = Math.max(1, Math.round(width * scale));
      const targetH = Math.max(1, Math.round(height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({
          mimeType: match[1].toLowerCase() === 'image/jpg' ? 'image/jpeg' : match[1].toLowerCase(),
          data: match[2],
        });
        return;
      }
      ctx.drawImage(img, 0, 0, targetW, targetH);
      const compactUrl = canvas.toDataURL('image/jpeg', quality);
      const compactMatch = compactUrl.match(/^data:(image\/jpeg);base64,(.+)$/i);
      if (compactMatch) {
        resolve({ mimeType: 'image/jpeg', data: compactMatch[2] });
      } else {
        resolve({
          mimeType: match[1].toLowerCase() === 'image/jpg' ? 'image/jpeg' : match[1].toLowerCase(),
          data: match[2],
        });
      }
    };
    img.src = dataUrl;
  });
}
