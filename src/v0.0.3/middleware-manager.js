import mergeDeepRight from 'ramda/es/mergeDeepRight'
import mergeDeepLeft from 'ramda/es/mergeDeepLeft'

export default function middlewareManager({ transform, render, finish }, middlewares) {
  let transit = { transform, render, finish }

  middlewares.forEach((middleware) => {
    const a = middleware(transit)
    transit = mergeDeepRight(transit, a)
  })

  return transit
}

export function applyBaseCSS({ transform }) {
  const augmentTransform = (cssObject) => {
    return transform(
      mergeDeepLeft(
        {
          ':after': {
            content: '""',
            display: 'block',
            width: '100%',
            height: '100%',
            backgroundRepeat: 'no-repeat',
            borderRadius: '6px',
            boxShadow: '0 10px 45px rgba(0, 0, 0, 0.1)',
          },
        },
        cssObject,
      ),
    )
  }
  return { transform: augmentTransform }
}

// const applyTruc = ({ transform }) => {
//   const newTransform = (...p) => {
//     const [p1] = p
//     doSmth(p1)
//     return transform(...p)
//   }

//   return {
//     transform: newTransform,
//   }
// }

// const { transform } = middlewareManager({ transform }, [applyTruc])
