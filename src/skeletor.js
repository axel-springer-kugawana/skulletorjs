import map from 'ramda/es/map'
import curry from 'ramda/es/curry'
import __ from 'ramda/es/__'

import ms from 'ms'

import { css } from './css'
import { COLORS } from './basicShapes'
import shaper from './shaper'

function stringToHtml(string) {
  if (typeof string === 'string') {
    let temporaryContainer = document.createElement('div')
    temporaryContainer.innerHTML = string.trim()
    return temporaryContainer.firstChild
  } else {
    return false
  }
}

function applyAnimation({ sheet, duration = '.8s' }) {
  const BACKGROUND_KEYS = ['backgroundImage', 'backgroundPosition', 'backgroundSize']
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
  }, BACKGROUND_KEYS) // @todo à faire disparaître

  return {
    [':after']: {
      animationName: [loadingAnimation],
      animationDuration: duration,
      animationIterationCount: 'infinite',
    },
  }
}

function applyFadeOut({ duration = '.3s' }) {
  return {
    opacity: 1,
    transition: `opacity ${duration} ease-in-out`,
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

function killSkeleton(skelDOM) {
  return new Promise((resolve, reject) => {
    if (skelDOM) {
      const style = getComputedStyle(skelDOM)
      const time = ms(style.getPropertyValue('transition-duration'))
      const property = style.getPropertyValue('transition-property')

      const finish = () => {
        skelDOM.remove()
        resolve()
      }

      if (property === 'opacity' && time > 0) {
        skelDOM.style.opacity = 0
        setTimeout(finish, time)
      } else {
        finish()
      }
    } else {
      reject()
    }
  })
}

function skeletonFactory(styles, options) {
  return shaper({
    styles,
    visitors: [applyBaseCSS, applyAnimation, applyFadeOut],
  })
}

function skeleton(allStyles, promise, dest, options = {}) {
  const skeletonFactoryWithOptions = curry(skeletonFactory)(__, options)
  const sheets = map(skeletonFactoryWithOptions, allStyles)

  return new Promise((resolve, reject) => {
    if (promise && dest) {
      const skelDOMList = map((sheet) => {
        const skelDOM = stringToHtml(`<div class="${css(sheet)}"></div>`)
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

export function mediaSkeleton(mediaQueries, promise, dest, options = {}) {
  let promises = []

  Object.keys(mediaQueries).map((mediaQuery) => {
    const allStyles = mediaQueries[mediaQuery]
    if (window.matchMedia(`(${mediaQuery})`).matches) {
      promises = [...promises, skeleton(allStyles, promise, dest, options)]
    }
  })

  return Promise.all(promises).then((all) => all[0])
}

export default skeleton
