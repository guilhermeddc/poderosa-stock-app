export const resizeImage = (file: File) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const maxW = 500;
  const maxH = 600;
  const img = document.createElement('img');

  img.onload = function () {
    const iw = img.width;
    const ih = img.height;
    const scale = Math.min(maxW / iw, maxH / ih);
    const iwScaled = iw * scale;
    const ihScaled = ih * scale;
    canvas.width = iwScaled;
    canvas.height = ihScaled;
    context?.drawImage(img, 0, 0, iwScaled, ihScaled);
    document.body.innerHTML += canvas.toDataURL();
  };
  img.src = URL.createObjectURL(file);

  return new Blob([img.src], {type: 'image/png'});
};
