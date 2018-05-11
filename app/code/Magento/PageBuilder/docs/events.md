# Events

This document describes events dispatched in PageBuilder and parameters.

**Note:**
*We are revising naming conventions for events, naming may change.*

* [block:dropped](#blockdropped)
* [block:dropped:create](#blockdroppedcreate)
* [block:instanceDropped](#blockinstancedropped)
* [block:mount](#block:mount)
* [block:moved](#block:moved)
* [block:removed](#block:removed)
* [block:sorted](#block:sorted)
* [block:sortStart](#block:sortStart)
* [block:sortStart](#block:sortStart)
* [buttons:block:dropped:create](#buttons:block:dropped:create)
* [colum:drag:start](#colum:drag:start)
* [colum:drag:start](#colum:drag:start)
* [drag:start](#drag:start)
* [column:drag:stop](#column:drag:stop)
* [column:initElement](#column:initElement)
* [drag:start](#drag:start)
* [drag:stop](#drag:stop)
* [form:render](#form:render)
* [form:save](#form:save)
* [image:assigned:{{id}}](#image:assigned:{{id}})
* [image:block:ready](#image:block:ready)
* [image:uploaded](#image:uploaded)
* [interaction:start](#interaction:start)
* [interaction:stop](#interaction:stop)
* [pagebuilder:toggleFullScreen:{{id}}](#pagebuilder:toggleFullScreen:{{id}})
* [previewObservables:updated](#previewObservables:updated)
* [previewSortable:sortstart](#previewSortable:sortstart)
* [previewSortable:sortupdate](#previewSortable:sortupdate)
* [row:block:ready](#row:block:ready)
* [slide:block:create](#slide:block:create)
* [slider:block:dropped:create](#slider:block:dropped:create)
* [slide:block:duplicate](#slide:block:duplicate)
* [slide:block:mount](#slide:block:mount)
* [slide:block:removed](#slide:block:removed)
* [slider:block:ready](#slider:block:ready)
* [stage:error](#stage:error)
* [stage:ready:{{id}}](#stage:ready:{{id}})
* [stage:renderTrree:{{id}}](#stage:renderTrree:{{id}})
* [stage:updated](#stage:updated)
* [state](#state)
* [tab-item:block:duplicate](#tab-item:block:duplicate)
* [tab-item:block:mount](#tab-item:block:mount)
* [tab-item:block:removed](#tab-item:block:removed)
* [tabs:block:dropped:create](#tabs:block:dropped:create)
* [tabs:block:ready](#tabs:block:ready)
* [{{id}}:updated](#{{id}}:updated)

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
    column: ContentTypeInterface;
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
    column,
    handle,
    parent
}
```

[Back to top]

## `column:drag:stop`

**Triggers**

* `ColumnGroup.Preview::stop`

**Params**

``` js
{
    column,
    stageId
}
```

[Back to top]

## `column:initElement`

**Triggers**

* `Column.Preview::initColumn`

**Params**

``` js
{
    column,
    element,
    parent
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

``` js
```

## `image:block:ready`

**Triggers**

* `ContentTypeFactory::fireBlockReadyEvent`

**Params**

``` js
```

[Back to top]

## `image:uploaded`

**Triggers**

* `ImageUploader::addFile`

**Params**

``` js
{
    callback: (files: object [ ] ) => any
}
```

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
* `ContentTypeMountEventParamsInterface`

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
* `ContentTypeCreateEventParamsInterface`

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
* `ContentTypeReadyEventParamsInterface`

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
* `ContentTypeMountEventParamsInterface`

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
* `ContentTypeReadyEventParamsInterface`

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

``` js
```

[Back to top]

## `stage:ready:{{id}}`

**Triggers**

* `Stage::ready`
* `stage instance`

## `stage:renderTrree:{{id}}`

**Triggers**

* `Stage`

**Params**

``` js
{
    value
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
    stageId
}
```

[Back to top]

## `state`

**Triggers**

* `DataStore::emitState`

**Params**

``` js
{
    state
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
    original: originalBlock,
    duplicateBlock,
    index,
}
```

[Back to top]

## `tab-item:block:mount`

**Triggers**

* `ContentTypeCollection::addChild`
* `Column.Preview::fireMountEvent`
* `ContentTypeMountEventParamsInterface`

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
* `ContentTypeReadyEventParamsInterface`

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
* `ContentTypeReadyEventParamsInterface`

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

[Back to top]: #events
