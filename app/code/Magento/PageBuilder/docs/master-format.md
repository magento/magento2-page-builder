# Master format

For storage (later master format) Page Builder uses XHTML with inline styles and data attributes.

This document describes master format for default Page Builder content types.

## Row

```
<div data-role="row" data-appearance="default" style="..."></div>
```

### main element

Attributes
1. data-role
2. data-appearance
3. data-enable-parallax
4. data-parallax-speed
5. data-background-color-format

Inline styles
1. background-color
2. background-image
3. background-position
4. background-size
5. background-repeat
6. background-attachment
7. text-align
8. border-style
9. border-color
10. border-width
11. border-radius
12. margin
13. padding

## Column group

```
<div data-role="column-group" data-appearance="default"></div>
```

## Column

```
<div data-role="column" data-appearance="full-height" style="..."></div>
```

## Tabs

```
<div data-role="tabs" data-appearance="default" data-active-tab="" class="tab-align-left" style="margin: 0px; padding: 0px;">
    <ul role="tablist" class="tabs-navigation" style="text-align: left;">
        <li role="tab" data-appearance="default" class="tab-header" style="border-radius: 0px; border-width: 1px;"><a href="#AAQ3VJB" class="tab-title"><span class="tab-title">Tab 1</span></a></li>
        <li role="tab" data-appearance="default" class="tab-header" style="border-radius: 0px; border-width: 1px;"><a href="#D1KOU6H" class="tab-title"><span class="tab-title">Tab 2</span></a></li>
    </ul>
    <div class="tabs-content" style="border-width: 1px; border-radius: 0px; min-height: 300px;">
        ....
    </div>
</div>
```

## Tab item

```
<div data-role="tab-item" data-appearance="default" data-tab-name="Tab 1" id="AAQ3VJB" style="..."></div>
```

## Accordion

```
<div data-role="accordion" style="..."></div>
```

```
<div data-role="item" data-collapsible="true" data-open-on-load="true" class="title">
    <div data-role="trigger">
        <span>Section 1 Title</span></div>
    </div>
    <div data-content="true" class="content">Section 1 content</div>
</div>
```

## Text

```
<div data-role="text" data-appearance="default" style="..."></div>
```

## Heading

```
<h1 data-role="heading" data-appearance="default" style="" class="pagebuilder-heading">Heading Text</h1>
<!-- The same for h2, h3, h4, etc -->
```

## Buttons

```
<div data-role="buttons" data-appearance="default" style="..."></div>
```

## Button item

```
<div data-role="button-item" data-appearance="default">
    <button href="" style="..." class="item button-primary"><span>Button Text</span></button>
</div>
```

## Divider

```
<hr data-role="divider" data-appearance="default" style="..."/>
```

## Anchor

```
<div data-role="anchor" data-appearance="default" id="" style="..."></div>
```

## HTML & JS Code

```
<div data-role="html" data-appearance="default" style="..."></div>
```

## Image

```
<figure data-role="image" data-appearance="full-width" data-lightbox="false" style="...">
    <a href="" title="">
        <img src="" title="" alt="" class="pagebuilder-mobile-hidden" />
        <img src="" title="" alt="" class="pagebuilder-desktop-hidden" />
    </a>
    <figcaption>Image description</figcaption>
</figure>
```

### main element

Attributes
1. data-role
2. data-appearance

Inline styles
1. text-align
2. border-style
3. border-color
4. border-width
5. border-radius
6. margin
7. padding

### desktop_image element

Attributes
1. alt
2. title

Inline styles
1. max-width
2. height

### mobile_image element

Attributes
1. alt
2. title

Inline styles
1. max-width
2. height

### link element

Attributes
1. href
2. title
3. data-link-type

### caption element

HTML content.

## Video

```
<div data-role="video" data-appearance="default" style="...">
    <iframe frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen data-bind="attr: getVideoAttributes(), style: getStyle(), css: getCss()"></iframe>
</div>
```

