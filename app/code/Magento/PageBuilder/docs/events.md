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

This document contains reference information for events dispatched in Page Builder.

**Note:**
*We are revising naming conventions for events, naming may change.*

## Events list

* [contentType:create](#contenttypecreate)
* [contentType:createAfter](#contenttypecreateafter)
* [contentType:mountAfter](#contenttypemountafter)
* [contentType:afterRender](#contenttypeafterrender)
* [contentType:removeAfter](#contenttyperemoved)
* [contentType:duplicateAfter](#contenttypeduplicate)
* [contentType:beforeMove](#contenttypebeforemove)
* [contentType:moveAfter](#contenttypemoveafter)
* [column:dragStart](#columdragstart)
* [column:dragStop](#columndragstop)
* [column:initElementAfter](#columninitelementafter)
* [image:{{id}}:assignAfter](#imageidassignafter)
* [image:mountAfter](#imagemountafter)
* [image:uploadAfter](#imageuploadafter)
* [stage:interactionStart](#stageinteractionstart)
* [stage:interactionStop](#stageinteractionstop)
* [stage:toggleFullscreen:{{id}}](#stagetogglefullscreenid)
* [previewData:updateAfter](#previewdataupdateafter)
* [previewSortable:sortstart](#previewsortablesortstart)
* [previewSortable:sortupdate](#previewsortablesortupdate)
* [stage:error](#stageerror)
* [stage:{{id}}:readyAfter](#stageidreadyafter)
* [stage:{{id}}:masterFormatRenderAfter](#stageidmasterformatrenderafter)
* [stage:updateAfter](#stageupdateafter)
* [state](#state)
* [{{config.name}}:{{id}}:updateAfter](#confignameidupdateafter)
* [googleMaps:authFailure](#googlemapsauthFailure)

## `contentType:*` events
All events starting with `contentType:` can also be called for specific content types by prefixing the content types name (`{{name}}:contentType:{{event}}`) like the following:
* `text:contentType:create`
* `row:mountAfter`
* `tab-item:contentType:mountAfter`

### `contentType:create`

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
}
```

[Back to top]

### `contentType:createAfter`

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

### `contentType:afterRender`

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
}
```

[Back to top]

### `contentType:beforeMove`

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

### `column:initElementAfter`

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

### `stage:toggleFullscreen:{{id}}`

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

[Back to top]: #events
