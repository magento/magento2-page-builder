# Add custom logic to content types

<!--{% comment %}-->
## Navigation

1. [Introduction]
2. [Installation guide]
3. [Contribution guide]
4. [Developer documentation]
    1. [Architecture overview]
    1. [BlueFoot to PageBuilder data migration]
    1. [Third-party content type migration]
    1. [Iconography]
    1. [Add image uploader to content type]
    1. [Module integration]
    1. [Additional data configuration]
    1. [Content type configuration]
    1. [How to add a new content type]
    1. [Events]
    1. [Bindings]
    1. [Master format]
    1. [Visual select] 
    1. [Reuse product conditions in content types]
    1. [Store component master format as widget directive]
    1. [Use the block chooser UI component]
    1. [Use the inline text editing component]
    1. [Render a backend content type preview]
    1. [Custom Toolbar]
    1. [Full width page layouts]
    1. **Add custom logic to content types**
5. [Roadmap and known issues]
6. [How to create custom PageBuilder content type container]

[Introduction]: introduction.md
[Contribution guide]: ../CONTRIBUTING.md
[Installation guide]: install.md
[Developer documentation]: developer-documentation.md
[Architecture overview]: architecture-overview.md
[BlueFoot to PageBuilder data migration]: bluefoot-data-migration.md
[Third-party content type migration]: new-content-type-example.md
[Iconography]: iconography.md
[Add image uploader to content type]: image-uploader.md
[Module integration]: module-integration.md
[Additional data configuration]: custom-configuration.md
[Content type configuration]: content-type-configuration.md
[How to add a new content type]: how-to-add-new-content-type.md
[Events]: events.md
[Bindings]: bindings.md
[Master format]: master-format.md
[Visual select]: visual-select.md
[Reuse product conditions in content types]: product-conditions.md
[Store component master format as widget directive]: widget-directive.md
[Use the block chooser UI component]: block-chooser-component.md
[Use the inline text editing component]: inline-editing-component.md
[Render a backend content type preview]: content-type-preview.md
[Custom Toolbar]: toolbar.md
[Full width page layouts]: full-width-page-layouts.md
[Add custom logic to content types]: add-custom-logic.md
[Roadmap and Known Issues]: roadmap.md
[How to create custom PageBuilder content type container]: how-to-create-custom-content-type-container.md
<!--{% endcomment %}-->

<!-- {% raw %} -->
You can customize PageBuilder content types by adding your own logic on the frontend.

To add custom logic to content types:
1. [Create a JavaScript widget](#create-a-javascript-widget).
2. [Add XML configuration to load it on the frontend](#add-xml-configuration-to-load-it-on-the-frontend).

### Create a JavaScript widget

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

### Add XML configuration to load it on the frontend

Add XML configuration to load it on the frontend, and on the stage, so that you can preview content inside both the block and dynamic block content types.

Add the following configuration to the `etc/di.xml` file in your custom module directory:

``` xml
<type name="Magento\PageBuilder\Model\Config\ContentType\WidgetInitializer">
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

<!-- {% endraw %} -->