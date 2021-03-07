document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('#canvas')
  const video = document.querySelector('#video')
  const color = document.querySelector('#color')
  const ctx = canvas.getContext('2d')

  const getColorFromCanvas = () => {
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let imagedata = ctx.getImageData(x, y, 1, 1);
    let r = imagedata.data[0];
    let g = imagedata.data[1];
    let b = imagedata.data[2];
    console.log(`rgba(${r}, ${g}, ${b}, 1)`);
    console.log(rgbToHex([r, g, b]));
    color.style.backgroundColor = rgbToHex([r, g, b]);
  };

  const rgbToHex = (rgb) => {
    return (
      "#" +
      rgb
        .map(function (value) {
          return ("0" + value.toString(16)).slice(-2);
        })
        .join("")
    );
  };

  const loop = () => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    getColorFromCanvas();
    requestAnimationFrame(loop);
  }

  loop();
});