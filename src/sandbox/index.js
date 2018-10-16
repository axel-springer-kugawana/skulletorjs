// @flow

import React from 'react'
import ReactDOM from 'react-dom'

// import skeletor from '../'
import { announceBlock, announceLine } from './shapes'

import SkeletorReact from '../skeletor-react'

const dom = document.getElementById('root')

const loadingFinished = document.createElement('div')

const fakePromise = new Promise((resolve) => {
  setTimeout(() => resolve('Loading finished'), 2000)
})

ReactDOM.render(
  <SkeletorReact shapeArray={[announceBlock(), announceBlock()]} />,
  dom,
)

// const apply = (element) => dom && dom.appendChild(element)

// skeletor(
//   {
//     'max-width: 639px': [announceBlock(), announceBlock()],
//     'min-width: 640px': [announceLine(), announceLine()],
//   },
//   fakePromise,
//   apply,
// ).then((message) => {
//   loadingFinished.innerText = message
//   dom && dom.appendChild(loadingFinished)
// })
