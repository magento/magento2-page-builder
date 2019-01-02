# Master format
<!-- {% raw %} -->
PageBuilder uses XHTML with inline styles and data attributes as the master format for storage.

**Note:**
*We are still revising master format and it may change.*

## Row

Contained:

```html
<div class="row-contained-wrapper" data-element="wrapper" data-role="row" data-appearance="contained">
    <div data-background-images="{}" style="..."></div>
</div>
```

### wrapper element

1. data-element [main]
2. data-role [row]
3. data-appearance [contained]

### main element

Attributes

1. data-enable-parallax [1, 0]
2. data-parallax-speed [0-1]
3. data-background-images `{"desktop_image":"{{media url}}","mobile_image":"{{media url}}"}`
4. class

Full Width:

```html
<div data-element="main" data-role="row" data-appearance="contained" data-background-images="{}" style="...">
    <div data-element="inner" class="row-full-width-inner"></div>
</div>
```

Full Bleed:

```html
<div data-element="main" data-role="row" data-appearance="full-bleed" data-background-images="{}" style="..."></div>
```

### main element

Attributes

1. data-element [main]
2. data-role [row]
3. data-appearance [full-width, full-bleed]
4. data-enable-parallax [1, 0]
5. data-parallax-speed [0-1]
6. data-background-images `{"desktop_image":"{{media url}}","mobile_image":"{{media url}}"}`
7. class

Inline styles

1. background-color
2. background-position
3. background-size
4. background-repeat
5. background-attachment
6. text-align
7. border-style
8. border-color
9. border-width
10. border-radius
11. margin
12. padding
13. height
14. justify-content
15. display
16. flex-direction

## Column group

```
<div data-element="main" data-role="column-group" data-appearance="default"></div>
```

Attributes

1. data-element [main]
2. data-role [column-group]
3. data-appearance [default]

## Column

```
<div data-element="main" data-role="column" data-appearance="full-height" data-background-images="{}" style="..."></div>
```

Attributes
1. data-element [main]
2. data-role [column]
3. data-appearance [full-height, align-top, align-center, align-bottom]
4. data-background-images `{"desktop_image":"{{media url}}","mobile_image":"{{media url}}"}`
5. class

Inline styles
1. background-color
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
<div data-element="main" data-role="tabs" data-appearance="default" data-active-tab="" class="tab-align-left" style="margin: 0px; padding: 0px;">
    <ul data-element="navigation" role="tablist" class="tabs-navigation" style="text-align: left;">
        <li data-element="headers" role="tab" data-appearance="default" class="tab-header" style="border-radius: 0px; border-width: 1px;"><a href="#AAQ3VJB" class="tab-title"><span class="tab-title">Tab 1</span></a></li>
        <li data-element="headers" role="tab" data-appearance="default" class="tab-header" style="border-radius: 0px; border-width: 1px;"><a href="#D1KOU6H" class="tab-title"><span class="tab-title">Tab 2</span></a></li>
    </ul>
    <div data-element="content" class="tabs-content" style="border-width: 1px; border-radius: 0px; min-height: 300px;">
        ....
    </div>
</div>
```

### main element

Attributes
1. data-element [main, navigation, headers, content]
2. data-role [tabs]
3. data-appearance [default]
4. class

Inline styles
1. background-color
2. background-image
3. background-position
4. background-size
5. background-repeat
6. background-attachment

### navigation element

Attributes
1. data-element [navigation]

Inline styles
1. text-align

### headers element

Attributes
1. data-element [headers]

Inline styles
1. border-radius
2. border-color
3. border-width

### content element

Attributes
1. data-element [content]

Inline styles
1. text-align
2. border-color
3. border-width
4. border-radius
5. min-height

## Tab item

```
<div data-element="main" data-role="tab-item" data-appearance="default" data-tab-name="Tab 1" id="AAQ3VJB" style="..."></div>
```

Attributes
1. data-element [main]
2. data-role [tab-item]
3. data-appearance [default]
4. data-tab-name
5. class

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
16. justify-content
17. display
18. flex-direction

## Text

```
<div data-element="main" data-role="text" data-appearance="default" style="..."></div>
```

Attributes
1. data-element [main]
2. data-role [text]
3. data-appearance [default]
4. class

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
<h1 data-element="main" data-role="heading" data-appearance="default" style="" class="pagebuilder-heading">Heading Text</h1>
<!-- The same for h2, h3, h4, etc -->
```

