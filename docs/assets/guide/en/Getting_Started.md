# Quick Start

In this tutorial, we will show you how to use VRender to draw a circle. VRender is a simple-to-use, cross-platform, high-performance front-end visualization rendering library.

## Get VRender

You can obtain VRender in several ways.

### Using NPM Package

First, you need to install VRender in the project root directory using the following command:

```sh
# Install with npm
npm install @visactor/vrender

# Install with yarn
yarn add @visactor/vrender
```

### Using CDN

You can also get the built VRender file through the CDN. Add the following code to the `<head>` tag of the HTML file:

```html
<script src="https://unpkg.com/@visactor/vrender/build/index.min.js"></script>
```

## Introducing VRender

### Import VRender via NPM Package

Use `import` to introduce VRender at the top of the JavaScript file:

```js
import VRender from '@visactor/vrender';
```

### Import VRender using the script tag

Introduce the built vchart file directly by adding a `<script>` tag in the HTML file:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <!-- Introduce vchart file -->
    <script src="https://unpkg.com/@visactor/vrender/build/index.min.js"></script>
  </head>
</html>
```

## Drawing a Circle

Before we draw, we can prepare a DOM container with width and height for VRender.

```html
<body>
  <!-- Prepare a DOM with size (width and height) for vchart, or you can specify it in the spec configuration -->
  <div id="main" style="width: 600px;height:400px;"></div>
</body>
```

Next, let's create a `Stage` instance based on this Canvas, create a circle and add it to the `Stage`:

```ts
// Create a stage
const stage = createStage({
    canvas: 'main',
    autoRender: true // Enable automatic rendering
});
// Create a circle element
const circle = createCircle({
    radius: 60,
    x: 200,
    y: 200,
    fill: 'red',
});
// Add it to the stage
stage.defaultLayer.add(circle);
```

At this point, you have successfully drawn a red circle!

```javascript
// Create a stage
const stage = createStage({
    canvas: 'main',
    autoRender: true // Enable automatic rendering
});
// Create a circle element
const circle = createCircle({
    radius: 60,
    x: 200,
    y: 200,
    fill: 'red',
});
// Listen to click events, then change fill color to green
circle.addEventListener('click', () => {
    circle.setAttribute('fill', 'green');
});
// Add it to the stage
stage.defaultLayer.add(circle);
```

We hope this tutorial helps you learn how to use VChart. Now you can try drawing different types of charts and customize more diverse chart effects by understanding in depth the various configuration options of VChart. Embark on your VChart journey bravely!