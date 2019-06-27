import mergeDeepLeft from 'ramda/src/mergeDeepLeft'
import uniqid from 'uniqid'
import { rgba, COLORS } from '../shapes'
import { SHAPE_KEYS } from '../shaper'

export default function applyAnimation({ animationDuration = '.8s', animationIterationCount = 'infinite' } = {}) {
  return ({ transform }) => {
    const augmentTransform = (cssObject) => {
      let augmentedCssObject = { ...cssObject }

      const animatedGradient = {
        backgroundImage: `linear-gradient(90deg, 
          ${rgba({ ...COLORS.SUB, a: 0 })} 0,
          ${rgba({ ...COLORS.SUB, a: 0.8 })} 50%,
          ${rgba({ ...COLORS.SUB, a: 0 })} 100%)`,
        backgroundSize: '200px 100%',
        backgroundPosition: `-250px 0`,
      }
      const animationName = `skulletor-${uniqid.time()}`
      const animation = {
        [`@keyframes ${animationName}`]: {
          to: {
            backgroundPosition: [`calc(100% + 250px) 0`, cssObject.skeleton['&:after'].backgroundPosition].join(', '),
          },
        },
      }

      SHAPE_KEYS.forEach((key) => {
        augmentedCssObject.skeleton['&:after'][key] = [animatedGradient[key], augmentedCssObject.skeleton['&:after'][key]].join(', ')
      })

      return transform(
        mergeDeepLeft(augmentedCssObject, {
          ...animation,
          skeleton: {
            '&:after': {
              animationName,
              animationDuration,
              animationIterationCount,
            },
          },
        }),
      )
    }

    return {
      transform: augmentTransform,
    }
  }
}