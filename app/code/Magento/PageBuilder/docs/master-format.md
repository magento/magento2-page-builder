# Master format

## Navigation

1. [Introduction]
2. [Installation guide]
3. [Contribution guide]
4. [Developer documentation]
    1. [Architecture overview]
    1. [BlueFoot to PageBuilder data migration]
    1. [Third-party content type migration]
    1. [Iconography]
    1. [Module integration]
    1. [Additional data configuration]
    1. [Content type configuration]
    1. [How to add a new content type]
    1. [Events]
    1. **Master format**
    1. [Visual select]
    1. [Reuse product conditions in content types]
    1. [Store component master format as widget directive]
    1. [Custom Toolbar]
5. [Roadmap and known issues]

[Introduction]: README.md
[Installation Guide]: install.md
[Contribution guide]: CONTRIBUTING.md
[Developer documentation]: developer-documentation.md
[Architecture overview]: architecture-overview.md
[BlueFoot to PageBuilder data migration]: bluefoot-data-migration.md
[Third-party content type migration]: new-content-type-example.md
[Iconography]: iconography.md
[Module integration]: module-integration.md
[Additional data configuration]: custom-configuration.md
[Content type configuration]: content-type-configuration.md
[How to add a new content type]: how-to-add-new-content-type.md
[Events]: events.md
[Master format]: master-format.md
[Visual select]: visual-select.md
[Reuse product conditions in content types]: product-conditions.md
[Store component master format as widget directive]: widget-directive.md
[Custom Toolbar]: toolbar.md
[Roadmap and Known Issues]: roadmap.md

PageBuilder uses XHTML with inline styles and data attributes as the master format for storage.

**Note:**
*We are still revising master format and it may change.*

## Row

```
<div data-role="row" data-appearance="default" style="..."></div>
```

### main element

Attributes
1. data-role [row]
2. data-appearance [default]
3. data-enable-parallax [1, 0]
4. data-parallax-speed [0-1]
5. data-background-color-format [hex, rgb, hsl, hsv, name, none]
6. class

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

Attributes
1. data-role [column-group]
2. data-appearance [default]

## Column

```
<div data-role="column" data-appearance="full-height" style="..."></div>
```

Attributes
1. data-role [column]
2. data-appearance [full-height, align-top, align-center, align-bottom]
3. class

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
12. min-height
13. width
14. margin
15. padding
16. align-self

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

Attributes
1. data-role [tabs]
2. data-appearance [default]
3. class

Inline styles
1. background-color
2. background-image
3. background-position
4. background-size
5. background-repeat
6. background-attachment
7. text-align

## Tab item

```
<div data-role="tab-item" data-appearance="default" data-tab-name="Tab 1" id="AAQ3VJB" style="..."></div>
```

Attributes
1. data-role [tab-item]
2. data-appearance [default]
3. data-tab-name
4. class

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
14. align-self
15. min-height

## Accordion

```
<div data-role="accordion" data-appearance="default" style="..."></div>
```

Attributes
1. data-role [accordion]
2. data-appearance [default]
3. class

Inline styles
1. text-align
2. border-style
3. border-color
4. border-width
5. border-radius
6. margin
7. padding
8. align-self
9. min-height

## Accordion item

```
<div data-collapsible="true" data-open-on-load="true" class="title">
    <div data-role="trigger">
        <span>Section 1 Title</span></div>
    </div>
    <div data-content="true" class="content">Section 1 content</div>
</div>
```

Attributes
1. data-open-on-load [true, false]
2. class

Title.

HTML content.

## Text

```
<div data-role="text" data-appearance="default" style="..."></div>
```

Attributes
1. data-role [text]
2. data-appearance [default]
3. class

Inline styles
1. text-align
2. border-style
3. border-color
4. border-width
5. border-radius
6. margin
7. padding

## Heading

```
<h1 data-role="heading" data-appearance="default" style="" class="pagebuilder-heading">Heading Text</h1>
<!-- The same for h2, h3, h4, etc -->
```

Attributes
1. data-role [heading]
2. data-appearance [default]
3. class

Inline styles
1. text-align
2. border-style
3. border-color
4. border-width
5. border-radius
6. margin
7. padding

## Buttons

```
<div data-role="buttons" data-appearance="default" style="..."></div>
```

Attributes
1. data-role [buttons]
2. data-appearance [default]
3. class

Inline styles
1. text-align
2. border-style
3. border-color
4. border-width
5. border-radius
6. margin
7. padding

## Button item

```
<div data-role="button-item" data-appearance="default">
    <button href="" style="..." class="item button-primary"><span>Button Text</span></button>
</div>
```

### main element

Attributes
1. data-role [button-item]
2. data-appearance [default]

Inline styles
1. display

### link element

Attributes
1. data-link-type
2. href
3. target
4. class

Inline styles
1. text-align
2. border-style
3. border-color
4. border-width
5. border-radius
6. margin
7. padding

### link_text element

HTML content.