Attributes
1. data-element [main]
2. data-role [heading]
3. data-appearance [default]
4. class

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
<div data-element="main" data-role="buttons" data-appearance="inline" style="..."></div>
```

Attributes
1. data-element [main]
2. data-role [buttons]
3. data-appearance [inline, stacked]
4. class

Inline styles
1. text-align
2. border-style
3. border-color
4. border-width
5. border-radius
6. margin
7. padding
8. display
9. flex-direction (only on stacked appearance)

## Button item

```
<div data-element="main" data-role="button-item" data-appearance="default">
    <a data-element="link" href="" style="..." class="item button-primary"><span data-element="link_text">Button Text</span></a>
</div>
```

### main element

Attributes
1. data-element [main]
2. data-role [button-item]
3. data-appearance [default]

Inline styles
1. display

### link element

Attributes
1. data-element [link]
2. data-link-type
3. href
4. target
5. class

Inline styles
1. text-align
2. border-style
3. border-color
4. border-width
5. border-radius
6. margin
7. padding

### link_text element

Attributes
1. data-element [link_text]

HTML content.

## Divider

```
<hr data-element="main" data-role="divider" data-appearance="default" style="..."/>
```

### main element

Attributes
1. data-element [main]
2. data-role [divider]
3. data-appearance [default]
4. class

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

## HTML & JS Code

```
<div data-element="main" data-role="html" data-appearance="default" style="..."></div>
```

Attributes
1. data-element [main]
2. data-role [html]
3. data-appearance [default]
4. class

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
<figure data-element="main" data-role="image" data-appearance="full-width" data-lightbox="false" style="...">
    <a data-element="link" href="" title="">
        <img data-element="desktop_image" src="" title="" alt="" class="pagebuilder-mobile-hidden" />
        <img data-element="mobile_image" src="" title="" alt="" class="pagebuilder-mobile-only" />
    </a>
    <figcaption data-element="caption">Image description</figcaption>
</figure>
```

### main element

Attributes
1. data-element [main]
2. data-role [image]
3. data-appearance [full-width]
4. class

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
1. data-element [desktop_image]
2. alt
3. title

Inline styles
1. max-width
2. height

### mobile_image element

Attributes
1. data-element [mobile_image]
2. alt
3. title

Inline styles
1. max-width
2. height

### link element

Attributes
1. data-element [link]
2. href
3. title
4. data-link-type

### caption element

Attributes
1. data-element [caption]

HTML content.

## Video

```
<div data-element="main" data-role="video" data-appearance="default" style="...">
    <div data-element="wrapper" class="pagebuilder-video-wrapper">
        <div class="pagebuilder-video-container">    
            <iframe data-element="video" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen data-bind="attr: getVideoAttributes(), style: getStyle(), css: getCss()"></iframe>
        </div>
    </div>
</div>
```

### main element

Attributes
1. data-element [main]
2. data-role [video]
3. data-appearance [default]
4. class

Inline styles
1. justify-content

### wrapper element

Attributes
1. data-element [wrapper]
2. src

Inline styles
1. border-style
2. border-color
3. border-width
4. border-radius
5. margin
6. padding
7. max-width

### video element

Attributes
1. data-element [video]
2. src

## Slider

```
<div data-element="main" class="pagebuilder-slider" data-role="slider" data-appearance="default" data-autoplay="false"
     data-autoplay-speed="4000" data-fade="false" data-show-arrows="false" data-show-dots="true" style="...">
```

Attributes
1. data-element [main]
2. data-role [slider]
3. data-appearance [default]
4. data-autoplay
5. data-autoplay-speed
6. data-fade
7. data-infinite-loop
8. data-show-arrows
9. data-show-dots
10. class

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
<div data-element="main" data-role="slide" data-slide-name="" data-appearance="poster" data-show-button="hover" data-show-overlay="always" style="...">
    <a data-element="link" href="" target="" data-link-type="default">
        <div data-element="wrapper" class="pagebuilder-slide-wrapper" style="..." data-background-images="{}">
            <div data-element="overlay" class="pagebuilder-overlay pagebuilder-poster-overlay" data-overlay-color="rgba(255,255,255,0.5)" style="">
                <div class="pagebuilder-poster-content">
                    <div data-element="content">Content</div>
                    <button data-element="button" type="button" class="pagebuilder-slide-button pagebuilder-button-primary" style="">Button Text</button>
                </div>
            </div>
        </div>
    </a>
