import shaper from './shaper'
import middlewareManager from './middleware-manager'
import * as adapter from './aphrodite-adapter'

function createSkeletons(shapesArray, middlewares) {
  const { transform, render, finish } = middlewareManager(adapter, middlewares)
  const skeletons = shapesArray.map((shapes) => transform(shaper(shapes)))

  return render(skeletons, finish)
}

function createMediaSkeletons(mediaShapesObject, middlewares) {
  let matchedSkeletor

  for (let [mediaQuery, shapeArray] of Object.entries(mediaShapesObject)) {
    if (window.matchMedia(`(${mediaQuery})`).matches) {
      matchedSkeletor = createSkeletons(shapeArray, middlewares, adapter)
    }
  }

  return matchedSkeletor
}

function skeletor(shapes, ...params) {
  if (shapes) {
    if (Array.isArray(shapes)) {
      return createSkeletons(shapes, ...params)
    } else if (typeof shapes === 'object') {
      return createMediaSkeletons(shapes, ...params)
    }
  }
}

export default skeletor
