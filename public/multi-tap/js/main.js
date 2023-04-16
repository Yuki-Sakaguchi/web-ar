const constraints = {
  audio: false,
  video: {
    facingMode: "user",
    frameRate: { ideal: 10, max: 15 },
  },
  deviceId: null,
};

let app;
let isLoaded = false;
let cameraHeight;
let cameraMode = true;
let stream = null;
let canvasWrapper;
let video;
let loaderEl;
let videoSprite;
let oukan;
let objContainer;
let scale = 0.2;
let rotate = 0;
let saveButton;
let saveImage;
let modal;
let graphics;
let multiPosition;
let helper;
let isDev = location.href.indexOf("mode=test") != -1;

function init() {
  console.log("init");
  canvasWrapper = document.getElementById("canvas-wrapper");
  video = document.getElementById("video");
  loaderEl = document.getElementById("loader");
  saveButton = document.getElementById("save-button");
  modal = document.getElementById("modal");

  saveButton.addEventListener("click", save);
  document.querySelectorAll("[data-modal-close]").forEach((element) => {
    element.addEventListener("click", closeModal);
  });

  document.getElementById("change", change);

  setCanvas();
  cameraHeight = window.innerHeight;

  setTimeout(() => {
    this.setVideo();
  }, 200);
}

function setHelper() {
  graphics.clear();

  if (multiPosition == null) {
    return;
  }

  const x1 = multiPosition.p1.x;
  const y1 = multiPosition.p1.y;
  const x2 = multiPosition.p2.x;
  const y2 = multiPosition.p2.y;
  const x3 = multiPosition.p3.x;
  const y3 = multiPosition.p3.y;
  const x4 = multiPosition.p4.x;
  const y4 = multiPosition.p4.y;
  const d = multiPosition.d;

  graphics.lineStyle(2, 0xffffff, 1);
  graphics.beginFill(0xffffff, 0.2);
  graphics.drawCircle(x3, y3, d / 2);
  graphics.endFill();

  // p1
  graphics.beginFill(0x00ff00, 1);
  graphics.drawCircle(x1, y1, 10);
  graphics.endFill();

  // p2
  graphics.beginFill(0xff0000, 1);
  graphics.drawCircle(x2, y2, 10);
  graphics.endFill();

  // p3
  graphics.beginFill(0x0000ff, 1);
  graphics.drawCircle(x3, y3, 10);
  graphics.endFill();

  // p4
  graphics.beginFill(0xff00ff, 1);
  graphics.drawCircle(x4, y4, 10);
  graphics.endFill();
}

function setCanvas() {
  objContainer = new PIXI.Container();

  // ここのサイズも端末に依存させる
  app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x000000,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    preserveDrawingBuffer: true,
  });
  objContainer.sortableChildren = true;
  canvasWrapper.appendChild(app.view);

  // ヘルパー用
  helper = new PIXI.Container();
  helper.zIndex = 10;
  objContainer.addChild(helper);

  graphics = new PIXI.Graphics();
  helper.addChild(graphics);

  app.stage.addChild(objContainer);
  app.renderer.render(app.stage);
}

