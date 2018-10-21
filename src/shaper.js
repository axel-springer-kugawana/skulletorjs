import pick from 'ramda/es/pick'
import has from 'ramda/es/has'
import allPass from 'ramda/es/allPass'
import mergeDeepRight from 'ramda/es/mergeDeepRight'
import reduce from 'ramda/es/reduce'

export const SHAPE_KEYS = ['backgroundImage', 'backgroundSize', 'backgroundPosition']

const isShape = allPass(SHAPE_KEYS.map((key) => has(key)))

const combineBackground = reduce((acc, shape) => {
  let result = acc
  for (let [ruleName, rule] of Object.entries(shape)) {
    result[ruleName] = acc[ruleName] ? `${acc[ruleName]}, ${String(rule)}` : rule
  }
  return result
}, {})

function shaper(styles) {
  let shapes = [],
    earlyStyleSheet = {
      '&:after': {},
    }

  for (let style of styles) {
    const after = style['&:after']

    if (after && isShape(after)) {
      shapes = [...shapes, pick(SHAPE_KEYS, after)]
    }

    earlyStyleSheet = mergeDeepRight(earlyStyleSheet, style) // On merge tous les CSS sans se préocuper des shapes.
  }

  return { skeleton: mergeDeepRight(earlyStyleSheet, { '&:after': combineBackground(shapes) }) } // On écrase les backgrounds déjà set avec les shapes combinés.
}

export default shaper
