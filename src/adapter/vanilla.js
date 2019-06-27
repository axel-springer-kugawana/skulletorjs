import jss from 'jss'
import preset from 'jss-preset-default'
import skulletor from '../skulletor'
import { applyBaseCSS, applyAnimation } from '../middlewares/'

jss.setup(preset())

function stringToHtml(string) {
  if (typeof string === 'string') {
    let temporaryContainer = document.createElement('div')
    temporaryContainer.innerHTML = string.trim()
    return temporaryContainer.firstChild
  } else {
    return false
  }
}

export function adapter() {
  let sheets = []

  function transform(cssObject) {
    const sheet = jss.createStyleSheet(cssObject)
    sheets = [...sheets, sheet]
    const { classes } = sheet.attach()

    const skeleton = stringToHtml(`<div class="${classes.skeleton}" ></div>`)
    return skeleton
  }

  function render(skeletonArray, augmentedFinish) {
    const Skulletor = document.createElement('div')
    skeletonArray.forEach((skeleton) => Skulletor.appendChild(skeleton))

    const end = () => {
      return new Promise((resolve, reject) => {
        if (augmentedFinish) {
          augmentedFinish(() => {
            Skulletor && Skulletor.remove()
            resolve()
          })
        } else {
          reject('augmentedFinish is not a function')
        }
      })
    }

    const restart = () => {
      sheets && sheets.forEach((sheet) => sheet.attach())
      return { Skulletor }
    }

    return {
      Skulletor,
      restart,
      end,
    }
  }

  function finish(performFinishAction) {
    sheets && sheets.forEach((sheet) => sheet.detach())
    performFinishAction && performFinishAction()
  }

  return { transform, finish, render }
}

export function applyFadeOut({ render, finish }) {
  let objects

  const augmentRender = (skeletonArray, finish) => {
    objects = render(skeletonArray, finish)

    objects.Skulletor.style.opacity = 1
    objects.Skulletor.style.transition = 'opacity 0.3s ease-in-out'

    const augmentedRestart = () => {
      objects.Skulletor.style.opacity = 1
      return objects.restart()
    }

    return {
      ...objects,
      restart: augmentedRestart,
    }
  }

  const augmentFinish = (performFinishAction) => {
    objects.Skulletor.style.opacity = 0

    objects.Skulletor.addEventListener('transitionend', () => {
      finish(performFinishAction)
    })
  }

  return {
    render: augmentRender,
    finish: augmentFinish,
  }
}

function skulletorTool(shapes, middlewares = []) {
  const { transform, render, finish } = adapter()

  return skulletor(shapes, middlewares, { transform, render, finish })
}

export const skulletorFactory = (middlewares = []) => shapes => skulletorTool(shapes, middlewares)

export default (shapes) => {
  const defaultMiddlewares = [applyBaseCSS, applyAnimation, applyFadeOut]
  return skulletorTool(shapes, defaultMiddlewares)
}
