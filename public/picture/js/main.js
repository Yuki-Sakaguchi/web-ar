document.addEventListener('load', () => {
  const canvas = document.querySelector('#canvas')
  const video = document.querySelector('#video')
  const shootButton = document.querySelector('#shoot')
  const changeButton = document.querySelector('#change')
  const img = document.querySelector('#img')
  const ctx = canvas.getContext('2d')

  function shoot () {
    const w = video.offsetWidth
    const h = video.offsetHeight
    canvas.setAttribute('width', w)
    canvas.setAttribute('height', h)
    ctx.drawImage(video, 0, 0, w, h)
    // console.log(canvas.toDataURL('images/png'))
    img.src = canvas.toDataURL('images/png')
    lity('#modal')
  }

  function change () {
    useFront = !useFront
    syncCamera()
  }

  shootButton.addEventListener('click', shoot)

  changeButton.addEventListener('click', change)
})