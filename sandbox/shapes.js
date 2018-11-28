import { rectangle, line } from '../src/shapes'

export const announceLine = () => {
  const column = 330

  const photo = rectangle({ width: [310, 'px'] })
  const title = line({ fontSize: 16, width: [180, 'px'], top: 20, left: column })
  const tag = line({ fontSize: 22, width: [150, 'px'], topGap: 10, left: column })
  const tag1 = line({ fontSize: 22, width: [150, 'px'], topGap: -22, leftGap: 10 })
  const price = line({ fontSize: 34, width: [220, 'px'], topGap: 10, left: column })
  const subInformation = line({ fontSize: 14, width: [70, 'px'], topGap: 20, left: column })

  return [
    {
      width: [100, '%'],
      height: [185, 'px'],
      marginBottom: [24, 'px'],
    },
    photo,
    title,
    tag,
    tag1,
    price,
    subInformation,
  ]
}

export const announceBlock = () => {
  const padding = 20

  const photo = rectangle({ height: [225, 'px'] })
  const title = line({ width: [180, 'px'], topGap: 20, left: padding })
  const tag = line({ fontSize: 22, width: [150, 'px'], topGap: 20, left: padding })
  const price = line({ fontSize: 34, width: [220, 'px'], topGap: 20, left: padding })

  return [
    {
      width: [100, '%'],
      height: [365, 'px'],
      marginBottom: [24, 'px'],
    },
    photo,
    title,
    tag,
    price,
  ]
}
