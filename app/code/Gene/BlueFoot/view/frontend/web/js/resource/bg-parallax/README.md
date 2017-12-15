# bg-parallax [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A vanilla javascript background parallax plugin that leverages native browser animation and minds performance while keeping things simple. It's just 2kb!

## How to use it
Download the [latest release](https://github.com/dreamorosi/bg-parallax/releases/latest) and add it at the end of your page right before the `</body>` closing tag.
```html
<script src="path/to/bg-parallax.min.js"></script>
```
Then in your `onload` function just call `bgParallax()` by passing it the `className` of the elements you'd like to apply the background parallax effect.
```js
function init () {
  window.bgParallax('.your-className')
}

window.onload = init;
```

In addition to that you'll have to set a background image to the element you want to apply the effect but if you don't do that the effect won't simply be applied.

You can also independently set the speed of the parallax effect of by adding a data attribute to the element itself. The higher the value is the faster the background image of the element will scroll in comparison to the rest of the page.
```html
<section class="your-className" data-speed="5">

</section>
```
## How it works
In order to achieve good performances, avoid stuttering and keeping the package size small we try to leverage standard Web APIs as much as possible.

When the plugin is first called after the page is loaded it firstly looks for and caches the elements to watch and eventually apply the parallax effect. If no elements with the provided `className` are in the page the plugin won't set any event listener so even if you are lazy and forget to keep in order your scripts it won't impact your page's performance in any way.

If one or more elements are found the plugin sets a debounced event listener `onscroll` that basically checks whether or not any of the watched elements are in the viewport and if so proceeds to animate them, the whole idea is to minimize reflows and repaints.

The animation is carried out using [`window.requestAnimationFrame()`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame), a method that tells the browser that we want to perform an animation and requests that the browser call a specified function to update an animation before the next repaint.

## License
MIT © 2017 [Andrea Amorosi](https://dreamorosi.com)

## ToDo
- [ ] Limit parallax range
- [ ] Improve speed settings
- [ ] Add orizontal effect
- [ ] Find a way to check that a background image is present
- [ ] Add comments
- [ ] Add tests
