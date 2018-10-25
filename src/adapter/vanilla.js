import jss from 'jss'
import preset from 'jss-preset-default'
import skeletor from '../skeletor'

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

let sheets = []

function transform(cssObject) {
  const sheet = jss.createStyleSheet(cssObject)
  sheets = [...sheets, sheet]
  const { classes } = sheet.attach()

  const skeleton = stringToHtml(`<div class="${classes.skeleton}" ></div>`)
  return skeleton
}

function render(skeletonArray, augmentedFinish) {
  const Skeletor = document.createElement('div')
  skeletonArray.forEach((skeleton) => Skeletor.appendChild(skeleton))

  const end = () => {
    return new Promise((resolve, reject) => {
      if (augmentedFinish) {
        augmentedFinish(() => {
          Skeletor && Skeletor.remove()
          resolve()
        })
      } else {
        reject('augmentedFinish is not a function')
      }
    })
  }

  const restart = () => {
    sheets && sheets.forEach((sheet) => sheet.attach())
    return { Skeletor }
  }

  return {
    Skeletor,
    restart,
    end,
  }
}

function finish(performFinishAction) {
  sheets && sheets.forEach((sheet) => sheet.detach())
  performFinishAction && performFinishAction()
}

export function applyFadeOut({ render, finish }) {
  let objects

  const augmentRender = (skeletonArray, finish) => {
    objects = render(skeletonArray, finish)

    objects.Skeletor.style.opacity = 1
    objects.Skeletor.style.transition = 'opacity 0.3s ease-in-out'

    const augmentedRestart = () => {
      objects.Skeletor.style.opacity = 1
      return objects.restart()
    }

    return {
      ...objects,
      restart: augmentedRestart,
    }
  }

  const augmentFinish = (performFinishAction) => {
    objects.Skeletor.style.opacity = 0

    objects.Skeletor.addEventListener('transitionend', () => {
      finish(performFinishAction)
    })
  }

  return {
    render: augmentRender,
    finish: augmentFinish,
  }
}

export default (shapes, middlewares) => skeletor(shapes, middlewares, { transform, render, finish })
