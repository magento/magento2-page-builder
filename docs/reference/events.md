# Events

This document contains reference information for events dispatched in Page Builder.

**Note:**
*We are revising naming conventions for events, naming may change.*

## Events list {#eventslist}

- [Events](#events)
    - [Events list {#eventslist}](#events-list-eventslist)
    - [`contentType:*` events](#contenttype-events)
        - [`contentType:createAfter`](#contenttypecreateafter)
        - [`contentType:mountAfter`](#contenttypemountafter)
        - [`contentType:dropAfter`](#contenttypedropafter)
        - [`contentType:mountAfter`](#contenttypemountafter-1)
        - [`contentType:renderAfter`](#contenttyperenderafter)
        - [`contentType:removeAfter`](#contenttyperemoveafter)
        - [`contentType:duplicateAfter`](#contenttypeduplicateafter)
        - [`contentType:moveBefore`](#contenttypemovebefore)
        - [`contentType:moveAfter`](#contenttypemoveafter)
        - [`contentType:redrawAfter`](#contenttyperedrawafter)
            - [Backend](#backend)
            - [Frontend](#frontend)
        - [`column:dragStart`](#columndragstart)
        - [`column:dragStop`](#columndragstop)
        - [`column:initializeAfter`](#columninitializeafter)
        - [`image:{{id}}:assignAfter`](#imageidassignafter)
        - [`image:mountAfter`](#imagemountafter)
        - [`image:uploadAfter`](#imageuploadafter)
        - [`stage:interactionStart`](#stageinteractionstart)
        - [`stage:interactionStop`](#stageinteractionstop)
        - [`stage:{{id}}:toggleFullscreen`](#stageidtogglefullscreen)
        - [`previewData:updateAfter`](#previewdataupdateafter)
        - [`previewSortable:sortstart`](#previewsortablesortstart)
        - [`previewSortable:sortupdate`](#previewsortablesortupdate)
        - [`stage:error`](#stageerror)
        - [`stage:{{id}}:readyAfter`](#stageidreadyafter)
        - [`stage:{{id}}:masterFormatRenderAfter`](#stageidmasterformatrenderafter)
        - [`stage:updateAfter`](#stageupdateafter)
        - [`stage:childFocusStart`](#stagechildfocusstart)
        - [`stage:childFocusStop`](#stagechildfocusstop)
        - [`state`](#state)
        - [`{{config.name}}:{{id}}:updateAfter`](#confignameidupdateafter)
    - [`googleMaps:authFailure`](#googlemapsauthfailure)

## `contentType:*` events
All events starting with `contentType:` can also be called for specific content types by prefixing the content types name (`{{name}}:{{event}}`) like the following:
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

### `image:{{id}}:assignAfter`

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

### `stage:{{id}}:toggleFullscreen`

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

### `stage:{{id}}:readyAfter`

**Triggers**

* `Stage::ready`
* `stage instance`

### `stage:{{id}}:masterFormatRenderAfter`

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

### `{{config.name}}:{{id}}:updateAfter`

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
