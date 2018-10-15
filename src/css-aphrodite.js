// @flow

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

export function css(sheet: any) {
  return aphroditeCss(sheet.main)
}

export function transform(sheet: any) {
  return StyleSheet.create({ main: sheet })
}

export function render(sheet: any, apply: Function) {
  const DOM = stringToHtml(`<div class="${css(sheet)}"></div>`)
  apply(DOM)

  return DOM
}

export function destroy(element: HTMLElement) {
  return element && element.remove()
}
