# Full width page layouts

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
    1. [Bindings]
    1. [Master format]
    1. [Visual select]
    1. [Reuse product conditions in content types]
    1. [Store component master format as widget directive]
    1. [Custom Toolbar]
    1. [Add image uploader to content type]
    1. **Full width page layouts**
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
[Bindings]: bindings.md
[Master format]: master-format.md
[Visual select]: visual-select.md
[Reuse product conditions in content types]: product-conditions.md
[Store component master format as widget directive]: widget-directive.md
[Custom Toolbar]: toolbar.md
[Full width page layouts]: full-width-page-layouts.md
[Add image uploader to content type]: image-uploader.md
[Roadmap and Known Issues]: roadmap.md

## What's in this topic
This topic describes the new page layouts that are added within Page Builder, along with instructions on how they can be utilised within custom themes.

**Note:** these layouts were created with Luma in mind, they may not work as expected in your custom themes.

## New Page Layout defaults
By default Page Builder will set the defaults to the new respected layouts supplied by our Page Builder module. This results in any new pages being created with full width capabilities.

![Page Layout Defaults](images/default-full-width.png)

## CMS Full Width
We've added a new full width template for CMS pages, this simply takes the CMS pages content and removes the left and right gutters from the front-end. This is implemented within `cms-full-width.xml`. This extends from the `1column` page layout.

We do this by referencing the `main.content` container and replacing the `page-main` with our new `page-main-full-width`. 

```xml
<referenceContainer name="main.content" htmlTag="main" htmlClass="page-main-full-width" />
```

![CMS Full Width Layout](images/cms-full-width.png)

## Category Full Width
The category full width template takes the columns top section of the page and moves it out of the `main.content` section. This allows us to break out of the gutter to provide full width on just the description. This extends the `2columns-left` page layout. 

We do this by creating new wrapping containers in the root and then moving the image, description and CMS blocks out of the original columns top. We move description into a dedicated container to enable the full width capabilities.
```xml
<container name="columns.top.wrapper" htmlTag="div" htmlClass="page-main"/>
<move element="columns.top" destination="columns.top.wrapper"/>
<move element="columns.top.wrapper" destination="page.wrapper" after="page.top"/>
<move element="category.view.container" destination="page.wrapper" after="columns.top.wrapper"/>

<container name="category.image.wrapper" htmlTag="div" htmlClass="page-main"/>
<move element="category.image" destination="category.image.wrapper"/>
<move element="category.image.wrapper" destination="category.view.container"/>

<container name="category.description.wrapper" htmlTag="div"/>
<move element="category.description" destination="category.description.wrapper"/>
<move element="category.description.wrapper" destination="category.view.container" after="category.image.wrapper"/>

<container name="category.cms.wrapper" htmlTag="div" htmlClass="page-main"/>
<move element="category.cms" destination="category.cms.wrapper"/>
<move element="category.cms.wrapper" destination="category.view.container" after="category.description.wrapper"/>
```

![Category Full Width Layout](images/category-full-width.png)

## Product Full Width
The product full width template takes the description out of the tabs section and moves it just above the reviews tab. This extends the `1column` page layout.

We create a new wrapper for product details & descriptions. Product details wrapper is added after `main.content` but contains the necessary `page-main` class to have the gutters on the tabs. We then create a new wrapper for the description section without the gutter. Finally we move the original description and details blocks into these new wrappers.
```xml
<referenceContainer name="page.wrapper">
    <!-- Create new product details wrapper under main.content for tabs section -->
    <container name="product.info.details.wrapper" after="main.content" htmlTag="div" htmlClass="page-main page-main-details">
        <container name="product.info.details.wrapper.columns" htmlTag="div" htmlClass="columns">
            <container name="product.info.details.wrapper.main" label="Product Details Main Content Container" htmlTag="div" htmlClass="column main"/>
        </container>
    </container>
    <!-- Create wrapper for description without page-main class which adds gutters -->
    <container name="product.info.description.wrapper" after="main.content" before="product.info.details.wrapper" htmlTag="div" htmlClass="page-main-description" htmlId="description"/>
</referenceContainer>

<!-- Move details & description into their new wrappers -->
<move element="product.info.details" destination="product.info.details.wrapper.main"/>
<move element="product.info.description" destination="product.info.description.wrapper"/>
```

![Product Full Width Layout](images/product-full-width.png)

## Custom Theme Full Width
We cannot guarantee these full width layouts will work as expected with your custom themes as your pages structure may differ from Luma's.

To enable full width within your custom themes you'll need to ensure the appropriate block is not within your pages main wrapper with the gutters. This implementation will differ on a case by case basis but the above implementations for Luma should give you a good indication on how to approach these.