## Divider

```
<hr data-role="divider" data-appearance="default" style="..."/>
```

### main element

Attributes
1. data-role [divider]
2. data-appearance [default]
3. class

Inline styles
1. text-align
2. border-style
3. border-color
4. border-width
5. border-radius
6. margin
7. padding

### link element

Inline styles
1. width
2. border-color
3. border-width

## Anchor

```
<div data-role="anchor" data-appearance="default" id="" style="..."></div>
```

Attributes
1. data-role [anchor]
2. data-appearance [default]
3. id
4. class

Inline styles
1. text-align
2. border-style
3. border-color
4. border-width
5. border-radius
6. margin
7. padding

## HTML & JS Code

```
<div data-role="html" data-appearance="default" style="..."></div>
```

Attributes
1. data-role [html]
2. data-appearance [default]
3. class

Inline styles
1. text-align
2. border-style
3. border-color
4. border-width
5. border-radius
6. margin
7. padding

HTML & JavaScript content.

## Image

```
<figure data-role="image" data-appearance="full-width" data-lightbox="false" style="...">
    <a href="" title="">
        <img src="" title="" alt="" class="pagebuilder-mobile-hidden" />
        <img src="" title="" alt="" class="pagebuilder-mobile-only" />
    </a>
    <figcaption>Image description</figcaption>
</figure>
```

### main element

Attributes
1. data-role [image]
2. data-appearance [full-width]
3. class

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

### main element

Attributes
1. data-role [video]
2. data-appearance [default]

Inline styles
1. text-align

### video element

Attributes
1. src
2. class

Inline styles
1. text-align
2. border-style
3. border-color
4. border-width
5. border-radius
6. margin
7. padding
8. width
9. height

## Slider

```
<div class="pagebuilder-slider" data-role="slider" data-appearance="default" data-autoplay="0"
     data-autoplay-speed="4000" data-fade="0" data-show-arrows="0" data-show-dots="1" style="...">
```

Attributes
1. data-role [slider]
2. data-appearance [default]
3. data-autoplay
4. data-autoplay-speed
5. data-fade
6. data-infinite-loop
7. data-show-arrows
8. data-show-dots
9. class

Inline styles
1. text-align
2. border-style
3. border-color
4. border-width
5. border-radius
6. margin
7. padding
8. min-height

## Slide

Poster

```
<div data-role="slide" data-slide-name="" data-appearance="poster" data-show-button="hover" data-show-overlay="always" style="...">
    <a href="" target="" data-link-type="default">
        <div class="pagebuilder-slide-wrapper pagebuilder-mobile-hidden" style="...">
            <div class="pagebuilder-overlay pagebuilder-poster-overlay" data-overlay-color="rgba(255,255,255,0.5)" style="">
                <div class="pagebuilder-poster-content">
                    <div>Content</div>
                    <button type="button" class="pagebuilder-slide-button pagebuilder-button-primary" style="">Button Text</button>
                </div>
            </div>
        </div>
        <div class="pagebuilder-slide-wrapper pagebuilder-mobile-only" style="">
            <div class="pagebuilder-overlay pagebuilder-poster-overlay" data-overlay-color="rgba(255,255,255,0.5)" style="">
                <div class="pagebuilder-poster-content">
                    <div>Content</div>
                    <button type="button" class="pagebuilder-slide-button pagebuilder-button-primary" style="">Button Text</button>
                </div>
            </div>
        </div>
    </a>
</div>
```

Collage Left

```
<div data-role="slide" data-slide-name="" data-appearance="collage-left" data-show-button="hover" data-show-overlay="always" style="...">
    <a href="" target="" data-link-type="default">
        <div class="pagebuilder-slide-wrapper pagebuilder-mobile-hidden" style="...">
            <div class="pagebuilder-overlay" data-overlay-color="rgba(255,255,255,0.5)" style="">
                <div class="pagebuilder-collage-content">
                    <div>Content</div>
                    <button type="button" class="pagebuilder-slide-button pagebuilder-button-primary" style="">Button Text</button>
                </div>
            </div>
        </div>
        <div class="pagebuilder-slide-wrapper pagebuilder-mobile-only" style="">
            <div class="pagebuilder-overlay" data-overlay-color="rgba(255,255,255,0.5)" style="">
                <div class="pagebuilder-collage-content">
                    <div>Content</div>
                    <button type="button" class="pagebuilder-slide-button pagebuilder-button-primary" style="">Button Text</button>
                </div>
            </div>
        </div>
    </a>
</div>
```

Collage Centered

