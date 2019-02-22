# Storefront customization

You can customize Page Builder content types by adding your own logic on the frontend, as described here.

## Step 1: Create a JavaScript widget

Create a JavaScript widget in your module's `/view/frontend/web/js/content-type/{content-type-name}/appearance/{appearance-name}/widget.js` file:

``` javascript
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'slick'
], function ($) {
    'use strict';

    return function (config, sliderElement) {

        var $element = $(sliderElement);

        /**
         * Prevent each slick slider from being initialized more than once which could throw an error.
         */
        if ($element.hasClass('slick-initialized')) {
            $element.slick('unslick');
        }

        $element.slick({
            autoplay: $element.data('autoplay') === 1,
            autoplaySpeed: $element.data('autoplay-speed') || 0,
            fade: $element.data('fade') === 1,
            infinite: $element.data('is-infinite') === 1,
            arrows: $element.data('show-arrows') === 1,
            dots: $element.data('show-dots') === 1
        });
    };
});

```

## Step 2: Add XML configuration

The XML configuration loads the widget on the frontend, and on the stage, so that you can preview content inside both the block and dynamic block content types.

Add the following configuration to the `etc/di.xml` file in your custom module directory:

``` xml
<type name="Magento\PageBuilder\Model\WidgetInitializerConfig">
    <arguments>
        <argument name="config" xsi:type="array">
            <item name="%content-type-name%" xsi:type="array">
                <!-- Name is the appearance name -->
                <item name="default" xsi:type="array">
                    <!--required argument-->
                    <item name="component" xsi:type="string">%{vendor-path}/js/content-type/{content-type-name}/appearance/{appearance-name}/widget%</item>
                    <!--optional if you need provide some config for your widget-->
                    <item name="config" xsi:type="array">
                        <item name="buttonSelector" xsi:type="string">.pagebuilder-slide-button</item>
                        <item name="showOverlay" xsi:type="string">hover</item>
                    </item>
                    <!--optional if you want load widget per appearance-->
                    <item name="appearance" xsi:type="string">default</item>
                </item>
            </item>
        </argument>
    </arguments>
</type>
```