document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('#canvas')
  const video = document.querySelector('#video')
  const shootButton = document.querySelector('#shoot')
  const changeButton = document.querySelector('#change')
  const img = document.querySelector('#img')
  const ctx = canvas.getContext('2d')

  // 1 = しんちゃん, 2 = どらえもん
  let type = location.href.indexOf('chara=2') >= 0 ? 2 : 1

  function setSize () {
    const w = video.offsetWidth
    const h = video.offsetHeight
    canvas.setAttribute('width', w)
    canvas.setAttribute('height', h)
    return [w, h]
  }

  function setImage () {
    if (type == 2) {
      let zoom = 0.5 
      const width = 400
      const height = 588
      ctx.scale(zoom, zoom)
      ctx.drawImage(chara, 0, 0, width, height, 0, window.innerHeight + (height*zoom), width, height)
    } else {
      const width = 310
      const height = 345
      ctx.drawImage(chara, 0, 0, width, height, -30, window.innerHeight - height, width, height)
    }
  }

  function shoot () {
    
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
  chara.src = type == 2 ? './images/02.png' : './images/01.png'
  chara.onload = () => {
    setImage()
  }
})