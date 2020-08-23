let useFront = false // フロントをつかっているかどうか 
let tmpStream = null

var video = null
var constraints = {
  audio: false,
  video: {
    facingMode: 'user',
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

document.addEventListener('DOMContentLoaded', () => {
  video = document.getElementById('video');
  syncCamera()
})
