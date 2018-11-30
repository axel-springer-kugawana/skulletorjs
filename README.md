![enter image description here](https://www.stickersmalin.com/images/ajoute/prd/196/196290-image2_448x448.png)

# SkeletorJS

## Motivation

SkeletorJS is a Javascript library that allow you to ease your skeleton loading screen creation.
It use predefined shapes you can configure and compose to create more complex skeleton.

The created skeletons are CSS based, SkeletorJS also provide control capabilites such as restart, end, disapear (related to fadeout).

### Simple example

This basic script produce a vanilla javascript skeleton.
Easy to create, it simply use some base shapes and append the result to the DOM.

```javascript
const bluePrint = () => [
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

const { Skeletor } = skeletor([bluePrint(), bluePrint()], [applyBaseCSS])
const dom = document.getElementById('root')
dom.appendChild(Skeletor)
```

The result :
![enter image description here](https://raw.githubusercontent.com/axel-springer-kugawana/skeletor/master/doc/screen1.JPG)

## Installation

    npm install skeletorjs

## How to use ?

First of all, you need to choose between two adapter : VanillaJS or React adapter. It will define what kind of skeletor you're going to use, but the call is still the same.

#### Vanilla adapter :

```javascript
import skeletor from 'skeletorjs/adapter/vanilla'

// Here, 'Skeletor' is a domNode ready to be injected inside the document ...
const { Skeletor } = skeletor([bluePrint()], [...middlewares])

dom.appendChild(Skeletor)
```

#### React adapter :

```javascript
import React from 'react'
import skeletor from 'skeletorjs/adapter/react'

// ... while here, 'Skeletor' is a react Component.
const { Skeletor } = skeletor([bluePrint()], [...middlewares])

ReactDOM.render(
  <div>
    <Skeletor />
  </div>,
  dom,
)
```

### Shapes

SkeletorJS provide some basic shapes, most of the time they will be sufficient to satisfy common needs. (But it is possible to create your own, go to chapter 'Raw CSS' or 'Going further')
Shape usage is very simple, they are just a bunch of functions with predefined and comprehensive parameters.

They are four shapes : rectangle, line, circle and square (square is equal to rectangle but use only size instead of width / height params).

```javascript
import { rectangle, line, circle, square } from 'skeletorjs/shapes'
const white = { r: 255, g: 255, b: 255, a: 1 }

const authorIcon = circle({ radius: 35, left: 15, top: 15, color: white })
const photo = rectangle({ height: [185, 'px'] })
const title = line({ fontSize: 22, width: [180, 'px'], topGap: 20, left: 20 })

const bluePrint = [authorIcon, photo, title]
```

The blueprint **order** is important :

- the stack will be displayed from first to last shape : if you want the white icon to be on top of the grey rectangle, you need to fill the blue print array with, first, the icon and then the rectangle.

```javascript
const bluePrint = [
	whiteIcon, // Will be on top if shapes should overlap.
	greyRectangle,
	...
]
```

- Gap handling is possible with the use of `topGap` or `leftGap` properties. If set, they will position the shape with a gap from the previous shape.

```javascript
const bluePrint = [
	rectangle({ height: [185, 'px'] }),
	line({ fontSize: 22, topGap: 20 }), //  Will be positioned 20px after the rectangle.
	...
]
```

### Middlewares

SkeletorJS use a simple middleware system to augment itself, it comes with three premade middleware but in the section "going further", I will show how to create them.

Some of them are adapter's exclusive like `applyFadeOut` while others are able to use on all adapters.

```javascript
import skeletor, { applyFadeOut } from 'skeletorjs/adapter/vanilla'
import { applyBaseCSS, applyAnimation } from 'skeletorjs/middlewares'

const { Skeletor } = skeletor([bluePrint()], [applyBaseCSS, applyAnimation, applyFadeOut])
```

When applying the middleware `applyAnimation`, the laser ray style animation is applied on our skeleton :

![enter image description here](https://raw.githubusercontent.com/axel-springer-kugawana/skeletor/master/doc/screen2.gif)

It's possible to provide your own middlewares, go to "going further" section to learn how.

### Control

SkeletorJS provide control capabilites, this is the big difference between Vanilla and React adapter, let's see the vanilla version. (The React version will be explained in the next chapter with a full example)

```javascript
import skeletor, { applyFadeOut } from 'skeletorjs/adapter/vanilla'
import { applyBaseCSS, applyAnimation } from 'skeletorjs/middlewares'

const { Skeletor, end } = skeletor([bluePrint()], [applyBaseCSS, applyAnimation, applyFadeOut])

const dom = document.getElementById('root')
dom.appendChild(Skeletor)

// The skeleton will end after 2 seconds, and when disapear, display a text.
setTimeout(() => {
  end().then(() => {
    dom.innerText = 'Loading finished !'
  })
}, 2000)
```

**Be careful**, `end` is different from `disapear`, when `end` is called, the skeletor is asked to finish, but the promise will resolve only when all middlewares release. For instance, with `applyFadeOut` middleware, the skeletor could end but will disapear only when fadeout is terminated.
