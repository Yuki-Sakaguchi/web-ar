document.addEventListener('DOMContentLoaded', () => {
  var tettereee = new AudioPlayer('sound/tettereee.mp3')

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

  const canvas = document.querySelector('#canvas')
  const video = document.querySelector('#video')
  const shootButton = document.querySelector('#shoot')
  const changeButton = document.querySelector('#change')
  const img = document.querySelector('#img')
  const ctx = canvas.getContext('2d')

  // 1 = しんちゃん, 2 = どらえもん, logo = ヒプ
  let type = 1
  if (location.href.indexOf('chara=2') >= 0) {
    type = 2
  } else if (location.href.indexOf('chara=logo') >= 0) {
    type = 3
  } else if (location.href.indexOf('chara=logo-white') >= 0) {
    type = 4 
  }

  function setSize () {
    const w = video.offsetWidth
    const h = video.offsetHeight
    canvas.setAttribute('width', w)
    canvas.setAttribute('height', h)
    return [w, h]
  }

  function setImage () {
    const width = 310
    const height = 345
    ctx.drawImage(chara, 0, 0, width, height, -30, window.innerHeight - height, width, height)
  }

  function shoot () {
    if (type == 2) {
      tettereee.play();
    }

    const [w, h] = setSize()
    if (video.getAttribute('style') == 'transform: scaleX(-1)') {
      // 動画が反転している場合には反転させてからcanvasに描画
      ctx.scale(-1,1);
      ctx.translate(-w, 0);
    }
    ctx.drawImage(video, 0, 0, w, h)

    if (video.getAttribute('style') == 'transform: scaleX(-1)') {
      // 動画の上にキャラクターを際描画するのでもう一度反転させて普通に戻してから描画
      ctx.scale(-1,1);
      ctx.translate(-w, 0);
    }
    setImage()

    // canvasの状態をimgに転写してモーダルで表示
    img.src = canvas.toDataURL('images/png')
    lity('#modal')

    // モーダルの後ろに止まった画像が出てしまうのでクリアする
    ctx.clearRect(0, 0, w, h);
    setImage()
  }

  function change () {
    useFront = !useFront
    syncCamera()
  }

  shootButton.addEventListener('click', shoot)
  changeButton.addEventListener('click', change)

  change()
  setSize()

  const chara = new Image()
  if (type == 2) {
    chara.src = './images/02.png'
  } else if (type == 3) {
    chara.src = './images/logo_black.png'
  } else if (type == 4) {
    chara.src = './images/logo_white.png'
  } else {
    chara.src = './images/01.png'
  }
  chara.onload = () => {
    setImage()
  }

  if (type === 2) {
    // どらえもんの時は音が出るので注意文言を表示
    const p = document.createElement('p')
    p.textContent = '※ 写真を取る時に音が鳴ります'
    p.classList.add('notice');
    document.body.appendChild(p);
    document.body.classList.add('draemon');
  }
})