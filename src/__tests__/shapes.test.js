import { COLORS, rgba, circle, rectangle, line, square } from '../shapes'

describe('shapes.js', () => {
  describe('exports', () => {
    it('should export a COLORS constant', () => {
      expect(COLORS).toBeDefined()
      expect(typeof COLORS === 'object').toBe(true)
    })

    it('should export an rgba function', () => {
      expect(rgba).toBeDefined()
      expect(typeof rgba === 'function').toBe(true)
    })

    it('should export a circle shape', () => {
      expect(circle).toBeDefined()
      expect(typeof circle === 'function').toBe(true)
    })

    it('should export a rectangle shape', () => {
      expect(rectangle).toBeDefined()
      expect(typeof rectangle === 'function').toBe(true)
    })

    it('should export a line shape', () => {
      expect(line).toBeDefined()
      expect(typeof line === 'function').toBe(true)
    })

    it('should export a square shape', () => {
      expect(square).toBeDefined()
      expect(typeof square === 'function').toBe(true)
    })
  })

  describe('shapes', () => {
    const forEachShape = (cb) =>
      [
        {
          shape: circle,
          params: { radius: 20, left: 10, top: 10 },
          expectedCSS: {
            '&:after': { backgroundImage: 'radial-gradient(circle 20px at center, rgba(231, 231, 231, 1) 99%, transparent 0)', backgroundSize: '40px 40px', backgroundPosition: '10px 10px' },
          },
          expectedCSSDefault: {
            '&:after': { backgroundImage: 'radial-gradient(circle 16px at center, rgba(231, 231, 231, 1) 99%, transparent 0)', backgroundSize: '32px 32px', backgroundPosition: '0px 0px' },
          },
        },
        {
          shape: rectangle,
          params: { width: [100, '%'], height: [185, 'px'], top: 10, left: 10 },
          expectedCSS: { '&:after': { backgroundImage: 'linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0)', backgroundSize: '100,% 185,px', backgroundPosition: '10px 10px' } },
          expectedCSSDefault: { '&:after': { backgroundImage: 'linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0)', backgroundSize: '100% 100%', backgroundPosition: '0px 0px' } },
        },
        {
          shape: line,
          params: { fontSize: 23, width: [100, '%'], top: 12, left: 12 },
          expectedCSS: { '&:after': { backgroundImage: 'linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0)', backgroundSize: '100,% 23px', backgroundPosition: '12px 12px' } },
          expectedCSSDefault: { '&:after': { backgroundImage: 'linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0)', backgroundSize: '100% 16px', backgroundPosition: '0px 0px' } },
        },
        {
          shape: square,
          params: { size: [120, 'px'], top: 20, left: 20 },
          expectedCSS: { '&:after': { backgroundImage: 'linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0)', backgroundSize: '120,px 120,px', backgroundPosition: '20px 20px' } },
          expectedCSSDefault: { '&:after': { backgroundImage: 'linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0)', backgroundSize: '100% 100%', backgroundPosition: '0px 0px' } },
        },
      ].forEach(cb)

    forEachShape(({ shape, params, expectedCSS, expectedCSSDefault }) => {
      describe('Shape should return a function', () => {
        it(`${shape.name}`, () => {
          const result = shape()
          expect(result).toBeDefined()
          expect(typeof result === 'function').toBe(true)
        })
      })
      describe('Shape next function should provide an properly formatted object', () => {
        it(`${shape.name}`, () => {
          const shapeCreator = shape(params)
          const shapeObject = shapeCreator()

          expect(shapeObject).toBeDefined()
          expect(shapeObject).toHaveProperty('params')
          expect(shapeObject).toHaveProperty('create')

          expect(typeof shapeObject.params === 'object').toBe(true)
          expect(typeof shapeObject.create === 'function').toBe(true)
        })
      })
      describe('Shape create function should produce correct shape using provided params', () => {
        it(`${shape.name}`, () => {
          const shapeCreator = shape(params)
          const shapeObject = shapeCreator()
          const shapeCSS = shapeObject.create(shapeObject.params)
          expect(shapeCSS).toEqual(expectedCSS)
        })
      })
      describe('Shape create function should produce default shape when not providing params', () => {
        it(`${shape.name}`, () => {
          const shapeCreator = shape()
          const shapeObject = shapeCreator()
          const shapeCSS = shapeObject.create()
          expect(shapeCSS).toEqual(expectedCSSDefault)
        })
      })
    })
  })

  it('should provide a proper COLORS object', () => {
    expect(COLORS).toMatchObject({
      MAIN: {},
      SUB: {},
    })
  })
})
