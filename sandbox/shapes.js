import { rectangle, line } from '../src/shapes'

export const announceLine = () => {
  const column = 330

  const photo = rectangle({ width: '310px' })
  const title = line({ fontSize: 16, width: '180px', top: 20, left: column })
  const tags = [
    line({ fontSize: 22, width: '180px', topGap: 10, left: column }),
    line({ fontSize: 22, width: '130px', topGap: -22, leftGap: 10 }),
    line({ fontSize: 22, width: '150px', topGap: -22, leftGap: 10 }),
  ]
  const price = line({ fontSize: 34, width: '220px', topGap: 10, left: column })
  const subInformation = line({ fontSize: 14, width: '70px', topGap: 20, left: column })

  return [
    {
      width: '100%',
      height: '185px',
      marginBottom: '24px',
      "&:after": {
        borderRadius: '6px',
        boxShadow: '0 10px 45px rgba(0, 0, 0, 0.1)',
      }
    },
    photo,
    title,
    ...tags,
    price,
    subInformation,
  ]
}

export const announceBlock = () => {
  const padding = 20

  const photo = rectangle({ height: '225px' })
  const title = line({ width: '180px', topGap: 20, left: padding })
  const tags = [
    line({ fontSize: 22, width: '15%', topGap: 20, left: padding }),
    line({ fontSize: 22, width: '15%', topGap: -22, leftGap: 20, left: padding }),
  ]
  const price = line({ fontSize: 34, width: '220px', topGap: 20, left: padding })

  return [
    {
      width: '100%',
      height: '365px',
      marginBottom: '24px',
      "&:after": {
        borderRadius: '6px',
        boxShadow: '0 10px 45px rgba(0, 0, 0, 0.1)',
      }
    },
    photo,
    title,
    ...tags,
    price,
  ]
}
