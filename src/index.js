import { skeleton, mediaSkeleton } from './skeletor'
import { rectangle, line, circle, square } from './basicShapes'

function skeletor(shapes, ...params) {
  if (shapes) {
    if (Array.isArray(shapes)) {
      return skeleton(shapes, ...params)
    } else if (typeof shapes === 'object') {
      return mediaSkeleton(shapes, ...params)
    }
  }
}

export { rectangle, line, circle, square }

export default skeletor
