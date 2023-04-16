/**
 * 画面にタップをするとショットを打つ
 * 丸の位置のマップを画面の真ん中に表示し、向きに合わせてマップを回転させる
 *
 * THREE.Clockで時間経過
 * camera.quaternionでカメラの向きとShotクラスのオブジェクトの向きを合わせる
 * オブジェクトの当たり判定はRaycaster
 */

let isGyro = false;
if (window.DeviceOrientationEvent && "ontouchstart" in window) {
  isGyro = true;
}

// デバイスの情報 ----------------------------------------
let alpha = 0,
  beta = 0,
  gamma = 0;

window.addEventListener("deviceorientation", (dat) => {
  alpha = dat.alpha; // z軸（表裏）まわりの回転の角度（反時計回りがプラス）
  beta = dat.beta; // x軸（左右）まわりの回転の角度（引き起こすとプラス）
  gamma = dat.gamma; // y軸（上下）まわりの回転の角度（右に傾けるとプラス）
});

// three.js ----------------------------------------
let camera, scene, light, renderer, controls, clock, delta;
let enemyList = [],
  ENEMY_MAX_COUNT = 6,
  shotList = [],
  createDelayTime = 2000,
  far = 4000;
let player, nav;

let elCanvas = document.querySelector("#canvas");
let elResult = document.querySelector("#result");
let elTxt = document.querySelector("#txt");

/**
 * オブジェクトの生成用のクラス
 * @class Factory
 * @extends THREE.Mesh
 */
class Factory extends THREE.Mesh {
  constructor() {
    // オブジェクト生成
    let geometry = new THREE.SphereGeometry(100, 32, 32);
    let material = new THREE.MeshNormalMaterial();
    super(geometry, material);

    this.degree = -140;
    this.offsetZ = 0;
    this.offsetY = 100;
    this.radius = 1500;
    this.degreeIncrement = 0.5;
  }

  /**
   * オブジェクトの位置を移動
   */
  move() {
    this.degree += this.degreeIncrement;
    let rad = (this.degree * Math.PI) / 180;
    let x = this.radius * Math.cos(rad); // X座標 = 半径 x Cosθ
    let z = this.radius * Math.sin(rad); // Y座標 = 半径 x Sinθ
    this.position.set(x, this.offsetY, z + this.offsetZ);
  }
}

/**
 * 球を発射する
 * @class Shot
 * @extends THREE.Mesh
 */
class Shot extends THREE.Mesh {
  constructor() {
    let geometry = new THREE.SphereGeometry(100, 16, 16);
    let material = new THREE.MeshLambertMaterial({ color: 0xffff00 });
    super(geometry, material);

    // 初期位置と方向をカメラに合わせる
    this.quaternion.copy(camera.quaternion);
    this.position.set(0, 200, 0);

    this.speed = 5000;
  }

  /**
   * オブジェクトの位置を移動
   */
  move() {
    this.translateZ(-this.speed * delta);
  }
}

/**
 * 設定の初期化
 */
