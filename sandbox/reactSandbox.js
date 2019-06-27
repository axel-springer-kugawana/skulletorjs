import React from 'react'
import ReactDOM from 'react-dom'

import skulletor, { skulletorFactory } from '../src/adapter/react'
import { applyBaseCSS, applyAnimation } from '../src/middlewares'
import { announceBlock, announceLine } from './shapes'

const dom = document.getElementById('root')
const dom2 = document.getElementById('root2')

document.getElementsByTagName('h1')[0].innerText = 'Skulletor.js React Sandbox'

const makeSkulletor = (useMySkulletor) => {
  // --- My Skulettor ---
  let workSkulletor

  if (useMySkulletor) {
    workSkulletor = skulletorFactory([applyBaseCSS(), applyAnimation()])
  } else {
    workSkulletor = skulletor
  }

  const { Skulletor } = workSkulletor({
    'max-width: 639px': [announceBlock(), announceBlock()],
    'min-width: 640px': [announceLine(), announceLine()],
  })

  return Skulletor
}

class TestLoading extends React.Component {
  state = {
    loading: true,
    message: null,
    displayMessage: false,
  }

  Skulletor = makeSkulletor(this.props.useMySkulletor)

  componentDidMount() {
    const fakePromise = new Promise((resolve) => {
      setTimeout(() => resolve('Loading finished'), 2000)
    })

    fakePromise.then((message) => this.setState({ loading: false, message }))
  }

  render() {
    const { loading, message, displayMessage } = this.state
    const Skulletor = this.Skulletor

    return (
      <React.Fragment>
        <Skulletor end={!loading} onDisapear={() => this.setState({ displayMessage: true })} />
        {displayMessage && <div>{message}</div>}
      </React.Fragment>
    )
  }
}

class App extends React.Component {
  state = {
    load: false,
  }

  render() {
    const { load } = this.state
    const { useMySkulletor } = this.props

    return (
      <div>
        {!load && <button onClick={() => this.setState({ load: true })}>Start</button>}
        {load && <TestLoading {...{ useMySkulletor }} />}
      </div>
    )
  }
}

ReactDOM.render(<App />, dom)

ReactDOM.render(<App useMySkulletor />, dom2)
