// @flow
import pick from 'ramda/es/pick'
import has from 'ramda/es/has'
import allPass from 'ramda/es/allPass'
import mergeDeepRight from 'ramda/es/mergeDeepRight'
import mergeDeepLeft from 'ramda/es/mergeDeepLeft'
import reduce from 'ramda/es/reduce'
import { transform } from './css-aphrodite'

export const SHAPE_KEYS = ['backgroundImage', 'backgroundSize', 'backgroundPosition']

const isShape = allPass(SHAPE_KEYS.map((key) => has(key)))

const combineBackground = reduce((acc, shape) => {
  let result = acc
  for (let [ruleName, rule] of Object.entries(shape)) {
    result[ruleName] = acc[ruleName] ? `${acc[ruleName]}, ${String(rule)}` : rule
  }
  return result
}, {})

function styleSheetVisitor({ earlyStyleSheet, visitors }) {
  let sheet = earlyStyleSheet
  for (let visitor of visitors) {
    const nextSheet = visitor({ sheet })
    sheet = mergeDeepLeft(sheet, nextSheet)
  }

  return sheet
}

type ShaperType = {
  styles: Array<Object>,
  visitors: Array<Function>,
}

function shaper({ styles, visitors = [] }: ShaperType) {
  let shapes = [],
    earlyStyleSheet = {
      ':after': {},
    }

  for (let style of styles) {
    const after = style[':after']

    if (after && isShape(after)) {
      shapes = [...shapes, pick(SHAPE_KEYS, after)]
    }

    earlyStyleSheet = mergeDeepRight(earlyStyleSheet, style) // On merge tous les CSS sans se préocuper des shapes.
  }

  earlyStyleSheet = mergeDeepRight(earlyStyleSheet, { ':after': combineBackground(shapes) }) // On écrase les backgrounds déjà set avec les shapes combinés.

  return transform(styleSheetVisitor({ earlyStyleSheet, visitors }))
}

export default shaper
