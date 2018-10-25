// @flow

// import React from 'react'
// import ReactDOM from 'react-dom'
// import uniqid from 'uniqid'

// import skeletor, { applyFadeOut } from '../src/adapter/react'

import skeletor, { applyFadeOut } from '../src/adapter/vanilla'
import { applyBaseCSS, applyAnimation } from '../src/middlewares'

import { announceBlock, announceLine } from './shapes'

const dom = document.getElementById('root')

/* VANILLA SANDBOX */

const loadingFinished = document.createElement('div')

const { Skeletor, end, restart } = skeletor(
  {
    'max-width: 639px': [announceBlock(), announceBlock()],
    'min-width: 640px': [announceLine(), announceLine()],
  },
  [applyBaseCSS, applyAnimation, applyFadeOut],
)

dom.appendChild(Skeletor)

const fakePromise = new Promise((resolve) => {
  setTimeout(() => resolve('Loading finished'), 2000)
})

fakePromise.then((message) => {
  loadingFinished.innerText = message
  end().then(() => {
    dom && dom.appendChild(loadingFinished)

    setTimeout(() => {
      const { Skeletor } = restart()
      dom.appendChild(Skeletor)

      setTimeout(() => {
        end()
      }, 1000)
    }, 1000)
  })
})

/* REACT SANDBOX */

// class TestLoading extends React.Component {
//   state = {
//     loading: true,
//     message: null,
//     displayMessage: false,
//   }

//   Skeletor = (() => {
//     const { Skeletor } = skeletor(
//       {
//         'max-width: 639px': [announceBlock(), announceBlock()],
//         'min-width: 640px': [announceLine(), announceLine()],
//       },
//       [applyBaseCSS, applyAnimation, applyFadeOut],
//     )

//     return Skeletor
//   })()

//   componentDidMount() {
//     const fakePromise = new Promise((resolve) => {
//       setTimeout(() => resolve('Loading finished'), 2000)
//     })

//     fakePromise.then((message) => this.setState({ loading: false, message }))
//   }

//   render() {
//     const { loading, message, displayMessage } = this.state
//     const Skeletor = this.Skeletor

//     return (
//       <React.Fragment>
//         <Skeletor end={!loading} onDisapear={() => this.setState({ displayMessage: true })} />
//         {displayMessage && <div>{message}</div>}
//       </React.Fragment>
//     )
//   }
// }

// class App extends React.Component {
//   state = {
//     load: false,
//   }

//   render() {
//     const { load } = this.state
//     return (
//       <div>
//         {!load && <button onClick={() => this.setState({ load: true })}>Start</button>}
//         {load && <TestLoading />}
//       </div>
//     )
//   }
// }

// ReactDOM.render(<App />, dom)
