var video = document.getElementById('video');
var constraints = {
  audio: false,
  video: {
    facingMode: 'environment', // スマホのバックカメラを使用
    frameRate: { ideal: 10, max: 15 } // フレームレートを下げる
  }
};

//  カメラの映像を取得
navigator.mediaDevices.getUserMedia(constraints)
  .then((stream) => video.srcObject = stream)
  .catch((err) => window.alert(err.name + ': ' + err.message))