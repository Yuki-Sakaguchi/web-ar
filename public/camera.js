let useFront = false // フロントをつかっているかどうか 
let tmpStream = null

var video = document.getElementById('video');
var constraints = {
  audio: false,
  video: {
    facingMode: setCameraMode() , // スマホのバックカメラを使用
    frameRate: { ideal: 10, max: 15 } // フレームレートを下げる
  }
};

function success (stream) {
  video.srcObject = stream
  tmpStream = stream
}

function failure (err) {
  alert(err.name + ':' + err.message)
}

function setCameraMode () {
  if (useFront) {
    video.setAttribute('style', 'transform: scaleX(-1)')
  } else {
    video.removeAttribute('style')
  }
  return useFront ? 'user' : { exact: "environment" }
}

function syncCamera (video, isFront) {
  constraints.video.facingMode = setCameraMode()

  if (tmpStream !== null) {
    tmpStream.getVideoTracks().forEach(camera => {
      camera.stop()
    })
  }

  //  カメラの映像を取得
  navigator.mediaDevices.getUserMedia(constraints)
    .then(success)
    .catch(failure)
}

syncCamera()
