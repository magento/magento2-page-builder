# Events

## Navigation

1. **Introduction**
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
    1. **Events**
    1. [Master format]
    1. [Visual select]
    1. [Reuse product conditions in content types]
    1. [Store component master format as widget directive]
    1. [Custom Toolbar]
5. [Roadmap and known issues]

[Introduction]: README.md
[Contribution guide]: CONTRIBUTING.md
[Installation Guide]: install.md
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

This document contains reference information for events dispatched in PageBuilder.

**Note:**
*We are revising naming conventions for events, naming may change.*

## Events list

* [block:dropped](#blockdropped)
* [block:dropped:create](#blockdroppedcreate)
* [block:instanceDropped](#blockinstancedropped)
* [block:mount](#blockmount)
* [block:moved](#blockmoved)
* [block:removed](#blockremoved)
* [block:sorted](#blocksorted)
* [block:sortStart](#blocksortstart)
* [block:sortStart](#blocksortstart)
* [buttons:block:dropped:create](#buttonsblockdroppedcreate)
* [colum:drag:start](#columdragstart)
* [colum:drag:start](#columdragstart)
* [drag:start](#dragstart)
* [column:drag:stop](#columndragstop)
* [column:initElement](#columninitelement)
* [drag:start](#dragstart)
* [drag:stop](#dragstop)
* [form:render](#formrender)
* [form:save](#formsave)
* [image:assigned:{{id}}](#imageassignedid)
* [image:block:ready](#imageblockready)
* [image:uploaded](#imageuploaded)
* [interaction:start](#interactionstart)
* [interaction:stop](#interactionstop)
* [pagebuilder:toggleFullScreen:{{id}}](#pagebuildertogglefullscreenid)
* [previewObservables:updated](#previewobservablesupdated)
* [previewSortable:sortstart](#previewsortablesortstart)
* [previewSortable:sortupdate](#previewsortablesortupdate)
* [row:block:ready](#rowblockready)
* [slide:block:create](#slideblockcreate)
* [slider:block:dropped:create](#sliderblockdroppedcreate)
* [slide:block:duplicate](#slideblockduplicate)
* [slide:block:mount](#slideblockmount)
* [slide:block:removed](#slideblockremoved)
* [slider:block:ready](#sliderblockready)
* [stage:error](#stageerror)
* [stage:ready:{{id}}](#stagereadyid)
* [stage:renderTree:{{id}}](#stagerendertreeid)
* [stage:updated](#stageupdated)
* [state](#state)
* [tab-item:block:duplicate](#tab-itemblockduplicate)
* [tab-item:block:mount](#tab-itemblockmount)
* [tab-item:block:removed](#tab-itemblockremoved)
* [tabs:block:dropped:create](#tabsblockdroppedcreate)
* [tabs:block:ready](#tabsblockready)
* [{{id}}:updated](#idupdated)
* [googleMaps:authFailure](#googlemapsauthFailure)

## `block:dropped`

**Triggers**

* `ko-sortable::onSortReceive`

**Params**

``` js
{
    parent: ContentTypeInterface;
    index: number;
    block: {
        config: ContentTypeConfigInterface,
    };
    stageId: string;
}
```

[Back to top]

## `block:dropped:create`

**Triggers**

* `Stage::onBlockDropped`


**Params**

``` js
{
    id: string;
    block: ContentTypeInterface;
}
```

[Back to top]

## `block:instanceDropped`

**Triggers**

* `ko-sortable::onSortUpdate`
* `ColumnGroup.Preview::onExistingColumnDrop`

**Params**

``` js
{
    parent: ContentTypeInterface;
    blockInstance: ContentTypeInterface;
    index?: number;
    stageId: string;
}
```

[Back to top]

## `block:mount`

**Triggers**

* `ContentTypeCollection::addChild`
* `Column.Preview::fireMountEvent`

**Params**

``` js
{
    id: string;
    block: ContentTypeInterface;
}
```

[Back to top]

## `block:moved`

**Triggers**

* `Stage::onBlockInstanceDropped`

**Params**

``` js
{
    block: ContentTypeInterface,
    index: number,
    newParent: ContentTypeInterface,
    originalParent: ContentTypeInterface
}
```

## `block:removed`

**Triggers**

* `Preview::onOptionRemove`

**Params**

``` js
{
    parent: ContentTypeInterface;
    index: number;
    block: ContentTypeInterface;
    stageId: string;
}
```

## `block:sorted`

**Triggers**

* `ko-sortable::onSortUpdate`

**Params**

``` js
{
    parent: ContentTypeInterface;
    block: ContentTypeInterface;
    index: number;
    stageId: string;
}
```

[Back to top]

## `block:sortStart`

**Triggers**

* `ko-sortable::onSortStart`

**Params**

``` js
{
    block: ContentTypeInterface;
    event: Event;
    originalEle: JQuery;
    placeholder: JQuery;
    helper?: any;
    stageId: string;
}
```

[Back to top]

## `block:sortStop`

**Triggers**

* `ko-sortable::onSortStop`

**Params**

``` js
{
    block: ContentTypeInterface;
    event: Event;
    originalEle: JQuery;
    placeholder: JQuery;
    helper?: any;
    stageId: string;
}
```

[Back to top]

## `buttons:block:dropped:create`

**Triggers**

* `Stage::onBlockDropped`

**Params**

``` js
{
    id: string;
    block: ContentTypeInterface;
}
```

[Back to top]

## `colum:drag:start`

**Triggers**

* `ColumnGroup.Preview::start`

**Params**

``` js
{
    column: ContentTypeInterface;
    stageId: string;
}
```

[Back to top]

## `colum:drag:start`

**Triggers**

* `ColumnGroup.Preview::start`

**Params**

``` js
{
    column: Column;
    stageId: string;
}
```

## `drag:start`

**Triggers**

* `column:bindResizeHandle`
* `Column.Preview::bindResizeHandle`

**Params**

``` js
{
    column: Column,
    handle,
    parent: ColumnGroup
}
```

[Back to top]

## `column:drag:stop`

**Triggers**

* `ColumnGroup.Preview::stop`

**Params**

``` js
{
    column: Column,
    stageId: string
}
```

[Back to top]

## `column:initElement`

**Triggers**

* `Column.Preview::initColumn`

**Params**

``` js
{
    column: Column,
    element,
    parent: ColumnGroup
}
```

[Back to top]

## `drag:start`

**Triggers**

* `ko-draggable::init`

**Params**

``` js
{
    event,
    ui,
    component
}
```

[Back to top]

## `drag:stop`

**Triggers**

* `ko-draggable::init`

**Params**

``` js
{
    event,
    ui,
    component
}
```

[Back to top]

## `form:render`

**Triggers**

* `Edit::open`

**Params**

``` js
{
    data,
    appearances,
    defaultNamespace,
    id,
    namespace,
    title
}
```

[Back to top]

## `form:save`

**Triggers**

* `Provider::save`

**Params**

``` js
```

[Back to top]

## `image:assigned:{{id}}`

**Triggers**

* `Image.Preview::bindEvents`

**Params**

object

## `image:block:ready`

**Triggers**

* `ContentTypeFactory::fireBlockReadyEvent`

**Params**

Function

[Back to top]

## `image:uploaded`

**Triggers**

* `ImageUploader::addFile`

**Params**

Function

[Back to top]

## `interaction:start`

**Triggers**

* `ko-draggable::init`
* `Tabs.Preview::constructor`
* `Slider.Preview::constructor`
* `ColumnGroup.Preview::registerResizeHandle`
* `ColumnGroup.Preview::start`

**Params**

``` js
```

[Back to top]

## `interaction:stop`

**Triggers**

* `ko-draggable::init`
* `Tabs.Preview::constructor`
* `Tabs.Preview::setFocusedTab`
* `Slider.Preview::constructor`
* `ColumnGroup.Preview::endAllInteractions`
* `ColumnGroup.Preview::stop`

**Params**

``` js
```

[Back to top]

## `pagebuilder:toggleFullScreen:{{id}}`

**Triggers**

* `Panel::fullScreen`
* `Wysiwyg::toggleFullScreen`

**Params**

``` js
```

[Back to top]

## `previewObservables:updated`

**Triggers**

* `Preview::updateObservables`

**Params**

``` js
{
    preview
}
```

[Back to top]

## `previewSortable:sortstart`

**Triggers**

* `PreviewSortable::init`

**Params**

``` js
{
    instance,
    originalPosition,
    ui
}
```

[Back to top]

## `previewSortable:sortupdate`

**Triggers**

* `PreviewSortable::init`
* `PreviewSortableSortUpdateEventParams`

**Params**

``` js
{
    instance: ContentTypeInterface;
    newPosition: number;
    originalPosition: number;
    ui: JQueryUI.SortableUIParams;
}
```

## `row:block:ready`

**Triggers**

* `ContentTypeFactory::fireBlockReadyEvent`

**Params**

``` js
{
    id: string;
    block: ContentTypeInterface;
}
```

[Back to top]

## `slide:block:create`

**Triggers**

* `ContentTypeFactory::createContentType`

**Params**

``` js
{
    id: string;
    block: ContentTypeInterface;
}
```

## `slider:block:dropped:create`

**Triggers**

* `Stage::onBlockDropped`

**Params**

``` js
{
    id: string;
    block: ContentTypeInterface;
}
```

[Back to top]

## `slide:block:duplicate`

**Triggers**

* `Preview::dispatchContentTypeCloneEvents`
* `ContentTypeDuplicateEventParams`

**Params**

``` js
{
    original: originalBlock,
    duplicateBlock,
    index,
}
```

[Back to top]

## `slide:block:mount`

**Triggers**

* `ContentTypeCollection::addChild`
* `Column.Preview::fireMountEvent`

**Params**

``` js
{
    id: string;
    block: ContentTypeInterface;
}
```

[Back to top]

## `slide:block:removed`

**Triggers**

* `Preview::onOptionRemove`
* `BlockRemovedParams`

**Params**

``` js
{
    parent: ColumnGroup;
    block: Column;
    index: number;
}
```

[Back to top]

## `slider:block:ready`

**Triggers**

* `ContentTypeFactory::fireBlockReadyEvent`

**Params**

``` js
{
    id: string;
    block: ContentTypeInterface;
}
```

[Back to top]

## `stage:error`

**Triggers**

* `Stage::build`

**Params**

Error

[Back to top]

## `stage:ready:{{id}}`

**Triggers**

* `Stage::ready`
* `stage instance`

## `stage:renderTree:{{id}}`

**Triggers**

* `Stage`

**Params**

``` js
{
    value: string
}
```

[Back to top]

## `stage:updated`

**Triggers**

* `Stage::initListeners`
* `ContentTypeCollection::constructor`

**Params**

``` js
{
    stageId: number
}
```

[Back to top]

## `state`

**Triggers**

* `DataStore::emitState`

**Params**

``` js
{
    state: DataObject
}
```

[Back to top]

## `tab-item:block:duplicate`

**Triggers**

* `Preview::dispatchContentTypeCloneEvents`
* `ContentTypeDuplicateEventParams`

**Params**

``` js
{
    original: ContentTypeInterface,
    duplicateBlock: ContentTypeInterface,
    index: number,
}
```

[Back to top]

## `tab-item:block:mount`

**Triggers**

* `ContentTypeCollection::addChild`
* `Column.Preview::fireMountEvent`

**Params**

``` js
{
    id: string;
    block: ContentTypeInterface;
}
```

[Back to top]

## `tab-item:block:removed`

**Triggers**

* `Preview::onOptionRemove`
* `BlockRemovedParams`

**Params**

``` js
{
    parent: ContentTypeInterface;
    index: number;
    block: ContentTypeInterface;
    stageId: string;
}
```

[Back to top]

## `tabs:block:dropped:create`

**Triggers**

* `Stage::onBlockDropped`

**Params**

``` js
{
    id: string;
    block: ContentTypeInterface;
}
```

[Back to top]

## `tabs:block:ready`

**Triggers**

* `ContentTypeFactory::fireBlockReadyEvent`

**Params**

``` js
{
    id: string;
    block: ContentTypeInterface;
}
```

[Back to top]

## `{{id}}:updated`

**Triggers**

* `ContentType::bindEvents`

**Params**

``` js
{
    eventName: string,
    paramObj: [key: string]: Stage
}
```

[Back to top]

## `googleMaps:authFailure`

**Triggers**

* `window.gm_authFailure`

**Params**

_none_

[Back to top]

[Back to top]: #events
