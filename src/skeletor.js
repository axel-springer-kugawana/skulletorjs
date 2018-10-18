import map from 'ramda/es/map'
import curry from 'ramda/es/curry'
import __ from 'ramda/es/__'

import ms from 'ms'

import { render, destroy } from './css-aphrodite'
import { COLORS, rgba } from './basicShapes'
import shaper, { SHAPE_KEYS } from './shaper'

function applyAnimation({ sheet, duration = '.8s' }) {
  const animatedGradient = {
    backgroundImage: `linear-gradient(90deg, 
      ${rgba({ ...COLORS.SUB, a: 0 })} 0,
      ${rgba({ ...COLORS.SUB, a: 0.8 })} 50%,
      ${rgba({ ...COLORS.SUB, a: 0 })} 100%)`,
    backgroundSize: '200px 100%',
    backgroundPosition: `-250px 0`,
  }

  const loadingAnimation = {
    to: {
      backgroundPosition: [`calc(100% + 250px) 0`, sheet[':after'].backgroundPosition].join(', '),
    },
  }

  map((key) => {
    sheet[':after'][key] = [animatedGradient[key], sheet[':after'][key]].join(', ')
  }, SHAPE_KEYS) // @todo à faire disparaître

  return {
    [':after']: {
      animationName: [loadingAnimation],
      animationDuration: duration,
      animationIterationCount: 'infinite',
    },
  }
}

function applyFadeOut({ sheet, duration = '.3s' }) {
  const existingTransitionDuration = sheet.transitionDuration
  // Il faudra utiliser un connect sur l'event transition end afin d'appeler la callback qui sera passer dans End (via l'adapter)
  return {
    opacity: 1,
    transition: `opacity ${existingTransitionDuration || duration} ease-in-out`,
  }
}

function applyBaseCSS({}) {
  return {
    ':after': {
      content: '""',
      display: 'block',
      width: '100%',
      height: '100%',
      backgroundRepeat: 'no-repeat',
      borderRadius: '6px',
      boxShadow: '0 10px 45px rgba(0, 0, 0, 0.1)',
    },
  }
}

// @todo découpler la notion de DOM Element pour l'application du fadeout
function killSkeleton(element) {
  return new Promise((resolve, reject) => {
    if (element) {
      const style = getComputedStyle(element)
      const time = ms(style.getPropertyValue('transition-duration'))
      const property = style.getPropertyValue('transition-property')

      const finish = () => {
        destroy(element)
        resolve()
      }

      if (property === 'opacity' && time > 0) {
        element.style.opacity = 0
        setTimeout(finish, time)
      } else {
        finish()
      }
    } else {
      reject()
    }
  })
}

export function skeleton(shapeArray, promise, apply) {
  const make = (styles) => shaper({ styles, visitors: [applyBaseCSS, applyAnimation, applyFadeOut] })
  const sheets = map(make, shapeArray)

  return new Promise((resolve, reject) => {
    if (promise && apply) {
      const renderAndApply = curry(render)(__, apply)
      const elements = map(renderAndApply, sheets)

      promise.then((...args) => {
        Promise.all(map(killSkeleton, elements)).then(() => resolve(...args))
      })
    } else {
      reject()
    }
  })
}

export function mediaSkeleton(mediaShapeObject, promise, apply) {
  let promises = []

  for (let [mediaQuery, shapeArray] of Object.entries(mediaShapeObject)) {
    if (window.matchMedia(`(${mediaQuery})`).matches) {
      promises = [...promises, skeleton(shapeArray, promise, apply)]
    }
  }

  return Promise.all(promises).then((all) => all[0])
}
