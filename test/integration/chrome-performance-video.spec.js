import {
  chromePerformanceVideo,
  snapshotToImage,
  screenShotsToFrames,
  framesToVideo,
} from '../../lib/chrome-performance-video'

describe('chrome performance video', () => {
  let profile
  let screenshots
  before(async () => {
    profile = await cy.fixture('performance-profile.json')
    screenshots = profile.filter(data => data.name === 'Screenshot')
  })

  context('chromePerformanceVideo', () => {
    it('should throw if given profile is not an array', async () => {
      let error
      try {
        await chromePerformanceVideo()
      } catch (e) {
        error = e
      }
      expect(error).to.be.instanceOf(Error)
    })
    it('should throw if given profile has no screenshot', async () => {
      let error
      try {
        await chromePerformanceVideo([])
      } catch (e) {
        error = e
      }
      expect(error).to.be.instanceOf(Error)
    })
    it('should return blob', async () => {
      const imageBlob = await chromePerformanceVideo(profile)
      expect(imageBlob).to.be.instanceOf(Blob)
    })
  })

  context('screenshotToImage', () => {
    it('should return image', async () => {
      const img = await snapshotToImage(screenshots[0].args.snapshot)
      expect(img instanceof Image).to.eq(true)
    })

    it('should load image', async () => {
      const img = await snapshotToImage(screenshots[0].args.snapshot)
      expect(img.complete).to.eq(true)
      expect(img.naturalWidth, 264)
    })
  })

  context('screenshotsToFrames', () => {
    it('should return frames with image & time', async () => {
      const frames = await screenShotsToFrames(screenshots, profile[0].ts)
      expect(frames.length).to.eq(screenshots.length)
      frames.forEach(frame => {
        expect(typeof frame.time).to.eq('number')
        expect(frame.image.complete).to.eq(true)
        expect(frame.image.naturalWidth).to.eq(264)
        expect(frame.image.naturalHeight).to.eq(498)
      })
    })
  })

  context('framesToVideo', () => {
    it('should return blob', async () => {
      const imageBlob = await framesToVideo([
        { time: 0, image: new Image() },
        { time: 100, image: new Image() },
      ])
      expect(imageBlob).to.be.instanceOf(Blob)
    })
  })
})
