import { StyleSheet, css, minify } from 'aphrodite/no-important'
import intersection from 'ramda/es/intersection'
import pipe from 'ramda/es/pipe'
import filter from 'ramda/es/filter'
import prop from 'ramda/es/prop'
import props from 'ramda/es/props'
import map from 'ramda/es/map'
import mapObjIndexed from 'ramda/es/mapObjIndexed'
import zipObj from 'ramda/es/zipObj'
import reduce from 'ramda/es/reduce'
import mergeDeepWithKey from 'ramda/es/mergeDeepWithKey'
import splitAt from 'ramda/es/splitAt'
import dropLast from 'ramda/es/dropLast'
import curry from 'ramda/es/curry'
import __ from 'ramda/es/__'

const stringToHtml = (string) => {
  if (typeof string === "string") {
    let temporaryContainer = document.createElement("div");
    temporaryContainer.innerHTML = string.trim();
    return temporaryContainer.firstChild;
  } else {
    return false;
  }
}

export const BACKGROUND_KEYS = ['backgroundImage', 'backgroundPosition', 'backgroundSize']

export const COLORS = {
  MAIN: {
    r: 231,
    g: 231,
    b: 231,
    a: 1,
  },
  SUB: {
    r: 255,
    g: 255,
    b: 255,
    a: 1,
  },
}

const rgba = ({ r, g, b, a }) => `rgba(${r}, ${g}, ${b}, ${a})`

export const line = ({ fontSize = 16, width, left = 0, top = 0, color = COLORS.MAIN } = {}) => ({
  ':after': {
    backgroundImage: `linear-gradient(${rgba(color)} 100%, transparent 0)`,
    backgroundSize: `${width ? width : '100%'} ${fontSize}px`,
    backgroundPosition: `${left}px ${top}px`,
  }
})

export const circle = ({ radius = 16, left = 0, top = 0, color = COLORS.MAIN } = {}) => ({
  ':after': {
    backgroundImage: `radial-gradient(circle ${radius}px at center, ${rgba(color)} 99%, transparent 0)`,
    backgroundSize: `${radius * 2}px ${radius * 2}px`,
    backgroundPosition: `${left}px ${top}px`,
  }
})

export const rectangle = ({ width, height, top = 0, left = 0, color = COLORS.MAIN } = {}) => ({
  ':after': {
    backgroundImage: `linear-gradient(${rgba(color)} 100%, transparent 0)`,
    backgroundSize: `${width ? width : '100%'} ${height ? height : '100%'}`,
    backgroundPosition: `${left}px ${top}px`,
  }
})

export const square = ({ size, top, left, color } = {}) => rectangle({ width: size, height: size, top, left, color })

export const block = () => {
  return {
    ':after': {
      ...rectangle({ color: COLORS.SUB }),
      borderRadius: '6px',
      boxShadow: '0 10px 45px rgba(0, 0, 0, 0.1)',
    }
  }
}

const isShape = pipe(intersection(BACKGROUND_KEYS), (a) => a.length >= 3)

const isStyleContainShapes = (style) => {
  if (!style[':after']) {
    return false
  }
  return pipe(prop(':after'), Object.keys, isShape)(style)
}

const selectAfterStyles = map((prop(':after')))

const extractBackgroundStyles = map(pipe(props(BACKGROUND_KEYS), zipObj(BACKGROUND_KEYS)))

const exctractShapes = pipe(filter(isStyleContainShapes), selectAfterStyles, extractBackgroundStyles)

const combineBackgrounds = reduce((curr, acc) => mapObjIndexed((rule, ruleName) => {
  if (curr[ruleName]) {
    return [curr[ruleName], rule].join(', ')
  } else {
    return rule
  }
}, acc), {})

const mergeFreeCSS = (styles) => (sheet) => {
  let nextSheet = sheet

  map(s => {
    nextSheet = mergeDeepWithKey((key, left, right) => {
      if (BACKGROUND_KEYS.indexOf(key) === -1) {
        return left
      } else {
        return right
      }
    }, s, nextSheet)
  }, styles)

  return nextSheet
}

