import shaper from './shaper'
import middlewareManager from './middlewareManager'

function createSkeletons(shapesArray, middlewares, adapter) {
  const { transform, render, finish } = middlewareManager(adapter, middlewares)
  const skeletons = shapesArray.map((shapes) => transform(shaper(shapes)))

  return render(skeletons, finish)
}

function createMediaSkeletons(mediaShapesObject, middlewares, adapter) {
  let matchedSkulletor

  for (let [mediaQuery, shapeArray] of Object.entries(mediaShapesObject)) {
    if (window.matchMedia(`(${mediaQuery})`).matches) {
      matchedSkulletor = createSkeletons(shapeArray, middlewares, adapter)
    }
  }

  return matchedSkulletor
}

function skulletor(shapes, ...params) {
  if (shapes) {
    if (Array.isArray(shapes) && shapes.length > 0) {
      return createSkeletons(shapes, ...params)
    } else {
      return createMediaSkeletons(shapes, ...params)
    }
  }
}

export default skulletor
