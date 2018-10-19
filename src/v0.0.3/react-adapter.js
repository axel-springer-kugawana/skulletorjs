import React from 'react'
import styled from 'styled-components'
import uniqid from 'uniqid'

const Skeleton = styled.div`
  ${({ sheet }) => sheet};
`

class Skeletor extends React.Component {
  state = {
    air: true,
  }

  componentDidUpdate() {
    const { end, finish } = this.props
    const { air } = this.state

    if (end && air) {
      if (finish && typeof finish === 'function') {
        finish(() => this.setState({ air: false }))
      } else {
        this.setState({ air: false })
      }
    }
  }

  render() {
    const { air } = this.state
    const { skeletonArray } = this.props

    return <React.Fragment>{air && skeletonArray.map((Skeleton) => <Skeleton key={uniqid()} />)}</React.Fragment>
  }
}

export function transform(cssObject) {
  return () => <Skeleton sheet={cssObject} />
}

export function finish(performFinishAction) {
  performFinishAction()
}

// la fonction augmentedFinish est la fonction finish d'au dessus composé par les visitors.
export function render(skeletonArray, augmentedFinish) {
  return ({ end }) => <Skeletor skeletonArray={skeletonArray} finish={augmentedFinish} end={end} />
}
