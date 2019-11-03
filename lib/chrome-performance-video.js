export const chromePerformanceVideo = async profile => {
  if (!Array.isArray(profile)) {
    throw new Error('not chrome performance profile')
  }
  const screenShots = profile.filter(model => model.name === 'Screenshot')
  if (screenShots.length === 0) {
    throw new Error('no screenshot')
  }
  const startTime = profile[0].ts
  const frames = await screenShotsToFrames(screenShots, startTime)
  const video = framesToVideo(frames)

  return video
}

export const snapshotToImage = snapshot => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = err => reject(err)
    img.src = `data:image/png;base64,${snapshot}`
  })
}

export const screenShotsToFrames = async (screenshots, startTime) => {
  return Promise.all(
    screenshots.map(async screenshot => {
      return {
        time: (screenshot.ts - startTime) / 1000, // in ms
        image: await snapshotToImage(screenshot.args.snapshot),
      }
    }),
  )
}

export const drawFrames = async (canvas, frames) => {
  const ctx = canvas.getContext('2d')
  const { width, height } = frames[0].image
  const startTime = Date.now()

  frames = [...frames]
  let frame = { time: 0, image: null }

  ctx.font = '20px Arial'
  ctx.textAlign = 'right'
  while (frames.length > 0) {
    let now = Date.now() - startTime
    while (frames.length > 0 && now >= frames[0].time) {
      frame = frames.shift()
      now = frame.time
    }

    // clear background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // image
    if (frame.image) {
      ctx.drawImage(frame.image, 0, 0)
    }

    // timestamp
    ctx.fillStyle = '#ff0000'
    ctx.fillText(`${(now / 1000).toFixed(3)}s`, width - 20, height - 20)

    await new Promise(res => requestAnimationFrame(res))
  }
}

export const framesToVideo = async frames => {
  const MEDIA_TYPE = 'video/webm;codecs=h264'
  const canvas = document.createElement('canvas')
  canvas.width = frames[0].image.width
  canvas.height = frames[0].image.height
  const stream = canvas.captureStream()
  const recorder = new MediaRecorder(stream, {
    mimeType: MEDIA_TYPE,
  })
  recorder.start()

  const streamData = []
  recorder.ondataavailable = event => streamData.push(event.data)

  await drawFrames(canvas, frames)

  recorder.stop()
  await new Promise(res => (recorder.onstop = res))

  return new Blob(streamData, { type: MEDIA_TYPE })
}
