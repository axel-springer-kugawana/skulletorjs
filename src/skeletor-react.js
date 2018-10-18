import React from 'react'
import Loadable from 'react-loadable'
import skeletor from './skeletor'

const importTruc = () => import('./truc').then((m) => m._default)

const shapeArray = []

class Composant extends React.Component {
  state = {
    air: false,
    Truc: null,
  }

  componentDidMount() {
    const pr = importTruc()

    const Skel = skeletor(shapeArray, pr, (Truc) => {
      this.setState({ Truc, air: true })
    })
  }

  render() {
    const { Truc, air } = this.state

    return <div>{air && <Truc />}</div>
  }
}
