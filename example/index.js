import chromePerformanceVideo from '../lib/index.js'
import performanceProfile from '../test/fixtures/performance-profile.json'

const download = (video, fileName = 'performance.webm') => {
  const url = window.URL.createObjectURL(video)
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  })
}

document.addEventListener('DOMContentLoaded', async () => {
  const video = await chromePerformanceVideo(performanceProfile)
  const player = document.querySelector('#player')
  player.src = URL.createObjectURL(video)
  player.load()

  const downloadButton = document.querySelector('#download')
  downloadButton.disabled = false
  downloadButton.addEventListener('click', () => download(video))
})
