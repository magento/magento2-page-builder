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
    1. [Custom Toolbar]
    1. [Add image uploader to content type]
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
[Custom Toolbar]: toolbar.md
[Add image uploader to content type]: image-uploader.md
[Roadmap and Known Issues]: roadmap.md

This document contains reference information for events dispatched in PageBuilder.

**Note:**
*We are revising naming conventions for events, naming may change.*

## Events list

* [contentType:dropped](#contentTypedropped)
* [contentType:dropped:create](#contentTypedroppedcreate)
* [contentType:instanceDropped](#contentTypeinstancedropped)
* [contentType:mount](#contentTypemount)
* [contentType:moved](#contentTypemoved)
* [contentType:removed](#contentTyperemoved)
* [contentType:sorted](#contentTypesorted)
* [contentType:sortStart](#contentTypesortstart)
* [contentType:sortStart](#contentTypesortstart)
* [buttons:contentType:dropped:create](#buttonscontentTypedroppedcreate)
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
* [image:contentType:ready](#imagecontentTypeready)
* [image:uploaded](#imageuploaded)
* [interaction:start](#interactionstart)
* [interaction:stop](#interactionstop)
* [pagebuilder:toggleFullScreen:{{id}}](#pagebuildertogglefullscreenid)
* [previewObservables:updated](#previewobservablesupdated)
* [previewSortable:sortstart](#previewsortablesortstart)
* [previewSortable:sortupdate](#previewsortablesortupdate)
* [row:contentType:ready](#rowcontentTypeready)
* [slide:contentType:create](#slidecontentTypecreate)
* [slider:contentType:dropped:create](#slidercontentTypedroppedcreate)
* [slide:contentType:duplicate](#slidecontentTypeduplicate)
* [slide:contentType:mount](#slidecontentTypemount)
* [slide:contentType:removed](#slidecontentTyperemoved)
* [slider:contentType:ready](#slidercontentTypeready)
* [stage:error](#stageerror)
* [stage:ready:{{id}}](#stagereadyid)
* [stage:renderTree:{{id}}](#stagerendertreeid)
* [stage:updated](#stageupdated)
* [state](#state)
* [tab-item:contentType:duplicate](#tab-itemcontentTypeduplicate)
* [tab-item:contentType:mount](#tab-itemcontentTypemount)
* [tab-item:contentType:removed](#tab-itemcontentTyperemoved)
* [tabs:contentType:dropped:create](#tabscontentTypedroppedcreate)
* [tabs:contentType:ready](#tabscontentTypeready)
* [{{id}}:updated](#idupdated)
* [googleMaps:authFailure](#googlemapsauthFailure)

## `contentType:dropped`

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

## `contentType:dropped:create`

**Triggers**

* `Stage::onContentTypeDropped`


**Params**

``` js
{
    id: string;
    contentType: ContentTypeInterface;
}
```

[Back to top]

## `contentType:instanceDropped`

**Triggers**

* `ko-sortable::onSortUpdate`
* `ColumnGroup.Preview::onExistingColumnDrop`

**Params**

``` js
{
    parent: ContentTypeInterface;
    contentTypeInstance: ContentTypeInterface;
    index?: number;
    stageId: string;
}
```

[Back to top]

## `contentType:mount`

**Triggers**

* `ContentTypeCollection::addChild`
* `Column.Preview::fireMountEvent`

**Params**

``` js
{
    id: string;
    contentType: ContentTypeInterface;
}
```

[Back to top]

## `contentType:moved`

**Triggers**

* `Stage::onContentTypeInstanceDropped`

**Params**

``` js
{
    contentType: ContentTypeInterface,
    index: number,
    newParent: ContentTypeInterface,
    originalParent: ContentTypeInterface
}
```

## `contentType:removed`

**Triggers**

* `Preview::onOptionRemove`

**Params**

``` js
{
    parent: ContentTypeInterface;
    index: number;
    contentType: ContentTypeInterface;
    stageId: string;
}
```

## `contentType:sorted`

**Triggers**

* `ko-sortable::onSortUpdate`

**Params**

``` js
{
    parent: ContentTypeInterface;
    contentType: ContentTypeInterface;
    index: number;
    stageId: string;
}
```

[Back to top]

## `contentType:sortStart`

**Triggers**

* `ko-sortable::onSortStart`

**Params**

``` js
{
    contentType: ContentTypeInterface;
    event: Event;
    originalEle: JQuery;
    placeholder: JQuery;
    helper?: any;
    stageId: string;
}
```

[Back to top]

## `contentType:sortStop`

**Triggers**

* `ko-sortable::onSortStop`

**Params**

``` js
{
    contentType: ContentTypeInterface;
    event: Event;
    originalEle: JQuery;
    placeholder: JQuery;
    helper?: any;
    stageId: string;
}
```

[Back to top]

## `buttons:contentType:dropped:create`

**Triggers**

* `Stage::onContentTypeDropped`

**Params**

``` js
{
    id: string;
    contentType: ContentTypeInterface;
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

## `image:contentType:ready`

**Triggers**

* `ContentTypeFactory::fireContentTypeReadyEvent`

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

## `row:contentType:ready`

**Triggers**

* `ContentTypeFactory::fireContentTypeReadyEvent`

**Params**

``` js
{
    id: string;
    contentType: ContentTypeInterface;
}
```

[Back to top]

## `slide:contentType:create`

**Triggers**

* `ContentTypeFactory::createContentType`

**Params**

``` js
{
    id: string;
    contentType: ContentTypeInterface;
}
```

## `slider:contentType:dropped:create`

**Triggers**

* `Stage::onContentTypeDropped`

**Params**

``` js
{
    id: string;
    contentType: ContentTypeInterface;
}
```

[Back to top]

## `slide:contentType:duplicate`

**Triggers**

* `Preview::dispatchContentTypeCloneEvents`
* `ContentTypeDuplicateEventParams`

**Params**

``` js
{
    original: originalContentType,
    duplicateContentType,
    index,
}
```

[Back to top]

## `slide:contentType:mount`

**Triggers**

* `ContentTypeCollection::addChild`
* `Column.Preview::fireMountEvent`

**Params**

``` js
{
    id: string;
    contentType: ContentTypeInterface;
}
```

[Back to top]

## `slide:contentType:removed`

**Triggers**

* `Preview::onOptionRemove`
* `ContentTypeRemovedParams`

**Params**

``` js
{
    parent: ColumnGroup;
    contentType: Column;
    index: number;
}
```

[Back to top]

## `slider:contentType:ready`

**Triggers**

* `ContentTypeFactory::fireContentTypeReadyEvent`

**Params**

``` js
{
    id: string;
    contentType: ContentTypeInterface;
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

## `tab-item:contentType:duplicate`

**Triggers**

* `Preview::dispatchContentTypeCloneEvents`
* `ContentTypeDuplicateEventParams`

**Params**

``` js
{
    original: ContentTypeInterface,
    duplicateContentType: ContentTypeInterface,
    index: number,
}
```

[Back to top]

## `tab-item:contentType:mount`

**Triggers**

* `ContentTypeCollection::addChild`
* `Column.Preview::fireMountEvent`

**Params**

``` js
{
    id: string;
    contentType: ContentTypeInterface;
}
```

[Back to top]

## `tab-item:contentType:removed`

**Triggers**

* `Preview::onOptionRemove`
* `ContentTypeRemovedParams`

**Params**

``` js
{
    parent: ContentTypeInterface;
    index: number;
    contentType: ContentTypeInterface;
    stageId: string;
}
```

[Back to top]

## `tabs:contentType:dropped:create`

**Triggers**

* `Stage::onContentTypeDropped`

**Params**

``` js
{
    id: string;
    contentType: ContentTypeInterface;
}
```

[Back to top]

## `tabs:contentType:ready`

**Triggers**

* `ContentTypeFactory::fireContentTypeReadyEvent`

**Params**

``` js
{
    id: string;
    contentType: ContentTypeInterface;
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
