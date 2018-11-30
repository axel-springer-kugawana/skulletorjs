import React from 'react'
import ReactDOM from 'react-dom'

import skulletor, { applyFadeOut } from '../src/adapter/react'
import { applyBaseCSS, applyAnimation } from '../src/middlewares'
import { announceBlock, announceLine } from './shapes'

const dom = document.getElementById('root')
const dom2 = document.getElementById('root2')

document.getElementsByTagName('h1')[0].innerText = 'Skulletor.js React Sandbox'

const makeSkulletor = () => {
  const { Skulletor } = skulletor(
    {
      'max-width: 639px': [announceBlock(), announceBlock()],
      'min-width: 640px': [announceLine(), announceLine()],
    },
    [applyBaseCSS, applyAnimation, applyFadeOut],
  )

  return Skulletor
}

class TestLoading extends React.Component {
  state = {
    loading: true,
    message: null,
    displayMessage: false,
  }

  Skulletor = makeSkulletor()

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

    return (
      <div>
        {!load && <button onClick={() => this.setState({ load: true })}>Start</button>}
        {load && <TestLoading />}
      </div>
    )
  }
}

ReactDOM.render(<App />, dom)

ReactDOM.render(<App />, dom2)
