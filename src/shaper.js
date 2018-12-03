import pick from 'ramda/src/pick'
import has from 'ramda/src/has'
import allPass from 'ramda/src/allPass'
import mergeDeepRight from 'ramda/src/mergeDeepRight'
import reduce from 'ramda/src/reduce'
import mapObjIndexed from 'ramda/src/mapObjIndexed'

export const SHAPE_KEYS = ['backgroundImage', 'backgroundSize', 'backgroundPosition']

const isShape = allPass(SHAPE_KEYS.map((key) => has(key)))

const getBackgroundCombinerTool = () =>
  reduce((acc, shape) => {
    let result = acc
    for (let [ruleName, rule] of Object.entries(shape)) {
      result[ruleName] = acc[ruleName] ? `${acc[ruleName]}, ${String(rule)}` : rule
    }
    return result
  }, {})

const convertArrayStyleProperty = (property) => (Array.isArray(property) ? `${property[0]}${property[1]}` : property)

const getArrayStylePropertyValue = (property) => (Array.isArray(property) ? property[0] : property)

const gapHandlerFactory = () => {
  let top = 0,
    left = 0

  return (style, previous) => {
    const styleCreator = style()
    const params = styleCreator.params

    let currTop, currLeft, prevHeight, prevWidth, prevTop, prevLeft, topGap, leftGap
    let updatedParams = params

    if (typeof previous === 'function' && typeof style === 'function') {
      const previousParams = previous().params

      if (params.topGap !== null && params.topGap !== undefined) {
        currTop = params.top || 0
        prevHeight = getArrayStylePropertyValue(previousParams.height || 0)
        prevTop = previousParams.top || 0
        topGap = params.topGap || 0

        top += currTop + prevTop + prevHeight + topGap

        updatedParams = { ...updatedParams, top }
      }
      if (params.leftGap !== null && params.leftGap !== undefined) {
        currLeft = params.left || 0
        prevWidth = getArrayStylePropertyValue(previousParams.width || 0)
        prevLeft = previousParams.left || 0
        leftGap = params.leftGap || 0

        left += currLeft + prevWidth + prevLeft + leftGap

        updatedParams = { ...updatedParams, left }
      }
    }

    updatedParams = mapObjIndexed((value) => convertArrayStyleProperty(value), updatedParams)
    return styleCreator.create(updatedParams)
  }
}

function shaper(styles) {
  let shapes = [],
    earlyStyleSheet = {
      '&:after': {},
    }

  const useGap = gapHandlerFactory()

  for (let style of styles) {
    if (typeof style === 'function') {
      const index = styles.indexOf(style)
      const previous = styles[index - 1]
      style = useGap(style, previous)
    } else {
      style = mapObjIndexed((value) => convertArrayStyleProperty(value), style)
    }

    let after = style['&:after']

    if (after && isShape(after)) {
      after = mapObjIndexed((value) => convertArrayStyleProperty(value), after)
      shapes = [...shapes, pick(SHAPE_KEYS, after)]
    }

    earlyStyleSheet = mergeDeepRight(earlyStyleSheet, style) // On merge tous les CSS sans se préocuper des shapes.
  }

  const combineBackground = getBackgroundCombinerTool()

  const stylesheet = { skeleton: mergeDeepRight(earlyStyleSheet, { '&:after': combineBackground(shapes) }) } // On écrase les backgrounds déjà set avec les shapes combinés.

  return stylesheet
}

export default shaper
