/**
 * three.jsのメイン処理
 */
(function() {

    // グローバル変数
    var camera, scene, renderer, controls, mouse, raycaster
    var mesh = [],
        param = getParam(),
        boxCount = param.box != null && !Number.isNaN(param.box) ? param.box : 50

    // Element
    var elCanvas = document.querySelector('#canvas')
    var elResult = document.querySelector('#result')
    var elStart = document.querySelector('#start')

    // 事前ロード
    var hatenaTexture = new THREE.TextureLoader().load('images/hatena.jpg')
    var hatenaSettledTexture = new THREE.TextureLoader().load('images/hatena_o.jpg')
    var coinTexture = new THREE.TextureLoader().load('images/coin.gif')
    var coin = new AudioPlayer('sound/coin.mp3')
    var b = new AudioPlayer('sound/b.mp3')
    var star = new AudioPlayer('sound/star.mp3')

    /**
     * Audioプレイヤークラス
     */
    function AudioPlayer (sound) {
        this.audio = new Audio(sound)
        this.audio.load()
    }
    AudioPlayer.prototype.play = function () {
        this.audio.pause()
        this.audio.currentTime = 0
        this.audio.play()
    }
    AudioPlayer.prototype.loopPlay = function () {
        var _this = this
        this.play()
        this.audio.addEventListener('ended', function () {
            _this.audio.play()
        })
    }

    /**
     * 設定の初期化
     */
    function init () {
        // カメラ設定
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 4000)
        camera.position.y = 300
        camera.position.z = 1000

        // ジャイロセンサーとカメラを紐づける
        controls = new THREE.DeviceOrientationControls(camera, true)

        // シーン追加
        scene = new THREE.Scene()

        // レンダラーを追加
        renderer = new THREE.WebGLRenderer({ canvas: elCanvas, antialias: true, alpha: true })
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(window.innerWidth, window.innerHeight)
        window.addEventListener('resize', onWindowResize)

        // マウスのクリック
        mouse = new THREE.Vector2()
        elCanvas.addEventListener('touchstart', onTouch) // タップした位置を計算
        elCanvas.addEventListener('click', onClick) // 位置を計算した後に処理したいものはこっち

        // レイキャスト作成
        raycaster = new THREE.Raycaster()

        // BOX生成
        for (var i = 0; i < boxCount; i++) {
            createBox()
        }
    }

    /**
     * キューブを生成する
     */
    function createBox () {
        var geometry = new THREE.BoxBufferGeometry(100, 100, 100)
        var material = new THREE.MeshBasicMaterial({ map: hatenaTexture })
        var meshBox = new THREE.Mesh(geometry, material)
        scene.add(meshBox)
        mesh.push(meshBox)

        // ランダムで配置
        var interval = 750
        meshBox.position.x = createRandom(-interval*2, interval*2)
        meshBox.position.y = createRandom(-interval, interval)
        meshBox.position.z = createRandom(-interval, interval*5)
        meshBox.settled = false
    }

    /**
     * コインを作成し、アニメーションして消える
     */
    function createCoin (x, y, z) {
        var geometry = new THREE.PlaneGeometry(100, 121.5)
        var material = new THREE.MeshBasicMaterial({ map: coinTexture, transparent: true })
        var plane = new THREE.Mesh(geometry, material)
        plane.position.x = x
        plane.position.y = y + 100
        plane.position.z = z
        plane.material.opacity = 0
        plane.rotation.setFromRotationMatrix(camera.matrix)
        scene.add(plane)

        var defaultPositionY = plane.position.y
        var positionY = plane.position.y + 80

        // 上に上がる
        var t1 = new TWEEN.Tween({
                y: defaultPositionY,
                alpha: 0
            })
            .to({
                y: positionY,
                alpha: 1
            }, 150)
            .easing(TWEEN.Easing.Quintic.Out)
            .onUpdate(function () {
                plane.position.y = this._object.y
                plane.material.opacity = this._object.alpha
            })
            .onComplete(function() {
                t2.start()
            })
        
        // 下に下がる
        var t2 = new TWEEN.Tween({
                y: positionY,
                alpha: 1
            })
            .to({
                y: defaultPositionY,
                alpha: 0
            }, 60)
            .easing(TWEEN.Easing.Quadratic.In)
            .onUpdate(function () {
                plane.position.y = this._object.y
                plane.material.opacity = this._object.alpha
            })
            .onComplete(function() {
                scene.remove(plane)
            })

        t1.start()
    }

    /**
     * クリックした時の処理
     */
    function onTouch (event) {
        // 画面の割合を計算
        var element = event.currentTarget
        var x = event.pageX - element.offsetLeft
        var y = event.pageY - element.offsetTop
        var w = element.offsetWidth
        var h = element.offsetHeight
        mouse.x = (x/w) * 2 - 1
        mouse.y = -(y/h) * 2 + 1
    }

    /**
     * クリックを解除した時
     */
    function onClick (event) {
        // レイキャストからクリックされているオブジェクトを取得
        raycaster.setFromCamera(mouse, camera)

        // 当たり判定があれば、ボックスを消す
        // コインの音を鳴らすためにtouchイベントの中に書いておく
        var intersects = raycaster.intersectObjects(scene.children)
        if (intersects.length > 0) {
            // 当たり判定があったものは消す
            for (var i = 0; i < intersects.length; i++) {
                // 画像を変更する
                var m = intersects[i].object
                m.material.map = hatenaSettledTexture
                if (m.settled) {
                    b.play()
                } else {
                    coin.play()
                    createCoin(m.position.x, m.position.y, m.position.z)
                }
                m.settled = true // 変更済み
                setTimeout(function () {
                    scale(m)
                }, 30);
            }
        }
    }

    /**
     * windowのリサイズイベント
     */
    function onWindowResize () {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    /**
     * ランダムの値を生成
     */
    function createRandom (min, max) {
        return Math.floor(Math.random() * (max + 1 - min)) + min
    }

    /**
     * URLからパラメータを取得する
     */
    function getParam () {
        var arg = {}
        var pair = location.search.substring(1).split('&')
        for (var i = 0; pair[i]; i++) {
            var kv = pair[i].split('=')
            arg[kv[0]] = kv[1]
        }
        return arg
    }

    /**
     * スケールを大きくする
     */
    function scale (m) {
        var defaultScale = 1
        var maxScale = 1.2

        var t1 = new TWEEN.Tween({scale: defaultScale})
            .to({scale: maxScale}, 50)
            .easing(TWEEN.Easing.Exponential.Out)
            .onUpdate(function () { m.scale.x = m.scale.y = m.scale.z = this._object.scale })
            .onComplete(function () { t2.start() })

        var t2 = new TWEEN.Tween({scale: maxScale})
            .to({scale: defaultScale}, 50)
            .easing(TWEEN.Easing.Exponential.In)
            .onUpdate(function () { m.scale.x = m.scale.y = m.scale.z = this._object.scale })
            .onComplete(function () { t2.start() })

        t1.start()
    }

    /**
     * 描画
     */
    function render () {
        // コントローラー更新
        controls.update()

        // レイキャストからクリックされているオブジェクトを取得
        raycaster.setFromCamera(mouse, camera)

        // 回転
        if (mesh.length > 0) {
            // オブジェクトを回転
            for (var i = 0; i < mesh.length; i++) {
                if (!mesh[i].settled) {
                    mesh[i].rotation.x += 0.01
                    mesh[i].rotation.y += 0.01
                    mesh[i].rotation.z += 0.01
                }
            }
        }

        // オブジェクトの数を表示
        elResult.textContent = mesh.filter(function(e) { return !e.settled }).length

        renderer.render(scene, camera)
        window.requestAnimationFrame(render)
        TWEEN.update()
    }

    // 処理開始
    elStart.addEventListener('click', function () {
        this.remove()
        star.loopPlay()
        init()
        render()
    })

})()