# Page Builder Events

This document contains reference information for events dispatched in Page Builder.

## Events list




<!-- {% raw %} -->

## `contentType:*` events
Events starting with `contentType:` are triggered by every content type on the stage. can also be called for specific content types by prefixing the content types name (`{{name}}:{{event}}`) like the following:
* `text:createAfter`
* `row:mountAfter`
* `tab-item:mountAfter`

### `contentType:createAfter`

**Triggers**

* `createContentType`


**Params**

``` js
{
    id: string;
    contentType: ContentTypeInterface & ContentTypeCollectionInterface;
}
```

[Back to top]

### `contentType:mountAfter`

**Triggers**

* `createContentType`


**Params**

``` js
{
    id: string;
    contentType: ContentTypeInterface & ContentTypeCollectionInterface;
    expectedChildren: number;
}
```

[Back to top]

### `contentType:dropAfter`

**Triggers**

* `onSortReceive`


**Params**

``` js
{
    id: string;
    contentType: ContentTypeInterface & ContentTypeCollectionInterface;
}
```

[Back to top]

### `contentType:mountAfter`

**Triggers**

* `ContentTypeCollection::addChild`
* `Column.Preview::fireMountEvent`

**Params**

``` js
{
    id: string;
    contentType: ContentTypeInterface & ContentTypeCollectionInterface;
}
```

[Back to top]

### `contentType:renderAfter`

**Triggers**

* `Preview::dispatchAfterRenderEvent`

**Params**

``` js
{
    id: string;
    element: Element;
    contentType: ContentTypeInterface & ContentTypeCollectionInterface;
}
```

[Back to top]

### `contentType:removeAfter`

**Triggers**

* `Preview::onOptionRemove`

**Params**

``` js
{
    contentType: ContentTypeInterface & ContentTypeCollectionInterface;
    index: number;
    parent: ContentTypeCollectionInterface;
    stageId: string;
}
```

[Back to top]

### `contentType:duplicateAfter`

**Triggers**

* `Preview::dispatchContentTypeCloneEvents`

**Params**

``` js
{
    originalContentType: ContentTypeInterface & ContentTypeCollectionInterface;
    duplicateContentType: ContentTypeInterface & ContentTypeCollectionInterface;
    index: number;
    direct: boolean;
}
```

[Back to top]

### `contentType:moveBefore`

**Triggers**

* `moveContentType`

**Params**

``` js
{
    contentType: ContentTypeInterface & ContentTypeCollectionInterface;
    sourceParent: ContentTypeCollectionInterface;
    targetParent: ContentTypeCollectionInterface;
    targetIndex: number;
    stageId: string;
}
```

[Back to top]

### `contentType:moveAfter`

**Triggers**

* `moveContentType`

**Params**

``` js
{
    contentType: ContentTypeInterface & ContentTypeCollectionInterface;
    sourceParent: ContentTypeCollectionInterface;
    targetParent: ContentTypeCollectionInterface;
    targetIndex: number;
    stageId: string;
}
```

[Back to top]

### `contentType:redrawAfter`

#### Backend

**Triggers**

* `Tabs.Preview::onTabClick`

**Params**

``` js
{
    id: string,
    contentType: ContentTypeInterface & ContentTypeCollectionInterface
}
```

#### Frontend

**Triggers**

* `Tabs.widget.ui.tabs::activate`

**Params**

``` js
{
    element: HTMLElement
}
```

[Back to top]

### `column:dragStart`

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

### `column:dragStop`

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

### `column:initializeAfter`

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

### `image:{{id}}:assignAfter` {#imageidassignafter}

**Triggers**

* `Image.Preview::bindEvents`

**Params**

object

### `image:mountAfter`

**Triggers**

* `ContentTypeFactory::fireBlockReadyEvent`

**Params**

Function

[Back to top]

### `image:uploadAfter`

**Triggers**

* `ImageUploader::addFile`

**Params**

Function

[Back to top]

### `stage:{{preview.parent.stageId}}:readyAfter`

**Triggers**

* `Stage::ready`

**Params**

``` js
{
    stage: Stage
}
```

[Back to top]

### `stage:{{preview.parent.stageId}}:renderAfter`

**Triggers**

* `Stage::constructor`

**Params**

``` js
{
    stageId: number
}
```

[Back to top]

### `stage:interactionStart`

**Triggers**

* `Tabs.Preview::constructor`
* `Slider.Preview::constructor`
* `ColumnGroup.Preview::registerResizeHandle`
* `ColumnGroup.Preview::start`
* `drag-drop::onSortStart`

**Params**

``` js

```

[Back to top]

### `stage:interactionStop`

**Triggers**

* `Tabs.Preview::constructor`
* `Tabs.Preview::setFocusedTab`
* `Slider.Preview::constructor`
* `ColumnGroup.Preview::endAllInteractions`
* `ColumnGroup.Preview::stop`
* `drag-drop::onSortStop`

**Params**

``` js

```

[Back to top]

### `stage:{{preview.parent.stageId}}:toggleFullscreen` {#stageidtogglefullscreen}

**Triggers**

* `Panel::fullScreen`
* `Wysiwyg::toggleFullScreen`

**Params**

``` js

```

[Back to top]

### `previewData:updateAfter`

**Triggers**

* `Preview::updateObservables`

**Params**

``` js
{
    preview
}
```

[Back to top]

### `previewSortable:sortstart`

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

### `previewSortable:sortupdate`

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

[Back to top]

### `stage:error`

**Triggers**

* `Stage::build`

**Params**

Error

[Back to top]

### `stage:{{preview.parent.stageId}}:readyAfter` {#stageidreadyafter}

**Triggers**

* `Stage::ready`
* `stage instance`

### `stage:{{preview.parent.stageId}}:masterFormatRenderAfter` {#stageidmasterformatrenderafter}

**Triggers**

* `Stage`

**Params**

``` js
{
    value: string
}
```

[Back to top]

### `stage:updateAfter`

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

### `stage:childFocusStart`

[Back to top]

### `stage:childFocusStop`

[Back to top]

### `state`

**Triggers**

* `DataStore::emitState`

**Params**

``` js
{
    state: DataObject
}
```

[Back to top]

### `{{config.name}}:{{preview.parent.id}}:updateAfter` {#confignameidupdateafter}

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

[Back to top]: #eventslist
<!-- {% endraw %} -->