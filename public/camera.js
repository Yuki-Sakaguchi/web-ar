var video = document.getElementById('video');
var constraints = {
    audio: false,
    video: {
        // スマホのバックカメラを使用
        facingMode: 'environment'
    }
};
//  カメラの映像を取得
navigator.mediaDevices.getUserMedia(constraints)
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    window.alert(err.name + ': ' + err.message);
  });