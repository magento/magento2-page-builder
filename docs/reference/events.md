# Page Builder Events

The following table provides the list of events that Page Builder dispatches.

## Events

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


## `contentType:*` events
Events starting with `contentType:` are triggered by every content type on the stage. These events can also be called for specific content types by prefixing the content types name before the event (`{{name}}:{{event}}`). For example:
* `text:createAfter`
* `row:mountAfter`
* `tab-item:mountAfter`

### `contentType:createAfter`

| Parameters    | Type                                                        |
| ------------- | ----------------------------------------------------------- |
| `id`          | `string`                                                    |
| `contentType` | `ContentTypeInterface` and `ContentTypeCollectionInterface` |

[Back to top]

### `contentType:mountAfter`

| Parameters       | Type                                                        |
| ---------------- | ----------------------------------------------------------- |
| `id`             | `string`                                                    |
| `contentType`    | `ContentTypeInterface` and `ContentTypeCollectionInterface` |
| `expectChildren` | `number`                                                    |

[Back to top]

### `contentType:dropAfter`

| Parameters    | Type                                                        |
| ------------- | ----------------------------------------------------------- |
| `id`          | `string`                                                    |
| `contentType` | `ContentTypeInterface` and `ContentTypeCollectionInterface` |

[Back to top]

### `contentType:renderAfter`

| Parameters    | Type                                                        |
| ------------- | ----------------------------------------------------------- |
| `id`          | `string`                                                    |
| `element`     | `Element`                                                   |
| `contentType` | `ContentTypeInterface` and `ContentTypeCollectionInterface` |

[Back to top]

### `contentType:removeAfter`

| Parameters    | Type                                                        |
| ------------- | ----------------------------------------------------------- |
| `contentType` | `ContentTypeInterface` and `ContentTypeCollectionInterface` |
| `index`       | `number`                                                    |
| `parent`      | `ContentTypeCollectionInterface`                            |
| `stageId`     | `string`                                                    |

[Back to top]

### `contentType:duplicateAfter`

| Parameters             | Type                                                        |
| ---------------------- | ----------------------------------------------------------- |
| `originalContentType`  | `ContentTypeInterface` and `ContentTypeCollectionInterface` |
| `duplicateContentType` | `ContentTypeInterface` and `ContentTypeCollectionInterface` |
| `index`                | `number`                                                    |
| `direct`               | `boolean`                                                   |

[Back to top]

### `contentType:moveBefore`

| Parameters     | Type                                                        |
| -------------- | ----------------------------------------------------------- |
| `contentType`  | `ContentTypeInterface` and `ContentTypeCollectionInterface` |
| `sourceParent` | `ContentTypeCollectionInterface`                            |
| `targetParent` | `ContentTypeCollectionInterface`                            |
| `targetIndex`  | `number`                                                    |
| `stageId`      | `string`                                                    |

[Back to top]

### `contentType:moveAfter`

| Parameters     | Type                                                        |
| -------------- | ----------------------------------------------------------- |
| `contentType`  | `ContentTypeInterface` and `ContentTypeCollectionInterface` |
| `sourceParent` | `ContentTypeCollectionInterface`                            |
| `targetParent` | `ContentTypeCollectionInterface`                            |
| `targetIndex`  | `number`                                                    |
| `stageId`      | `string`                                                    |

[Back to top]

### `contentType:redrawAfter`

#### Backend

| Parameters    | Type                                                        |
| ------------- | ----------------------------------------------------------- |
| `id`          | `string`                                                    |
| `contentType` | `ContentTypeInterface` and `ContentTypeCollectionInterface` |

#### Frontend

| Parameters | Type          |
| ---------- | ------------- |
| `element`  | `HTMLElement` |

[Back to top]

### `column:dragStart`

| Parameters | Type                   |
| ---------- | ---------------------- |
| `column`   | `ContentTypeInterface` |
| `stageId`  | `string`               |

[Back to top]

### `column:dragStop`

