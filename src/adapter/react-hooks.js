import React, { useState, useEffect, useCallback } from 'react'
import jss from 'jss'
import preset from 'jss-preset-default'

import skulletor from '../skulletor'
import { applyBaseCSS, applyAnimation } from '../middlewares'

jss.setup(preset())

export function adapter() {
  let sheets = []

  function transform(cssObject) {
    const sheet = jss.createStyleSheet(cssObject)
    sheets = [...sheets, sheet]
    const { classes } = sheet.attach()

    return `<div class="${classes.skeleton}"></div>`
  }

  function finish(done) {
    sheets && sheets.forEach((sheet) => sheet.detach())
    done && done()
  }

  function render(skeletonArray, finish) {
    const createMarkup = () => ({ __html: `${skeletonArray.map((skeleton) => skeleton).join('')}` })

    const Skulletor = ({ end, onDisapear, ...others }) => {
      const [onAir, setOnAir] = useState(true)

      useEffect(() => sheets && sheets.forEach((sheet) => sheet.attach()), [])

      useEffect(() => {
        if (end && onAir) {
          if (finish && typeof finish === 'function') {
            finish(() => {
              typeof onDisapear === 'function' && onDisapear()
              setOnAir(false)
            })
          } else {
            setOnAir(false)
          }
        }
      }, [end])

      return onAir && <div {...{ ...others }} dangerouslySetInnerHTML={createMarkup()} />
    }

    return { Skulletor }
  }

  return { transform, finish, render }
}

export function applyFadeOut({ time = '0.3s', timingFunction = 'ease-in-out' } = {}) {
  return ({ render }) => {
    const augmentRender = (skeletonArray, finish) => {
      const { Skulletor, ...remain } = render(skeletonArray, finish)

      const AugmentedSkulletor = ({ end, ...props }) => {
        const [fadeout, setFadeout] = useState(false)
        const [opacity, setOpacity] = useState(1)
        const onTransitionEnd = () => setFadeout(true)

        useEffect(() => {
          if (end) setOpacity(0)
        }, [end])

        return (
          <Skulletor
            {...{
              onTransitionEnd,
              style: {
                transition: `opacity ${time} ${timingFunction}`,
                opacity,
              },
              end: fadeout,
              ...props,
            }}
          />
        )
      }

      return { Skulletor: AugmentedSkulletor, ...remain }
    }

    return { render: augmentRender }
  }
}

function skulletorTool(shapes, middlewares = []) {
  return skulletor(shapes, middlewares, adapter())
}

export const skulletorFactory = (middlewares = []) => (shapes) => skulletorTool(shapes, middlewares)

export default (shapes) => {
  const defaultMiddlewares = [applyBaseCSS(), applyAnimation(), applyFadeOut()]
  return skulletorTool(shapes, defaultMiddlewares)
}
