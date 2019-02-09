# Page Builder events

## Event consumption
The pattern for consuming Page Builder events in JavaScript, such as within the `preview.js` component, is to import `Magento_PageBuilder/js/events` and use the `events.on()` method to bind to the event you want to handle, as shown here:

```js
define([
    'Magento_PageBuilder/js/events',
], function (events) {
    'use strict';

    events.on("event:name", function (args) {
        // do logic
    });
});

```

## Events list

The following table lists the Page Builder events you can bind to and handle within your content type.

<!-- {% raw %} -->

| Content Type Events                                 | Stage Events                                             |
| --------------------------------------------------- | -------------------------------------------------------- |
| [contentType:createAfter](#contenttypecreateafter)  | [stage:childFocusStart](#stagechildfocusstart)                                    |
| [contentType:dropAfter](#contenttypedropafter)      | [stage:childFocusStop](#stagechildfocusstop)                                     |
| [contentType:duplicateAfter](#contenttypeduplicateafter) | [stage:interactionStart](#stageinteractionstart)                                   |
| [contentType:mountAfter](#contenttypemountafter)    | [stage:interactionStop](#stageinteractionstop)                                    |
| [contentType:moveAfter](#contenttypemoveafter)      | [stage:error](#stageerror)                                              |
| [contentType:moveBefore](#contenttypemovebefore)    | [stage:{{preview.parent.stageId}}:masterFormatRenderAfter](#stageidmasterformatrenderafter) |
| [contentType:redrawAfter](#contenttyperedrawafter)  | [stage:{{preview.parent.stageId}}:readyAfter](#stageidreadyafter)              |
| [contentType:removeAfter](#contenttyperemoveafter)  | [stage:{{preview.parent.stageId}}:renderAfter](#stagepreviewparentstageidrenderafter)             |
| [contentType:renderAfter](#contenttyperenderafter)  | [stage:{{preview.parent.stageId}}:toggleFullscreen](#stageidtogglefullscreen)        |
|                                                     | [stage:updateAfter](#stageupdateafter)                                        |
|                                                     |                                                          |
| **Column Events**                                   | **Preview Events**                                       |
| [column:dragStart](#columndragstart)                | [previewSortable:sortstart](#previewsortablesortstart)                                |
| [column:dragStop](#columndragstop)                  | [previewSortable:sortupdate](#previewsortablesortupdate)                               |
| [column:initializeAfter](#columninitializeafter)    | [previewData:updateAfter](#previewdataupdateafter)                                  |
|                                                     |                                                          |
| **Image Events**                                    | **Other Events**                                         |
| [image:{{preview.parent.id}}:assignAfter](#imageidassignafter) | [googleMaps:authFailure](#googlemapsauthfailure)                                   |
| [image:mountAfter](#imagemountafter)                | [state](#state)                                                    |
| [image:uploadAfter](#imageuploadafter)              | [{{config.name}}:{{preview.parent.id}}:updateAfter](#confignameidupdateafter)        |
|                                                     |                                                          |

## Event details

## `contentType:*` events
Events starting with `contentType:` are triggered for every content type on the stage. These events can also be called for specific content types by prefixing the content type's name before the event (`name:event`). For example:
* `text:createAfter`
* `row:mountAfter`
* `tab-item:mountAfter`



### `contentType:createAfter`

```js
events.on("contentType:createAfter", function (params) {});
```

| Params        | Type                                                        |
| ------------- | ----------------------------------------------------------- |
| `id`          | `string`                                                    |
| `contentType` | `ContentTypeInterface` and `ContentTypeCollectionInterface` |

[Back to top]



### `contentType:mountAfter` (ContentType)

```js
events.on("contentType:mountAfter", function (params) {});
```

| Params        | Type          |
| ------------- | ------------- |
| `id`          | `string`      |
| `contentType` | `ContentType` |

[Back to top]



### `contentType:mountAfter` (ContentTypeCollection)

```js
events.on("contentType:mountAfter", function (params) {});
```

| Params           | Type                    |
| ---------------- | ----------------------- |
| `id`             | `string`                |
| `contentType`    | `ContentTypeCollection` |
| `expectChildren` | `number`                |

[Back to top]



### `contentType:dropAfter`

```js
events.on("contentType:dropAfter", function (params) {});
```

| Params        | Type                                                        |
| ------------- | ----------------------------------------------------------- |
| `id`          | `string`                                                    |
| `contentType` | `ContentTypeInterface` and `ContentTypeCollectionInterface` |

[Back to top]



### `contentType:renderAfter`

```js
events.on("contentType:renderAfter", function (params) {});
```

| Params        | Type                                                        |
| ------------- | ----------------------------------------------------------- |
| `id`          | `string`                                                    |
| `element`     | `Element`                                                   |
| `contentType` | `ContentTypeInterface` and `ContentTypeCollectionInterface` |

[Back to top]



### `contentType:removeAfter`

```js
events.on("contentType:removeAfter", function (params) {});
```

| Params        | Type                                           |
| ------------- | ---------------------------------------------- |
| `contentType` | `ContentType`: `ContentTypeInterface`          |
| `index`       | `number`                                       |
| `parent`      | `ContentType`:`ContentTypeCollectionInterface` |
| `stageId`     | `string`                                       |

[Back to top]



### `contentType:duplicateAfter`

```js
events.on("contentType:duplicateAfter", function (params) {});
```

| Params                 | Type                                                        |
| ---------------------- | ----------------------------------------------------------- |
| `originalContentType`  | `ContentTypeInterface` and `ContentTypeCollectionInterface` |
| `duplicateContentType` | `ContentTypeInterface` and `ContentTypeCollectionInterface` |
| `index`                | `number`                                                    |
| `direct`               | `boolean`                                                   |

[Back to top]



### `contentType:moveBefore`

```js
events.on("contentType:moveBefore", function (params) {});
```

| Params         | Type                                                        |
| -------------- | ----------------------------------------------------------- |
| `contentType`  | `ContentTypeInterface` and `ContentTypeCollectionInterface` |
| `sourceParent` | `ContentTypeCollectionInterface`                            |
| `targetParent` | `ContentTypeCollectionInterface`                            |
| `targetIndex`  | `number`                                                    |
| `stageId`      | `string`                                                    |

[Back to top]



### `contentType:moveAfter`

```js
events.on("contentType:moveAfter", function (params) {});
```

| Params         | Type                                                        |
| -------------- | ----------------------------------------------------------- |
| `contentType`  | `ContentTypeInterface` and `ContentTypeCollectionInterface` |
| `sourceParent` | `ContentTypeCollectionInterface`                            |
| `targetParent` | `ContentTypeCollectionInterface`                            |
| `targetIndex`  | `number`                                                    |
| `stageId`      | `string`                                                    |

[Back to top]



### `contentType:redrawAfter`

```js
events.on("contentType:redrawAfter", function (params) {});
```

#### Backend

| Params        | Type                                                        |
| ------------- | ----------------------------------------------------------- |
| `id`          | `string`                                                    |
| `contentType` | `ContentTypeInterface` and `ContentTypeCollectionInterface` |

#### Frontend

| Params    | Type          |
| --------- | ------------- |
| `element` | `HTMLElement` |

[Back to top]



### `column:dragStart`

```js
events.on("column:dragStart", function (params) {});
```

| Params    | Type                   |
| --------- | ---------------------- |
| `column`  | `ContentTypeInterface` |
| `stageId` | `string`               |

[Back to top]



### `column:dragStop`

```js
events.on("column:dragStop", function (params) {});
```

| Params    | Type                   |
| --------- | ---------------------- |
| `column`  | `ContentTypeInterface` |
| `stageId` | `string`               |

[Back to top]



### `column:initializeAfter`

```js
events.on("column:initializeAfter", function (params) {});
```

| Params    | Type          |
| --------- | ------------- |
| `column`  | `Column`      |
| `element` | `Element`     |
| `parent`  | `ColumnGroup` |

[Back to top]



### `image:{{preview.parent.id}}:assignAfter` {#imageidassignafter}

```js
events.on(`image:${this.parent.id}:assignAfter`, function (params) {});
```


| Params        | Type   |
| ------------- | ------ |
| `imageObject` | `File` |

[Back to top]



### `image:mountAfter`

```js
events.on("image:mountAfter", function (params) {});
```

| Params           | Type     |
| ---------------- | -------- |
| `id`             | `string` |
| `expectChildren` | `number` |

[Back to top]



### `image:uploadAfter`

```js
events.on("image:uploadAfter", function (params) {});
```

| Params | Type   |
| ------ | ------ |
| `file` | `File` |

[Back to top]



### `stage:{{preview.parent.stageId}}:readyAfter`

```js
events.on(`stage:${this.parent.stageId}:readyAfter`, function (params) {});
```

| Params  | Type    |
| ------- | ------- |
| `stage` | `Stage` |

[Back to top]



### `stage:{{preview.parent.stageId}}:renderAfter`

```js
events.on(`stage:${this.parent.stageId}:renderAfter`, function (params) {});
```

| Params  | Type    |
| ------- | ------- |
| `stage` | `Stage` |

[Back to top]



### `stage:interactionStart`

```js
events.on("stage:interactionStart", function () {});
```

| Params | Type |
| ------ | ---- |
| `None` |      |

[Back to top]



### `stage:interactionStop`

```js
events.on("stage:interactionStop", function () {});
```

| Params | Type |
| ------ | ---- |
| `None` |      |

[Back to top]



### `stage:{{preview.parent.stageId}}:toggleFullscreen` {#stageidtogglefullscreen}

```js
events.on(`stage:${this.parent.stageId}:toggleFullscreen`, function (params) {});
```

| Params   | Type     |
| -------- | -------- |
| `object` | `Object` |

[Back to top]



### `previewData:updateAfter`

```js
events.on("previewData:updateAfter", function (params) {});
```

| Params    | Type      |
| --------- | --------- |
| `preview` | `Preview` |

[Back to top]



### `childContentType:sortStart`

```js
events.on("childContentType:sortStart", function (params) {});
```

| Params             | Type                        |
| ------------------ | --------------------------- |
| `instance`         | `Preview`                   |
| `originalPosition` | `number`                    |
| `ui`               | `JQueryUI.SortableUIParams` |

[Back to top]



### `childContentType:sortUpdate`

```js
events.on("childContentType:sortUpdate", function (params) {});
```

| Params             | Type                        |
| ------------------ | --------------------------- |
| `instance`         | `ContentTypeInterface`      |
| `newPosition`      | `number`                    |
| `originalPosition` | `number`                    |
| `ui`               | `JQueryUI.SortableUIParams` |
| `event`            | `Event`                     |

[Back to top]



### `stage:error`

```js
events.on("stage:error", function (params) {});
```

| Params  | Type    |
| ------- | ------- |
| `error` | `Error` |

[Back to top]



### `stage:{{preview.parent.stageId}}:readyAfter` {#stageidreadyafter}

```js
events.on(`stage:${this.parent.stageId}:readyAfter`, function (params) {});
```

| Params  | Type    |
| ------- | ------- |
| `stage` | `Stage` |

[Back to top]



### `stage:{{preview.parent.stageId}}:masterFormatRenderAfter` {#stageidmasterformatrenderafter}

```js
events.on(`stage:${this.parent.stageId}:masterFormatRenderAfter`, function (params) {});
```

| Params           | Type     |
| ---------------- | -------- |
| `renderedOutput` | `string` |

[Back to top]



### `stage:updateAfter`

```js
events.on("stage:updateAfter", function (params) {});
```

| Params    | Type     |
| --------- | -------- |
| `stageId` | `string` |

[Back to top]



### `stage:childFocusStart`

```js
events.on("stage:childFocusStart", function () {});
```

| Params | Type |
| ------ | ---- |
| `None` |      |

[Back to top]



### `stage:childFocusStop`

```js
events.on("stage:childFocusStop", function () {});
```

| Params | Type |
| ------ | ---- |
| `None` |      |

[Back to top]



### `state`

```js
events.on("state", function (params) {});
```

| Params  | Type        |
| ------- | ----------- |
| `state` | `DataStore` |

[Back to top]



### `{{config.name}}:{{preview.parent.id}}:updateAfter` {#confignameidupdateafter}

```js
events.on(`${this.config.name}:${this.parent.id}:updateAfter`, function (params) {});
```

| Params        | Type          |
| ------------- | ------------- |
| `contentType` | `ContentType` |

[Back to top]



### `googleMaps:authFailure`

```js
events.on("googleMaps:authFailure", function () {});
```

| Params | Type |
| ------ | ---- |
| `None` |      |

[Back to top]



[Back to top]: #events-list

<!-- {% endraw %} -->