</div>
```

Collage Left

```
<div data-element="main" data-role="slide" data-slide-name="" data-appearance="collage-left" data-show-button="hover" data-show-overlay="always" style="...">
    <a data-element="link" href="" target="" data-link-type="default">
        <div data-element="wrapper" class="pagebuilder-slide-wrapper" style="..." data-background-images="{}">
            <div data-element="overlay" class="pagebuilder-overlay" data-overlay-color="rgba(255,255,255,0.5)" style="">
                <div class="pagebuilder-collage-content">
                    <div data-element="content">Content</div>
                    <button data-element="button" type="button" class="pagebuilder-slide-button pagebuilder-button-primary" style="">Button Text</button>
                </div>
            </div>
        </div>
    </a>
</div>
```

Collage Centered

```
<div data-element="main" data-role="slide" data-slide-name="" data-appearance="collage-centered" data-show-button="hover" data-show-overlay="always" style="...">
    <a data-element="link" href="" target="" data-link-type="default">
        <div data-element="wrapper" class="pagebuilder-slide-wrapper" style="..." data-background-images="{}">
            <div data-element="overlay" class="pagebuilder-overlay" data-overlay-color="rgba(255,255,255,0.5)" style="">
                <div class="pagebuilder-collage-content">
                    <div data-element="content">Content</div>
                    <button data-element="button" type="button" class="pagebuilder-slide-button pagebuilder-button-primary" style="">Button Text</button>
                </div>
            </div>
        </div>
    </a>
</div>
```

Collage Right

```
<div data-element="main" data-role="slide" data-slide-name="" data-appearance="collage-right" data-show-button="hover" data-show-overlay="always" style="...">
    <a data-element="link" href="" target="" data-link-type="default">
        <div data-element="wrapper" class="pagebuilder-slide-wrapper" style="..." data-background-images="{}">
            <div data-element="overlay" class="pagebuilder-overlay" data-overlay-color="rgba(255,255,255,0.5)" style="">
                <div class="pagebuilder-collage-content">
                    <div data-element="content">Content</div>
                    <button data-element="button" type="button" class="pagebuilder-slide-button pagebuilder-button-primary" style="">Button Text</button>
                </div>
            </div>
        </div>
    </a>
</div>
```

### main element

Attributes
1. data-element [main]
2. data-role [slide]
3. data-slide-name
4. data-appearance [poster, collage-left, collage-centered, collage-right]
5. data-show-button
6. data-show-overlay

Inline styles
1. border-style
2. border-color
3. border-width
4. border-radius

### link element

Attributes
1. data-element [link]
2. href
3. target
4. data-link-type

### wrapper element
Attributes
1. data-background-images `{"desktop_image":"{{media url}}","mobile_image":"{{media url}}"}`

Inline Styles
1. background-color
2. background-image
3. background-position
4. background-size
5. background-repeat
6. border-style
7. border-color
8. border-width
9. border-radius
10. padding
12. min-height
13. text-align

### overlay element

Attributes
1. data-element [overlay]
2. data-overlay-color

Inline styles
1. background-color

### content element

Attributes
1. data-element [content]

HTML content.

### button element

Attributes
1. data-element [button]
2. class

Inline styles
1. opacity
2. visibility

HTML content.

## Banner

Poster

```
<div data-element="main" data-role="banner" data-appearance="poster" data-overlay-color="rgb(0, 0, 0)" data-appearance="poster" style="...">
    <a data-element="link" href="" target="">
        <div data-element="wrapper" data-background-images="{}" class="wrapper">
            <div data-element="overlay" style="" class="overlay">
                <div class="content">
                    <div data-element="content">Content</div>
                    <button data-element="button" type="button" style="" class="action primary" >Button Text</button>
                </div>
            </div>
        </div>
    </a>
</div>
```

Collage Left

```
<div data-element="main" data-role="banner" data-appearance="collage-left" data-overlay-color="rgb(0, 0, 0)" data-appearance="collage-left" style="" class="pagebuilder-banner">
    <a data-element="link" href="" target="">
        <div data-element="wrapper" data-background-images="{}" style="" class="wrapper">
            <div data-element="overlay" style="" class="overlay>
                <div class="content">
                    <div data-element="content">Banner content</div>
                    <button data-element="button" style="" class="action primary">Banner Text</button>
                </div>
            </div>
        </div>
    </a>
</div>
```

Collage Centered

```
<div data-element="main" data-role="banner" data-appearance="collage-centered" data-overlay-color="rgb(0, 0, 0)" data-appearance="collage-center" style="" class="pagebuilder-banner">
    <a data-element="link" href="" target="">
        <div data-element="wrapper" data-background-images="{}" style="" class="wrapper">
            <div data-element="overlay" class="overlay">
                <div class="content">
                    <div data-element="content">Button content</div>
                    <button data-element="button" style="" class="action primary">Button Text</button>
                </div>
            </div>
        </div>
    </a>
