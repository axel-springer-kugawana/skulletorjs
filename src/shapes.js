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

/*
  params field of shapes need to contain the following : 
  params: {
    width,
    height,
    top,
    left,
  }

  Those are used to enable the gap handler in shaper.js.
*/

export const circle = (params = {}) => () => ({
  params: {
    ...params,
    width: [params.radius * 2, 'px'],
    height: [params.radius * 2, 'px'],
  },
  create: ({ radius = 16, left = 0, top = 0, color = COLORS.MAIN } = {}) => ({
    '&:after': {
      backgroundImage: `radial-gradient(circle ${radius}px at center, ${rgba(color)} 99%, transparent 0)`,
      backgroundSize: `${radius * 2}px ${radius * 2}px`,
      backgroundPosition: `${left}px ${top}px`,
    },
  }),
})

export const rectangle = (params = {}) => () => ({
  params,
  create: ({ width, height, top = 0, left = 0, color = COLORS.MAIN } = {}) => ({
    '&:after': {
      backgroundImage: `linear-gradient(${rgba(color)} 100%, transparent 0)`,
      backgroundSize: `${width ? width : '100%'} ${height ? height : '100%'}`,
      backgroundPosition: `${left}px ${top}px`,
    },
  }),
})

export const line = (params = {}) => () => ({
  params: {
    ...params,
    height: params.fontSize,
  },
  create: ({ fontSize = 16, width, left = 0, top = 0, color = COLORS.MAIN } = {}) => ({
    '&:after': {
      backgroundImage: `linear-gradient(${rgba(color)} 100%, transparent 0)`,
      backgroundSize: `${width ? width : '100%'} ${fontSize}px`,
      backgroundPosition: `${left}px ${top}px`,
    },
  }),
})

export const square = (params = {}) => () => ({
  params: {
    ...params,
    height: params.size,
    width: params.size,
  },
  create: ({ size, top = 0, left = 0, color = COLORS.MAIN } = {}) => ({
    '&:after': {
      backgroundImage: `linear-gradient(${rgba(color)} 100%, transparent 0)`,
      backgroundSize: `${size ? size : '100%'} ${size ? size : '100%'}`,
      backgroundPosition: `${left}px ${top}px`,
    },
  }),
})
