// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import uniqid from 'uniqid'

// import skeletor from '../'
import skeletor from '../v0.0.3/skeletor'
import { applyBaseCSS } from '../v0.0.3/middleware-manager'

import { announceBlock, announceLine } from './shapes'

const dom = document.getElementById('root')

const loadingFinished = document.createElement('div')

const fakePromise = new Promise((resolve) => {
  setTimeout(() => resolve('Loading finished'), 2000)
})

const { Skeletor, end } = skeletor(
  {
    'max-width: 639px': [announceBlock(), announceBlock()],
    'min-width: 640px': [announceLine(), announceLine()],
  },
  [applyBaseCSS],
)

dom.appendChild(Skeletor)

fakePromise.then((message) => {
  loadingFinished.innerText = message
  end().then(() => {
    dom && dom.appendChild(loadingFinished)
  })
})

// class Toto extends React.Component {
//   state = {
//     loading: true,
//   }

//   componentDidMount() {
//     fakePromise.then(() => this.setState({ loading: false }))
//   }

//   render() {
//     const { loading } = this.state

//     return (
//       <React.Fragment>
//         <Skeletor end={!loading} />
//       </React.Fragment>
//     )
//   }
// }

// ReactDOM.render(<Toto />, dom)

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

/*
// EN REACT

const { Skeleton } = skeletor({
  'max-width: 639px': [announceBlock(), announceBlock()],
  'min-width: 640px': [announceLine(), announceLine()],
})

const Test = () => (
  <div>
    <Skeleton /> // Au passage de la props End à true, le skeleton fade out puis disparaît, possibilité de passer une fonction qui sera appelé après le fade out.
  </div>
)

// EN NATIF

const { skeleton, end } = skeletor({
  'max-width: 639px': [announceBlock(), announceBlock()],
  'min-width: 640px': [announceLine(), announceLine()],
})

dom.appendChild(skeleton)

fakePromise.then(() => {
  end(() => {
    // Appelé après le fadeout
  })
})

// Dans les deux cas : Il faudra changer le type de retour de skeletor et passer par l'adapter.

*/
