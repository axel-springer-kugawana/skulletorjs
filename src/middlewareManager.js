import mergeDeepRight from 'ramda/src/mergeDeepRight'

export default function middlewareManager({ transform, render, finish }, middlewares) {
  let transit = { transform, render, finish }

  middlewares.forEach((middleware) => {
    const a = middleware(transit)
    transit = mergeDeepRight(transit, a)
  })

  return transit
}
