import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import skulletor from '../src/adapter/react-hooks'
import { announceBlock, announceLine } from './shapes'

const shapes = {
  'max-width: 639px': [announceBlock(), announceBlock()],
  'min-width: 640px': [announceLine(), announceLine()],
}
const { Skulletor } = skulletor(shapes)

function App() {
  const [loading, setLoading] = useState(true)
  const [dataReady, setDataReady] = useState(false)

  useEffect(() => {
    setTimeout(() => setDataReady(true), 2000)
  }, [])

  return <div>{loading ? <Skulletor end={dataReady} onDisapear={() => setLoading(false)} /> : 'Loading finished'}</div>
}

document.getElementsByTagName('h1')[0].innerText = 'Skulletor.js React Sandbox'
const dom = document.getElementById('root')
ReactDOM.render(<App />, dom)
