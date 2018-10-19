import { StyleSheet, css, minify } from 'aphrodite/no-important'
import { resolve } from 'url'

minify(false)

function stringToHtml(string) {
  if (typeof string === 'string') {
    let temporaryContainer = document.createElement('div')
    temporaryContainer.innerHTML = string.trim()
    return temporaryContainer.firstChild
  } else {
    return false
  }
}

export function transform(cssObject) {
  return StyleSheet.create({ main: cssObject })
}

export function finish(performFinishAction) {
  performFinishAction()
}

export function render(skeletonArray, augmentedFinish) {
  const Skeletor = stringToHtml(`
    <div>
      ${skeletonArray.map((skeleton) => `<div class="${css(skeleton.main)}"></div>`).join('')}
    </div>
  `)

  const end = () => {
    return new Promise((resolve) => {
      augmentedFinish(() => {
        Skeletor && Skeletor.remove()
        resolve()
      })
    })
  }

  return {
    Skeletor,
    end,
  }
}
