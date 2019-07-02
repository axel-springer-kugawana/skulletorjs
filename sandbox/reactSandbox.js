import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import { skulletorFactory } from '../src/adapter/react-hooks'
import { applyAnimation, applyBaseCSS } from '../src/middlewares'
import { applyFadeOut, applyInterrupt, applyShowDelay } from '../src/adapter/react-hooks/middlewares'
import { announceBlock, announceLine } from './shapes'

const skulletor = skulletorFactory([applyFadeOut(), applyAnimation(), applyBaseCSS(), applyShowDelay({ after: 300 }), applyInterrupt({ after: 3000 })])

const shapes = {
  'max-width: 639px': [announceBlock()],
  'min-width: 640px': [announceLine()],
}

const { Skulletor } = skulletor(shapes)

function App() {
  const [loading, setLoading] = useState(true)
  const [dataReady, setDataReady] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setTimeout(() => setDataReady(true), 2000)
  }, [])

  return (
    <div>
      {loading && (
        <Skulletor
          end={dataReady}
          onInterrupt={() => {
            setError(true)
            setLoading(false)
          }}
          onDisapear={() => setLoading(false)}
        />
      )}

      {!loading && !error && 'Loading finished'}
      {!loading && error && 'Loading error : timeout'}
    </div>
  )
}

document.getElementsByTagName('h1')[0].innerText = 'Skulletor.js React Sandbox'
const dom = document.getElementById('root')
ReactDOM.render(<App />, dom)