```
<div data-role="slide" data-slide-name="" data-appearance="collage-centered" data-show-button="hover" data-show-overlay="always" style="...">
    <a href="" target="" data-link-type="default">
        <div class="pagebuilder-slide-wrapper pagebuilder-mobile-hidden" style="...">
            <div class="pagebuilder-overlay" data-overlay-color="rgba(255,255,255,0.5)" style="">
                <div class="pagebuilder-collage-content">
                    <div>Content</div>
                    <button type="button" class="pagebuilder-slide-button pagebuilder-button-primary" style="">Button Text</button>
                </div>
            </div>
        </div>
        <div class="pagebuilder-slide-wrapper pagebuilder-mobile-only" style="">
            <div class="pagebuilder-overlay" data-overlay-color="rgba(255,255,255,0.5)" style="">
                <div class="pagebuilder-collage-content">
                    <div>Content</div>
                    <button type="button" class="pagebuilder-slide-button pagebuilder-button-primary" style="">Button Text</button>
                </div>
            </div>
        </div>
    </a>
</div>
```

Collage Right

```
<div data-role="slide" data-slide-name="" data-appearance="collage-right" data-show-button="hover" data-show-overlay="always" style="...">
    <a href="" target="" data-link-type="default">
        <div class="pagebuilder-slide-wrapper pagebuilder-mobile-hidden" style="...">
            <div class="pagebuilder-overlay" data-overlay-color="rgba(255,255,255,0.5)" style="">
                <div class="pagebuilder-collage-content">
                    <div>Content</div>
                    <button type="button" class="pagebuilder-slide-button pagebuilder-button-primary" style="">Button Text</button>
                </div>
            </div>
        </div>
        <div class="pagebuilder-slide-wrapper pagebuilder-mobile-only" style="">
            <div class="pagebuilder-overlay" data-overlay-color="rgba(255,255,255,0.5)" style="">
                <div class="pagebuilder-collage-content">
                    <div>Content</div>
                    <button type="button" class="pagebuilder-slide-button pagebuilder-button-primary" style="">Button Text</button>
                </div>
            </div>
        </div>
    </a>
</div>
```

### main element

Attributes
1. data-role [slide]
2. data-slide-name
3. data-appearance [poster, collage-left, collage-centered, collage-right]
4. data-show-button
5. data-show-overlay

Inline styles
1. border-style
2. border-color
3. border-width
4. border-radius

### link element

Attributes
1. href
2. target
3. data-link-type

### overlay element

Attributes
1. data-overlay-color

Inline styles
1. background-color

### desktop_image element

Inline styles
1. background-color
2. background-image
3. background-position
4. background-size
5. background-repeat
6. background-attachment
7. text-align
8. margins-and-padding
9. min-height


### mobile_image element

Inline styles
1. background-color
2. background-image
3. background-position
4. background-size
5. background-repeat
6. background-attachment
7. text-align
8. margins-and-padding
9. min-height

### content element

HTML content.

### button element

Attributes
1. class

Inline styles
1. opacity
2. visibility

HTML content.

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

### main element

Attributes
1. data-role [banner]
2. data-appearance [poster, collage-left, collage-centered, collage-right]
3. data-show-button
4. data-show-overlay
5. class

Inline styles
1. border-style
2. border-color
3. border-width
4. border-radius
5. margin

### link element

Attributes
1. data-role
2. data-appearance
3. href
4. target
5. data-link-type

### overlay element

Attributes
1. data-role
2. data-appearance
3. data-link-type
4. data-overlay-color
5. href
6. target

Inline styles
1. background-color

### desktop_image element

Inline styles
1. background-color
2. background-image
3. background-position
4. background-size
5. background-repeat
6. background-attachment
7. text-align
8. padding
9. min-height


### mobile_image element

Inline styles
1. background-color
2. background-image
3. background-position
4. background-size
5. background-repeat
6. background-attachment
7. text-align
8. padding
9. min-height

### content element

HTML content.

### button element

Attributes
1. class

Inline styles
1. opacity
2. visibility

HTML content.

## Map

```
<iframe data-role="map" data-appearance="default" style="..."></iframe>
```

Attributes
1. data-role [map]
2. data-appearance [default]
3. data-position
4. data-zoom
5. data-location-name
6. data-address
7. data-city
8. data-zipcode
9. data-country
10. data-comment
11. data-show-controls
12. class

Inline styles
1. text-align
2. border-style
3. border-color
4. border-width
5. border-radius
6. margin
7. padding
8. width
9. height

## Block

```
<div data-role="block" data-appearance="default" data-identifier="block-identifier" style="..."></div>
```

Attributes
1. data-role [block]
2. data-appearance [default]
3. data-identifier
4. class

Inline styles
1. text-align
2. border-style
3. border-color
4. border-width
5. border-radius
6. margin
7. padding

## Products

```
<div data-role="products" data-appearance="grid">{{widget type="Magento\CatalogWidget\Block\Product\ProductsList" template="Magento_CatalogWidget::product/widget/content/grid.phtml" anchor_text="" id_path="" show_pager="0" products_count="5" type_name="Catalog Products List" conditions_encoded=""}}</div>
```

Attributes
1. data-role [products]
2. data-appearance [grid]

Inline styles
1. text-align
2. border-style
3. border-color
4. border-width
5. border-radius
6. margin
7. padding