function setCanvas() {
  // カメラ設定
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    far
  );
  camera.position.y = 300;

  // ジャイロセンサーとカメラを紐づける
  controls = new THREE.DeviceOrientationControls(camera, true);

  // シーン追加
  scene = new THREE.Scene();

  // ライトを追加
  light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 1000, 30);
  scene.add(light);

  // 時間経過
  clock = new THREE.Clock();

  // レンダラーを追加
  renderer = new THREE.WebGLRenderer({
    canvas: elCanvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // 回転するオブジェクトを生成する
  let timer = 0;
  timer = setInterval(function () {
    if (enemyList.length < ENEMY_MAX_COUNT) {
      let enemy = new Factory();
      scene.add(enemy);
      enemyList.push(enemy);
      ui.createShape();
    } else {
      clearInterval(timer);
    }
  }, createDelayTime);

  // clickでショットを発車
  var mytap = window.ontouchstart === null ? "touchstart" : "click";
  window.addEventListener(mytap, () => {
    let shot = new Shot();
    scene.add(shot);
    shotList.push(shot);
  });

  render();
}

/**
 * 描画
 */
function render() {
  // 時間更新
  delta = clock.getDelta();

  // コントローラー更新
  controls.update();

  // 回転
  if (enemyList.length > 0) {
    // オブジェクトを回転
    for (let i = 0; i < enemyList.length; i++) {
      enemyList[i].move();
    }
  }

  // ショット
  if (shotList.length > 0) {
    // オブジェクトを回転
    for (let i = 0; i < shotList.length; i++) {
      let shot = shotList[i];
      shot.move();
      if (
        Math.abs(shot.position.x) > far ||
        Math.abs(shot.position.y) > far ||
        Math.abs(shot.position.z) > far
      ) {
        scene.remove(shot);
        shotList.splice(i, 1);
      }
    }
  }

  // 球とショットの当たり判定
  if (enemyList.length > 0 && shotList.length > 0) {
    for (let i = 0; i < enemyList.length; i++) {
      let enemy = enemyList[i];
      let target = factoryShapeList[i];
      for (
        let vertexIndex = 0;
        vertexIndex < enemy.geometry.vertices.length;
        vertexIndex++
      ) {
        let localVertex = enemy.geometry.vertices[vertexIndex].clone();
        let globalVertex = localVertex.applyMatrix4(enemy.matrix);
        let directionVector = globalVertex.sub(enemy.position);

        let ray = new THREE.Raycaster(
          enemy.position,
          directionVector.clone().normalize()
        );
        let collisionResults = ray.intersectObjects(shotList);
        if (
          collisionResults.length > 0 &&
          collisionResults[0].distance < directionVector.length()
        ) {
          console.log("hit");
          scene.remove(enemy);
          enemy.material.dispose();
          enemy.geometry.dispose();
          enemyList[i] = enemy = undefined;

          ui.stage.removeChild(target.shape);
          enemyList.splice(i, 1);
          factoryShapeList.splice(i, 1);

          break;
        }
      }
    }
  }

  // オブジェクトの数を表示
  elResult.textContent = enemyList.length;

  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
}

var init = function () {
  if (isGyro) {
    // ジャイロあり

    // ジャイロが有効化できるか
    let resGyro = false;
    window.addEventListener("deviceorientation", doGyro, false);
    function doGyro() {
      resGyro = true;
      window.removeEventListener("deviceorientation", doGyro, false);
    }

    //数秒後に判定
    setTimeout(function () {
      if (resGyro) {
        //ジャイロが動いた
        setCanvas();
      } else {
        //ジャイロ持ってるくせに動かなかった
        if (typeof DeviceOrientationEvent.requestPermission === "function") {
          //iOS13+方式ならクリックイベントを要求
          //ユーザアクションを得るための要素を表示
          DeviceOrientationEvent.requestPermission().then((res) => {
            //「動作と方向」が許可された
            if (res === "granted") {
              setCanvas();
              //「動作と方向」が許可されなかった
            } else {
              isGyro = false;
              setCanvas();
            }
          });
        } else {
          //iOS13+じゃない
          //早くアップデートしてもらうのを祈りながら諦める
          isGyro = false;
          setCanvas();
        }
      }
    }, 300);
  } else {
    // PCなどのジャイロなし
    setCanvas();
  }
};

init();

// create.js ----------------------------------------
let factoryShapeList = [];

let ui = new GameCapsule({
  target: "#nav",
  isRetina: true,
  isTouch: true,
});

/**
 * Three.jsが作る敵オブジェクトと同期させるUIオブジェクトの生成クラス
 * @class FactoryShape
 */
class FactoryShape {
  constructor() {
    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill("#007bff").drawCircle(0, 0, 8);
  }
}

ui.init = function () {
  /** x軸を画面の真ん中にように */
  const getX = () => this.divisionRetina(this.stage.canvas.width) / 2;

  /** y軸を画面の真ん中より下の方に */
  const getY = () => this.divisionRetina(this.stage.canvas.height) - 50;

  // 自分の位置を表示
  let player = new createjs.Shape();
  player.graphics.beginFill("#aa2200");
  player.graphics.moveTo(0, 0);
  player.graphics.lineTo(8, 16);
  player.graphics.lineTo(-8, 16);
  player.graphics.lineTo(0, 0);
  player.x = getX();
  player.y = getY();
  player.regX = 2;
  player.regY = 8;
  this.stage.addChild(player);

  /** オブジェクトの数に合わせてナビオブジェクトの生成 */
  this.createShape = () => {
    const target = new FactoryShape();
    factoryShapeList.push(target);
    this.stage.addChild(target.shape);
  };

  /** ナビオブジェクトの移動 */
  this.move = () => {
    if (factoryShapeList.length > 0) {
      for (let i = 0; i < factoryShapeList.length; i++) {
        const target = factoryShapeList[i].shape;
        let R = 50;
        let radian = Math.atan2(
          enemyList[i].position.z - camera.position.z,
          enemyList[i].position.x - camera.position.x
        );
        let rad = radian + alpha * (Math.PI / 180); // デバイスの角度をプラスした位置に変更
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        target.x = cos * R + getX();
        target.y = sin * R + getY();
      }
    }
  };

  // レティクルを表示
  // ローダーで扱えば、Bitmapで画像を表示時にすぐwidth, heightが取れる
  let bkloader = new createjs.ImageLoader("images/reticule.png", false);
  bkloader.addEventListener("complete", () => {
    let bmp = new createjs.Bitmap("images/reticule.png");
    bmp.x = getX();
    bmp.y = this.divisionRetina(this.stage.canvas.height) / 2;
    bmp.regX = bmp.image.width / 2;
    bmp.regY = bmp.image.height / 2;
    bmp.scaleX = bmp.scaleY = 0.3;
    this.stage.addChild(bmp);
  });
  bkloader.load();
};

ui.update = function (e) {
  this.move();
};

ui.play();
