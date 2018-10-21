export const COLORS = {
  MAIN: {
    r: 231,
    g: 231,
    b: 231,
    a: 1,
  },
  SUB: {
    r: 255,
    g: 255,
    b: 255,
    a: 1,
  },
}

export function rgba({ r, g, b, a }) {
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

export const line = ({ fontSize = 16, width, left = 0, top = 0, color = COLORS.MAIN } = {}) => ({
  '&:after': {
    backgroundImage: `linear-gradient(${rgba(color)} 100%, transparent 0)`,
    backgroundSize: `${width ? width : '100%'} ${fontSize}px`,
    backgroundPosition: `${left}px ${top}px`,
  },
})

export const circle = ({ radius = 16, left = 0, top = 0, color = COLORS.MAIN } = {}) => ({
  '&:after': {
    backgroundImage: `radial-gradient(circle ${radius}px at center, ${rgba(color)} 99%, transparent 0)`,
    backgroundSize: `${radius * 2}px ${radius * 2}px`,
    backgroundPosition: `${left}px ${top}px`,
  },
})

export const rectangle = ({ width, height, top = 0, left = 0, color = COLORS.MAIN } = {}) => ({
  '&:after': {
    backgroundImage: `linear-gradient(${rgba(color)} 100%, transparent 0)`,
    backgroundSize: `${width ? width : '100%'} ${height ? height : '100%'}`,
    backgroundPosition: `${left}px ${top}px`,
  },
})

export const square = ({ size, top, left, color } = {}) => rectangle({ width: size, height: size, top, left, color })
