import React from 'react'
import styled from 'styled-components'
import uniqid from 'uniqid'
import shaper from './shaper'

const Skeleton = styled.div`
  ${({ sheet }) => sheet}
`

function applyBaseCSS({ }) {
  return {
    ':after': {
      content: '""',
      display: 'block',
      width: '100%',
      height: '100%',
      backgroundRepeat: 'no-repeat',
      borderRadius: '6px',
      boxShadow: '0 10px 45px rgba(0, 0, 0, 0.1)',
    },
  }
}

function make(styles) {
  return shaper({ styles, visitors: [applyBaseCSS] })
}

export default class Skeletor extends React.Component {
  state = {
    air: true,
    sheets: [],
  }

  componentWillMount() {
    const { shapeArray } = this.props

    if (Array.isArray(shapeArray)) {
      const sheets = shapeArray.map(make)
      this.setState({ sheets })
    }
  }

  renderSkeletors(sheet) {
    return (
      <Skeleton key={uniqid()} sheet={sheet.main._definition} />
    )
  }

  render() {
    const { air, sheets } = this.state

    setTimeout(() => this.setState({ air: false }), 2000)

    return (air &&
      <React.Fragment>
        {
          sheets.map(this.renderSkeletors)
        }
      </React.Fragment>
    )
  }
}