| Parameters | Type                   |
| ---------- | ---------------------- |
| `column`   | `ContentTypeInterface` |
| `stageId`  | `string`               |

[Back to top]

### `column:initializeAfter`

| Parameters | Type          |
| ---------- | ------------- |
| `column`   | `Column`      |
| `element`  | `Element`     |
| `parent`   | `ColumnGroup` |

[Back to top]

### `image:{{preview.parent.id}}:assignAfter` {#imageidassignafter}

| Parameters    | Type     |
| ------------- | -------- |
| `imageObject` | `??????` |

[Back to top]

### `image:mountAfter`

| Parameters | Type       |
| ---------- | ---------- |
| `function` | `Function` |

[Back to top]

### `image:uploadAfter`

| Parameters | Type      |
| ---------- | --------- |
| `???????`  | `???????` |

[Back to top]

### `stage:{{preview.parent.stageId}}:readyAfter`

| Parameters | Type    |
| ---------- | ------- |
| `stage`    | `Stage` |

[Back to top]

### `stage:{{preview.parent.stageId}}:renderAfter`

| Parameters | Type     |
| ---------- | -------- |
| `stageId`  | `number` |

[Back to top]

### `stage:interactionStart`

| Parameters | Type |
| ---------- | ---- |
| `None`     |      |

[Back to top]

### `stage:interactionStop`

| Parameters | Type |
| ---------- | ---- |
| `None`     |      |

[Back to top]

### `stage:{{preview.parent.stageId}}:toggleFullscreen` {#stageidtogglefullscreen}

| Parameters | Type     |
| ---------- | -------- |
| `object`   | `Object` |

[Back to top]

### `previewData:updateAfter`

| Parameters | Type      |
| ---------- | --------- |
| `preview`  | `Preview` |

[Back to top]

### `childContentType:sortStart`

| Parameters         | Type                        |
| ------------------ | --------------------------- |
| `instance`         | `Preview`                   |
| `originalPosition` | `number`                    |
| `ui`               | `JQueryUI.SortableUIParams` |

[Back to top]

### `childContentType:sortUpdate`

| Parameters         | Type                        |
| ------------------ | --------------------------- |
| `instance`         | `ContentTypeInterface`      |
| `newPosition`      | `number`                    |
| `originalPosition` | `number`                    |
| `ui`               | `JQueryUI.SortableUIParams` |
| `event`            | `Event`                     |

[Back to top]

### `stage:error`

| Parameters | Type    |
| ---------- | ------- |
| `error`    | `Error` |

[Back to top]

### `stage:{{preview.parent.stageId}}:readyAfter` {#stageidreadyafter}

| Parameters | Type     |
| ---------- | -------- |
| `value`    | `string` |

[Back to top]

### `stage:{{preview.parent.stageId}}:masterFormatRenderAfter` {#stageidmasterformatrenderafter}

| Parameters | Type     |
| ---------- | -------- |
| `value`    | `string` |

[Back to top]

### `stage:updateAfter`

| Parameters | Type     |
| ---------- | -------- |
| `stageId`  | `string` |

[Back to top]

### `stage:childFocusStart`

| Parameters | Type |
| ---------- | ---- |
| `None`     |      |

[Back to top]

### `stage:childFocusStop`

| Parameters | Type |
| ---------- | ---- |
| `None`     |      |

[Back to top]

### `state`

| Parameters | Type         |
| ---------- | ------------ |
| `state`    | `DataObject` |

[Back to top]

### `{{config.name}}:{{preview.parent.id}}:updateAfter` {#confignameidupdateafter}

| Parameters  | Type                   |
| ----------- | ---------------------- |
| `eventName` | `string`               |
| `paramObj`  | `[key: string]: Stage` |

[Back to top]

### `googleMaps:authFailure`

| Parameters | Type |
| ---------- | ---- |
| `None`     |      |

[Back to top]

[Back to top]: #events

<!-- {% endraw %} -->