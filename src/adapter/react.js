import React from 'react'
import jss from 'jss'
import preset from 'jss-preset-default'
import skulletor from '../skulletor'

jss.setup(preset())

function adapter() {
  let sheets = []

  function transform(cssObject) {
    const sheet = jss.createStyleSheet(cssObject)
    sheets = [...sheets, sheet]
    const { classes } = sheet.attach()

    return `<div class="${classes.skeleton}"></div>`
  }

  function finish(performFinishAction) {
    sheets && sheets.forEach((sheet) => sheet.detach())
    performFinishAction && performFinishAction()
  }

  function render(skeletonArray, finish) {
    const createMarkup = () => {
      return { __html: `${skeletonArray.map((skeleton) => skeleton).join('')}` }
    }

    class Skulletor extends React.Component {
      state = {
        air: true,
      }

      componentDidMount() {
        sheets && sheets.forEach((sheet) => sheet.attach())
      }

      componentDidUpdate() {
        const { end, onDisapear } = this.props
        const { air } = this.state

        if (end && air) {
          if (finish && typeof finish === 'function') {
            finish(() => {
              if (typeof onDisapear === 'function') {
                onDisapear()
              }
              this.setState({ air: false })
            })
          } else {
            this.setState({ air: false })
          }
        }
      }
      render() {
        const { end, onDisapear, ...others } = this.props
        const { air } = this.state

        return air && <div {...{ ...others }} dangerouslySetInnerHTML={createMarkup()} />
      }
    }

    return {
      Skulletor,
    }
  }

  return { transform, finish, render }
}

export function applyFadeOut({ render }) {
  const getFadeoutStyles = (end) => ({
    transition: 'opacity .3s ease-in-out',
    opacity: end ? 0 : 1,
  })

  const augmentRender = (skeletonArray, finish) => {
    const objects = render(skeletonArray, finish)

    const withFadeOut = (WrappedComponent) => {
      return class FadeoutComponent extends React.Component {
        state = {
          fadeout: false,
        }

        onTransitionEnd = () => {
          this.setState({ fadeout: true })
        }

        render() {
          const { end, ...props } = this.props
          const { fadeout } = this.state

          return <WrappedComponent onTransitionEnd={this.onTransitionEnd} style={getFadeoutStyles(end)} {...{ end: fadeout, ...props }} />
        }
      }
    }
    return {
      ...objects,
      Skulletor: withFadeOut(objects.Skulletor),
    }
  }

  return {
    render: augmentRender,
  }
}

export default (shapes, middlewares) => {
  const { transform, render, finish } = adapter()

  return skulletor(shapes, middlewares, { transform, render, finish })
}