const applyAnimation = (sheet, duration) => {
  let nextSheetAfter = sheet[':after']

  const animatedGradient = {
    backgroundImage: `linear-gradient(90deg, 
      ${rgba({ ...COLORS.SUB, a: 0, })} 0,
      ${rgba({ ...COLORS.SUB, a: 0.8, })} 50%,
      ${rgba({ ...COLORS.SUB, a: 0, })} 100%)`,
    backgroundSize: '200px 100%',
    backgroundPosition: `-250px 0`,
  }

  const loadingAnimation = {
    'to': {
      backgroundPosition: [`calc(100% + 250px) 0`, nextSheetAfter.backgroundPosition].join(', ')
    }
  }

  map((key) => {
    nextSheetAfter[key] = [animatedGradient[key], nextSheetAfter[key]].join(', ')
  }, BACKGROUND_KEYS)

  return {
    ...sheet,
    [':after']: {
      ...nextSheetAfter,
      animationName: [loadingAnimation],
      animationDuration: duration ? duration : '.8s',
      animationIterationCount: 'infinite',
    }
  }
}

const applyFadeOut = (sheet, duration) => ({
  ...sheet,
  opacity: 1,
  transition: `opacity ${duration ? duration : '300ms'} ease-in-out`,
})

const spreadCSSTRansitionDuration = (DOM) => {
  const timeString = getComputedStyle(DOM).getPropertyValue('transition-duration')
  const unit = timeString.search('s') ? 's' : 'ms'
  const secondRatio = unit === 's' ? 1000 : 1
  const time = Number(dropLast(unit.length, splitAt(timeString.indexOf(unit), timeString))[0], 10)

  return { unit, secondRatio, time }
}

const killSkeleton = (skelDOM) => {
  return new Promise((resolve, reject) => {
    if (skelDOM) {
      const { secondRatio, time } = spreadCSSTRansitionDuration(skelDOM)

      if (time > 0) {
        skelDOM.style.opacity = 0
        setTimeout(() => {
          skelDOM.remove()
          resolve()
        }, time * secondRatio)
      } else {
        reject()
      }
    } else {
      reject()
    }

  })
}

const skeletonFactory = (styles, options) => {
  const shapes = exctractShapes(styles)

  const applyFadeOutWithOptions = curry(applyFadeOut)(__, options.fadeOutDuration)

  const applyFreeCss = mergeFreeCSS(styles)

  const backgrounds = combineBackgrounds(shapes)

  const applyAnimationWithOptions = curry(applyAnimation)(__, options.animationDuration)

  const regroupRules = (sheet) => ({ main: sheet })

  return pipe(applyFadeOutWithOptions, applyFreeCss, applyAnimationWithOptions, regroupRules, StyleSheet.create)({
    ':after': {
      content: '""',
      display: 'block',
      width: '100%',
      height: '100%',
      backgroundRepeat: 'no-repeat',
      ...backgrounds,
    }
  })
}

const skeleton = (allStyles, promise, dest, options = {}) => {
  minify(false)

  const skeletonFactoryWithOptions = curry(skeletonFactory)(__, options)
  const sheets = map(skeletonFactoryWithOptions, allStyles)

  return new Promise((resolve, reject) => {
    if (promise && dest) {
      const skelDOMList = map((sheet) => {
        const skelDOM = stringToHtml(`<div class="${css(sheet.main)}"></div>`)
        dest.appendChild && dest.appendChild(skelDOM)
        return skelDOM
      }, sheets)

      promise.then((...args) => {
        Promise.all(map((skelDOM) => killSkeleton(skelDOM), skelDOMList)).then(() => resolve(...args))
      })
    } else {
      reject()
    }
  })
}

export const mediaSkeleton = (mediaQueries, promise, dest, options = {}) => {
  let promises = []

  Object.keys(mediaQueries).map((mediaQuery) => {
    const allStyles = mediaQueries[mediaQuery]
    if (window.matchMedia(`(${mediaQuery})`).matches) {
      promises = [
        ...promises,
        skeleton(allStyles, promise, dest, options)
      ]
    }
  })

  return Promise.all(promises).then((all) => all[0])
}

export default skeleton
