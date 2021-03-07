document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('#canvas')
  const video = document.querySelector('#video')
  const color = document.querySelector('#color')
  const ctx = canvas.getContext('2d')

  const BLACK = '#000000'
  const WHITE = '#ffffff'

  const colorType = {
    "BL": "ブラック",
    "W": "ホワイト",
    "GL": "グレー系",
    "R": "レッド系",
    "M": "マゼンダ系",
    "Y": "イエロー系",
    "G": "グリーン系",
    "C": "シアン系",
    "B": "ブルー系"
  }

  // RGBをY(輝度)に変換
  const getBrightness = (color) => {
    if (color.indexOf('#') != -1) {
      color = color.substr(1)
    }
    // RGBをY(輝度)に変換
    return {
      red: (parseInt(color.substr(0, 2), 16) * 0.299),
      green: (parseInt(color.substr(2, 2), 16) * 0.587),
      blue: (parseInt(color.substr(4, 2), 16) * 0.114)
    }
  }

  // 人間の視覚特性にあった輝度に変換する
  const getRGBForCalculateLuminance = (_color) => {
    const color = _color / 255
    if (color <= 0.03928) {
      return color / 12.92;
    } else {
      return Math.pow(((color + 0.055) / 1.055), 2.4);
    }
  }

  // 相対輝度に変換する
  const getRelativeLuminance = (color) => {
    const {red, green, blue} = color
    const R = getRGBForCalculateLuminance(red);
    const G = getRGBForCalculateLuminance(green);
    const B = getRGBForCalculateLuminance(blue);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }

  // コントラスト比を取得
  const getContrastRatio = (color1, color2) => {
    const luminance1 = getRelativeLuminance(color1);
    const luminance2 = getRelativeLuminance(color2);
    const bright = Math.max(luminance1, luminance2);
    const dark = Math.min(luminance1, luminance2);
    return (bright + 0.05) / (dark + 0.05);
  }

  // 白黒のどちらが適切か
  const getFontColor = (color) => {
    const darkRatio = getContrastRatio(getBrightness(color), getBrightness(BLACK))
    const lightRatio = getContrastRatio(getBrightness(color), getBrightness(WHITE))
    return lightRatio > darkRatio ? WHITE : BLACK
  }

  function checkColor (inputColor) {
    let s = [];
    let c = [];

    const l = ((colorCode, ratio) => {
        c = (colorCodeList => 0 === colorCodeList.reduce((t, e) => parseInt(t, 16) + parseInt(e, 16)) ? ["01", "01", "01"] : colorCodeList)([colorCode.slice(1, 3), colorCode.slice(3, 5), colorCode.slice(5, 7)]);
        const n = [];
        for (let i = 0; i < c.length; i++) {
        const o = Math.round(parseInt(c[i], 16) * ratio);
        if (o < 256) {
            s.push(o);
            n.push(("00" + o.toString(16)).slice(-2));
        } else {
            s.push(255);
            n.push("ff");
        }
        }
        return n
    })(inputColor, 1);

    const i = `#${l[0]}${l[1]}${l[2]}`
    const d = () => {
        const t = colorType;
        const n = c.map(t => parseInt(t, 16)),
        o = n[0],
        r = n[1],
        a = n[2],
        l = n.reduce((t, e) => Math.max(t, e)),
        d = n.reduce((t, e) => Math.min(t, e)),
        u = n.reduce((t, e) => t + e) / n.length,
        h = `${i} (R:${s[0]} G:${s[1]} B:${s[2]}) と同じ色相は < `;
        let p;
        l === d ? p = `${h}${t.GL} > です` : l === o && d === r ? p = u >= a ? `${h}${t.R} > です` : `${h}${t.M} > です` : l === o && d === a ? p = u >= r ? `${h}${t.R} > です` : `${h}${t.Y} > です` : l === r && d === o ? p = u >= a ? `${h}${t.G} > です` : `${h}${t.C} > です` : l === r && d === a ? p = u >= o ? `${h}${t.G} > です` : `${h}${t.Y} > です` : l === a && d === o ? p = u >= r ? `${h}${t.B} > です` : `${h}${t.C} > です` : l === a && d === r && (p = u >= o ? `${h}${t.B} > です` : `${h}${t.M} > です`);
        return p;
    }
    return d();
  }

  const getColorFromCanvas = () => {
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let imagedata = ctx.getImageData(x, y, 1, 1);
    let r = imagedata.data[0];
    let g = imagedata.data[1];
    let b = imagedata.data[2];
    return rgbToHex([r, g, b])
  };

  const rgbToHex = (rgb) => {
    return (
      rgb
        .map(function (value) {
          return ("0" + value.toString(16)).slice(-2);
        })
        .join("")
    );
  };

  const loop = () => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    let col = getColorFromCanvas();
    let colName = checkColor(col);
    color.style.backgroundColor = '#' + col;
    color.style.color = getFontColor(col);
    color.innerHTML = col + '<br>' + colName;
    requestAnimationFrame(loop);
  }

  loop();
});