</div>
```
Collage Right

```
<div data-element="main" data-role="banner" data-appearance="collage-right" data-overlay-color="rgb(0, 0, 0)" data-appearance="collage-right" style="" class="pagebuilder-banner">
    <a data-element="link" href="" target="">
        <div data-element="wrapper" data-background-images="{}" style="" class="wrapper">
            <div data-element="overlay" style="" class="overlay">
                <div class="content">
                    <div data-element="content" data-bind="html: getContentHtml()"></div>
                    <button data-element="button" style="" class="action primary">Button Text</button>
                </div>
            </div>
        </div>
    </a>
</div>
```

### main element

Attributes
1. data-element [main]
2. data-role [banner]
3. data-appearance [poster, collage-left, collage-centered, collage-right]
4. data-show-button
5. data-show-overlay
6. class

Inline styles
1. border-style
2. border-color
3. border-width
4. border-radius
5. margin

### link element

Attributes
1. data-element [link]
2. data-role
3. data-appearance
4. href
5. target
6. data-link-type

### wrapper element

Attributes
1. data-background-images `{"desktop_image":"{{media url}}","mobile_image":"{{media url}}"}`

Inline Styles
1. background-color
2. background-image
3. background-position
4. background-size
5. background-repeat
6. background-attachment
7. padding
8. min-height
9. text-align

### overlay element

Attributes
1. data-element [overlay]
2. data-overlay-color

Inline styles
1. background-color

### content element

Attributes
1. data-element [content]

HTML content.

### button element

Attributes
1. data-element [button]
2. class

Inline styles
1. opacity
2. visibility

HTML content.

## Map

```
<div data-element="main" data-role="map" data-appearance="default" data-show-controls="true" data-locations=<locations-json-format> style="..."></div>
```

Attributes
1. data-element [main]
2. data-role [map]
3. data-appearance [default]
4. data-show-controls
5. data-locations
6. class

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

### Example of locations json format
**Note:**
*The locations attribute needs to be turned into a string using `JSON.stringify()` before storing it to the database.
``` json
[
    {
        "position": {
            "latitude": 30.243475338635417,
            "longitude": -97.73760683593753
        },
        "location_name": "Location Name 1",
        "phone": "512-111-1111",
        "address": "11501 Domain Dr #150",
        "city": "Austin",
        "state": "TX",
        "zipcode": "78758",
        "country": "United States",
        "comment": "Comment 1",
        "record_id": 0
    },
    {
        "position": {
            "latitude": 29.404737046411704,
            "longitude": -98.48467714843753
        },
        "location_name": "Location Name 2",
        "phone": "512-222-2222",
        "address": "849 E Commerce St",
        "city": "San Antonio",
        "zipcode": "78205",
        "country": "United States",
        "comment": "Comment 2",
        "record_id": 1
    }
]
```

## Block

```
<div data-elment="main" data-role="block" data-appearance="default">{{widget type="Magento\Cms\Block\Widget\Block" template="widget/static_block/default.phtml" block_id="123" type_name="CMS Static Block"}}</div>
```

Attributes
1. data-element [main]
2. data-role [block]
3. data-appearance [default]
4. class

Inline styles
1. text-align
2. border-style
3. border-color
4. border-width
5. border-radius
6. margin
7. padding

## Dynamic Block

```
<div data-role="dynamic_block" data-appearance="default">{{widget type="Magento\Banner\Block\Widget\Banner" display_mode="fixed" rotate="" template="widget/block.phtml" banner_ids="54" unique_id="54" type_name="Dynamic Blocks Rotator"}}</div>
```

Attributes
1. data-role [dynamic_block]
2. data-appearance [default]

Inline styles
1. text-align
2. border
3. border_color
4. border_width
5. border_radius
6. margins
7. padding

## Products

```
<div data-element="main" data-role="products" data-appearance="grid">{{widget type="Magento\CatalogWidget\Block\Product\ProductsList" template="Magento_CatalogWidget::product/widget/content/grid.phtml" anchor_text="" id_path="" show_pager="0" products_count="5" type_name="Catalog Products List" conditions_encoded=""}}</div>
```

Attributes
1. data-element [main]
2. data-role [products]
3. data-appearance [grid]

Inline styles
1. text-align
2. border-style
3. border-color
4. border-width
5. border-radius
6. margin
7. padding

<!-- {% endraw %} -->