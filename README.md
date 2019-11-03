# chrome-performance-video

make a webm video from a chrome performance profile.

[![image](https://user-images.githubusercontent.com/1215767/67963241-a2728a00-fc41-11e9-8cd0-93197d19762e.png)](https://kyuwoo-choi.github.io/chrome-performance-video/)

# try online
[demo](https://kyuwoo-choi.github.io/chrome-performance-video)

# docs
* [api](https://kyuwoo-choi.github.io/chrome-performance-video/api)
* [example](https://github.com/kyuwoo-choi/chrome-performance-video/tree/master/example)

# install
```
npm install chrome-performance-video
```

```
yarn add chrome-performance-video
```

# usage
```js
import performanceProfile from '../test/fixtures/performance-profile.json'

const video = await chromePerformanceVideo(performanceProfile)
const player = document.querySelector('#player')
player.src = URL.createObjectURL(video)
player.load()
```

# license

MIT © KyuWoo Choi
