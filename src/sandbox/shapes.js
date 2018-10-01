import { rectangle, line, block } from '../';

export const announceLine = () => {
  const common = {
    height: 185,
    rightColumn: 330,
  }

  const photo = rectangle({ width: '310px' })
  const title = line({ width: "180px", top: 20, left: common.rightColumn })
  const tag = line({ fontSize: 22, width: "150px", top: 45, left: common.rightColumn })
  const price = line({ fontSize: 34, width: "220px", top: 80, left: common.rightColumn })
  const subInformation = line({ fontSize: 14, width: "70px", top: 120, left: common.rightColumn })

  return [
    {
      width: '100%',
      height: `${common.height}px`,
      marginBottom: '24px',
      backgroundColor: 'white',
    },
    photo,
    title,
    tag,
    price,
    subInformation,
    block(),
  ]
}

export const announceBlock = () => {
  const common = {
    photo: 225,
    padding: 20,
  }
  const photo = rectangle({ height: `${common.photo}px` })
  const title = line({ width: "180px", top: common.photo + common.padding, left: common.padding })
  const tag = line({ fontSize: 22, width: "150px", top: 22 + common.photo + common.padding, left: common.padding })
  const price = line({ fontSize: 34, width: "220px", top: 22 + 34 + common.photo + common.padding, left: common.padding })

  return [
    {
      width: '100%',
      height: '365px',
      marginBottom: '24px',
      backgroundColor: 'white',
    },
    photo,
    title,
    tag,
    price,
    block(),
  ]
}	