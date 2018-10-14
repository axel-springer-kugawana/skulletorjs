import { StyleSheet, css as aphroditeCss, minify } from 'aphrodite/no-important'

minify(false)

export function css(sheet) {
  return aphroditeCss(sheet.main)
}

export function transform(sheet) {
  return StyleSheet.create({ main: sheet })
}