## Slider

```
<div data-role="slider" data-appearance="default" style="..."></div>
```

```
<div data-role="slide" data-appearance="poster" data-has-overlay="true" style="...">
    <div>
        <div class="content-wrapper">
            <h3>Slide 1 Title</h3>
            <div class="content">Slide 1 content</div>
            <a href="" class="button">
                <span><span>Button Text</span></span>
            </a>
        </div>
    </div>
</div>
```

## Banner

Poster

```
<div data-role="banner" data-appearance="poster" data-overlay-color="rgb(0, 0, 0)" data-appearance="poster" style="...">
    <a href="" target="">
        <div class="wrapper pagebuilder-mobile-only">
            <div style="" class="overlay">
                <div class="content">
                    <div>Content</div>
                    <button type="button" style="" class="action primary" >Button Text</button>
                </div>
            </div>
        </div>
        <div style="" class="wrapper">
            <div style="" class="overlay">
                <div class="content">
                    <div>Banner content</div>
                    <button type="button" style="" class="action primary">Button Text</button>
                </div>
            </div>
        </div>
    </a>
</div>
```

Collage Left

```
<div data-role="banner" data-appearance="collage-left" data-overlay-color="rgb(0, 0, 0)" data-appearance="collage-left" style="" class="pagebuilder-banner">
    <a href="" target="">
        <div style=""
             class="pagebuilder-mobile-only wrapper">
            <div style="" class="overlay>
                <div class="content">
                    <div>Banner content</div>
                    <button style="" class="action primary">Banner Text</button>
                </div>
            </div>
        </div>
        <div style="" class="pagebuilder-mobile-only wrapper">
            <div style="" class="overlay">
                <div class="content">
                    <div>Banner content</div>
                    <button style="" class="action primary">Button Text</button>
                </div>
            </div>
        </div>
    </a>
</div>
```

Collage Centered

```
<div data-role="banner" data-appearance="collage-centered" data-overlay-color="rgb(0, 0, 0)" data-appearance="collage-center" style="" class="pagebuilder-banner">
    <a href="" target="">
        <div style="" class="pagebuilder-desktop-only wrapper">
            <div class="overlay">
                <div class="content">
                    <div>Button content</div>
                    <button style="" class="action primary">Button Text</button>
                </div>
            </div>
        </div>
        <div style="" class="pagebuilder-mobile-only wrapper">
            <div style="" class="overlay">
                <div class="content">
                    <div>Banner content</div>
                    <button style="" class="action primary">Button Text</button>
                </div>
            </div>
        </div>
    </a>
</div>
```
Collage Right

```
<div data-role="banner" data-appearance="collage-right" data-overlay-color="rgb(0, 0, 0)" data-appearance="collage-right" style="" class="pagebuilder-banner">
    <a href="" target="">
        <div style="" class="pagebuilder-desktop-only wrapper">
            <div style="" class="overlay">
                <div class="content">
                    <div data-bind="html: getContentHtml()"></div>
                    <button style="" class="action primary">Button Text</button>
                </div>
            </div>
        </div>
        <div style="" class="pagebuilder-mobile-only wrapper">
            <div style="" class="overlay">
                <div class="content">
                    <div>Banner content</div>
                    <button style="" class="action primary">Button Text</button>
                </div>
            </div>
        </div>
    </a>
</div>
```

## Map

```
<iframe data-role="map" data-appearance="default" style="..."></iframe>
```

## Block

```
<div data-role="block" data-appearance="default" data-identifier="block-identifier" style="..."></div>
```

## Product

```
<div data-role="product" data-appearance="default" data-sku="product1-sku" data-view-mode="list" style="" class="pagebuilder-product"></div>
```


## Product List

```
<div data-role="product-list" data-appearance="default" data-category-id="product1-sku" data-hide-out-of-stock="" data-product-count="4" style="..." class="pagebuilder-product-list"></div>
```