function setVideo() {
  // サポート外の時の対応はしっかり考えたい（カメラがない時とか）
  const supports = navigator.mediaDevices.getSupportedConstraints();
  if (!supports.width || !supports.height || !supports.facingMode) {
    alert("not support!");
    return;
  }

  // カメラのストリームを取得してそれぞれに設定する
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((streamValue) => {
      stream = streamValue;
      video.srcObject = streamValue;

      // 読み込み終わってたらここで終了する
      // ここから下は addEventLister とかなので２回目は動かなくていいので
      // ２回目ここに来る時は
      if (isLoaded) {
        return;
      }

      // ビデオの再生準備ができたら色々設定したり実行したいるする
      video.addEventListener("loadeddata", (e) => {
        console.log("loadeddata", e);

        // ２回目は再生するだけ
        if (isLoaded) {
          video.play();
          // let currentTrack;
          // stream.getVideoTracks().forEach(track => {
          //     if (track.readyState == 'live') {
          //         currentTrack = track;
          //         return;
          //     }
          // });
        }

        // ビデオを投影するオブジェクトを設定
        // console.log('canvasのサイズ', app.screen.width, app.screen.height)
        videoSprite = PIXI.Sprite.from(video);
        videoSprite.anchor.set(0.5);
        videoSprite.scale.x = cameraMode ? -1 : 1; // 反転
        videoSprite.zIndex = 2;

        // ビデオの画角設定
        setSize();

        // ステージに追加
        objContainer.addChild(videoSprite);

        // 初回だけやりたい画像の設定とか
        if (!isLoaded) {
          isLoaded = true;
          console.log(loaderEl);
          loaderEl.remove();

          // 王冠画像取得
          const loader = new PIXI.Loader();
          loader.add("oukan", "./oukan.png");

          // 読み込み終わったら設定して追加
          loader.load((loader, resources) => {
            oukan = new PIXI.Sprite(resources.oukan.texture);
            oukan.zIndex = 3;
            oukan.anchor.set(0.5);
            oukan.scale.set(scale);
            oukan.rotation = rotate;
            oukan.position.x = app.screen.width / 2;
            oukan.position.y = app.screen.height / 4;
            objContainer.addChild(oukan);
          });

          let moveMode = false;
          let scaleMode = false;
          let basePosition = { x: 0, y: 0 };
          let _multiPosition = null;

          // タップされた時の基準となる数値を保存する用の変数
          let vPosition = { x: 0, y: 0 };
          let vScale = null;
          let vD = null;
          let vRoutation = null;
          let vRad = null;

          app.renderer.plugins.interaction.on("pointerdown", (event) => {
            const touches = event.data.originalEvent.targetTouches;
            console.log(touches);
            if (!touches || touches.length == 1) {
              // シングルタップ
              moveMode = true;
              scaleMode = false;
              basePosition.x = oukan.position.x;
              basePosition.y = oukan.position.y;
              vPosition.x =
                app.renderer.plugins.interaction.eventData.data.global.x;
              vPosition.y =
                app.renderer.plugins.interaction.eventData.data.global.y;
              console.log(vPosition);
            } else if (touches.length == 2) {
              // マルチタップ
              moveMode = false;
              scaleMode = true;
              _multiPosition = event.data.originalEvent.targetTouches;
              setMultiPosition(
                _multiPosition[0].clientX,
                _multiPosition[0].clientY,
                _multiPosition[1].clientX,
                _multiPosition[1].clientY
              );
              basePosition.x = oukan.position.x;
              basePosition.y = oukan.position.y;
              vPosition.x = multiPosition.p3.x;
              vPosition.y = multiPosition.p3.y;
              vScale = scale;
              vD = multiPosition.d;
              vRoutation = rotate;
              vRad = multiPosition.rad;
            }
          });

          app.renderer.plugins.interaction.on("pointermove", (event) => {
            if (moveMode) {
              const vx =
                app.renderer.plugins.interaction.eventData.data.global.x -
                vPosition.x;
              const vy =
                app.renderer.plugins.interaction.eventData.data.global.y -
                vPosition.y;
              setPosition(basePosition.x + vx, basePosition.y + vy);
            } else if (scaleMode) {
              // マルチタップ
              _multiPosition = event.data.originalEvent.targetTouches;
              setMultiPosition(
                _multiPosition[0].clientX,
                _multiPosition[0].clientY,
                _multiPosition[1].clientX,
                _multiPosition[1].clientY
              );
              const vx = multiPosition.p3.x - vPosition.x;
              const vy = multiPosition.p3.y - vPosition.y;
              setPosition(basePosition.x + vx, basePosition.y + vy);
              rotate = vRoutation + (multiPosition.rad - vRad);
              const s = vScale + (multiPosition.d - vD) * 0.001;
              scale = s >= 0.1 ? s : 0.1;
              oukan.scale.set(scale);
              oukan.rotation = rotate;
            }
          });

          app.renderer.plugins.interaction.on("pointerup", () => {
            moveMode = false;
            multiPosition = null;
            vScale = null;
            vRoutation = null;
            vRad = null;
            vD = null;
          });

          app.ticker.add(() => {
            if (isDev) {
              setHelper();
            }
          });
        }
      });
    })
    .catch((e) => {
      alert("NOT SP! CONTENTS ONLY SP!");
      console.log(e);
    });

  let timer = null;
  window.addEventListener("resize", () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      cameraHeight = window.innerHeight;
      app.renderer.resize(window.innerWidth, window.innerHeight);
      setSize();
    }, 200);
  });
}

/**
 * ビデオのサイズを調整
 * 縦長、横長を検知して画面いっぱいになるように調整（ちょっとおかしくなる画角もあるかも）
 */
function setSize() {
  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;

  videoSprite.position.x = app.screen.width / 2;
  videoSprite.position.y = app.screen.height / 2;

  if (window.innerWidth > window.innerHeight) {
    // 横幅の方が広い場合
    videoSprite.width = app.screen.width;
    videoSprite.height = (videoHeight * app.screen.width) / videoWidth;
  } else {
    // 縦幅の方が広い場合
    videoSprite.width = (videoWidth * app.screen.height) / videoHeight;
    videoSprite.height = app.screen.height;
  }
}

function setMultiPosition(x1, y1, x2, y2) {
  const x3 = (x1 + x2) / 2;
  const y3 = (y1 + y2) / 2;

  // 距離
  const d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

  // 角度
  const rad = Math.atan2(y3 - y1, x3 - x1);
  const baseDeg = x3 > x1 ? 90 : 270; // 常に正の方を向きたいので
  const rad2 = baseDeg * (Math.PI / 180);
  // const deg = rad * (180 / Math.PI);

  const x4 = (d / 2) * Math.cos(rad - rad2) + x3;
  const y4 = (d / 2) * Math.sin(rad - rad2) + y3;

  multiPosition = {
    rad: rad,
    rad2: rad2,
    d: d,
    p1: {
      x: x1,
      y: y1,
    },
    p2: {
      x: x2,
      y: y2,
    },
    p3: {
      x: x3,
      y: y3,
    },
    p4: {
      x: x4,
      y: y4,
    },
  };
}

function setPosition(x, y) {
  oukan.position.x = x;
  oukan.position.y = y;
}

function save() {
  saveImage = app.view.toDataURL("image/png");
  console.log("save", saveImage, modal);
  modal.querySelector("img").src = saveImage;
  modal.classList.add("active");
}

function closeModal() {
  saveImage = null;
  modal.querySelector("img").src = null;
  modal.classList.remove("active");
}

function change() {
  if (stream !== null) {
    stream.getVideoTracks().forEach((camera) => {
      camera.stop();
    });
  }

  objContainer.removeChild(videoSprite);

  if (constraints.video.facingMode === "user") {
    constraints.video.facingMode = { exact: "environment" };
  } else {
    constraints.video.facingMode = "user";
  }
  setVideo();
}

window.addEventListener("load", init);
