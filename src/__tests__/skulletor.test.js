import skulletor from '../skulletor'
import { circle, rectangle, line } from '../shapes'

const adapterMock = () => {
  let id = 0

  function transform(cssObject) {
    return JSON.stringify({
      [`skeleton-mock-${id++}`]: cssObject,
    })
  }

  function render(skeletonArray) {
    return { Skulletor: skeletonArray.toString() }
  }

  function finish() {}

  return { transform, finish, render }
}

const bluePrintSample1 = () => [
  {
    width: [35, '%'],
    height: [365, 'px'],
  },
  circle({ radius: 35, left: 15, top: 15, color: { r: 255, g: 255, b: 255, a: 1 } }),
  rectangle({ height: [185, 'px'] }),
  line({ fontSize: 22, width: [180, 'px'], topGap: 20, left: 20 }),
  line({ fontSize: 22, width: [120, 'px'], topGap: 20, left: 20 }),
  line({ fontSize: 36, width: [150, 'px'], topGap: 20, left: 20 }),
]

const bluePrintSample2 = () => [
  {
    width: [35, '%'],
    height: [365, 'px'],
  },
  rectangle({ height: [185, 'px'] }),
  line({ fontSize: 22, width: [180, 'px'], topGap: 20, left: 20 }),
  line({ fontSize: 36, width: [150, 'px'], topGap: 20, left: 20 }),
]

describe('skulletor.js', () => {
  describe('when giving bad parameters', () => {
    it('should return undefined when empty shape array provided', () => {
      const result = skulletor([], [], adapterMock())
      expect(result).toBeUndefined()
    })
    it('should return undefined when no shape array provided', () => {
      const result = skulletor(undefined, [], adapterMock())
      expect(result).toBeUndefined()
    })
    it('should return undefined when no params provided', () => {
      const result = skulletor()
      expect(result).toBeUndefined()
    })
    it('should return undefined when empty media query shape object provided', () => {
      const result = skulletor({}, [], adapterMock())
      expect(result).toBeUndefined()
    })
  })

  describe('when using skulletor non responsive way', () => {
    it('should produce a properly stringified skulletor', () => {
      const { Skulletor } = skulletor([bluePrintSample1(), bluePrintSample1()], [], adapterMock())
      const expected =
        '{"skeleton-mock-0":{"skeleton":{"&:after":{"backgroundImage":"radial-gradient(circle 35px at center, rgba(255, 255, 255, 1) 99%, transparent 0), linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0), linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0), linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0), linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0)","backgroundSize":"70px 70px, 100% 185px, 180px 22px, 120px 22px, 150px 36px","backgroundPosition":"15px 15px, 0px 0px, 20px 205px, 20px 247px, 20px 289px"},"width":"35%","height":"365px"}}},{"skeleton-mock-1":{"skeleton":{"&:after":{"backgroundImage":"radial-gradient(circle 35px at center, rgba(255, 255, 255, 1) 99%, transparent 0), linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0), linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0), linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0), linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0)","backgroundSize":"70px 70px, 100% 185px, 180px 22px, 120px 22px, 150px 36px","backgroundPosition":"15px 15px, 0px 0px, 20px 205px, 20px 247px, 20px 289px"},"width":"35%","height":"365px"}}}'

      expect(Skulletor).toEqual(expected)
    })
  })
  describe('when using skulletor responsive way', () => {
    const mockMatchMedia = (valueToMock) => (media) => ({
      matches: media === `(${valueToMock})`,
    })

    it('should provide media queries compatible stringified skulletor', () => {
      global.window.matchMedia = mockMatchMedia('max-width: 639px')

      let result = skulletor(
        {
          'max-width: 639px': [bluePrintSample1(), bluePrintSample1()],
          'min-width: 640px': [bluePrintSample2(), bluePrintSample2()],
        },
        [],
        adapterMock(),
      )
      let expected =
        '{"skeleton-mock-0":{"skeleton":{"&:after":{"backgroundImage":"radial-gradient(circle 35px at center, rgba(255, 255, 255, 1) 99%, transparent 0), linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0), linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0), linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0), linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0)","backgroundSize":"70px 70px, 100% 185px, 180px 22px, 120px 22px, 150px 36px","backgroundPosition":"15px 15px, 0px 0px, 20px 205px, 20px 247px, 20px 289px"},"width":"35%","height":"365px"}}},{"skeleton-mock-1":{"skeleton":{"&:after":{"backgroundImage":"radial-gradient(circle 35px at center, rgba(255, 255, 255, 1) 99%, transparent 0), linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0), linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0), linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0), linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0)","backgroundSize":"70px 70px, 100% 185px, 180px 22px, 120px 22px, 150px 36px","backgroundPosition":"15px 15px, 0px 0px, 20px 205px, 20px 247px, 20px 289px"},"width":"35%","height":"365px"}}}'
      expect(result.Skulletor).toEqual(expected)

      global.window.matchMedia = mockMatchMedia('min-width: 640px')

      result = skulletor(
        {
          'max-width: 639px': [bluePrintSample1(), bluePrintSample1()],
          'min-width: 640px': [bluePrintSample2(), bluePrintSample2()],
        },
        [],
        adapterMock(),
      )
      expected =
        '{"skeleton-mock-0":{"skeleton":{"&:after":{"backgroundImage":"linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0), linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0), linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0)","backgroundSize":"100% 185px, 180px 22px, 150px 36px","backgroundPosition":"0px 0px, 20px 205px, 20px 247px"},"width":"35%","height":"365px"}}},{"skeleton-mock-1":{"skeleton":{"&:after":{"backgroundImage":"linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0), linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0), linear-gradient(rgba(231, 231, 231, 1) 100%, transparent 0)","backgroundSize":"100% 185px, 180px 22px, 150px 36px","backgroundPosition":"0px 0px, 20px 205px, 20px 247px"},"width":"35%","height":"365px"}}}'
      expect(result.Skulletor).toEqual(expected)
    })
  })
})
