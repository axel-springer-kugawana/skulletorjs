import { mediaSkeleton } from '../'
import { announceBlock, announceLine } from './shapes'

const dom = document.getElementById('root')

const loadingFinished = document.createElement('div')

const fakePromise = new Promise((resolve) => {
  setTimeout(() => resolve('Loading finished'), 2000)
})

mediaSkeleton({
  'max-width: 639px': [announceBlock(), announceBlock()],
  'min-width: 640px': [announceLine(), announceLine()],
}, fakePromise, dom).then((message) => {
  loadingFinished.innerText = message
  dom.appendChild(loadingFinished)
})