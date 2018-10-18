import { StyleSheet, css as aphroditeCss, minify } from 'aphrodite/no-important'

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

export function css(sheet) {
  return aphroditeCss(sheet.main)
}

export function transform(sheet) {
  return StyleSheet.create({ main: sheet })
}

export function render(sheet, apply) {
  const DOM = stringToHtml(`<div class="${css(sheet)}"></div>`)
  apply(DOM)

  return DOM
}

export function destroy(element) {
  return element && element.remove()
}
