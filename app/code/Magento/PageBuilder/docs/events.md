# Events

This document describes events dispatched in PageBuilder and parameters.

* [block](#block-events)
    * [block:dropped](#blockdropped)
    * [block:dropped:create](#blockdroppedcreate)
    * [block:instanceDropped](#blockinstancedropped)

## `block`

### `block:dropped`

**Triggers**

* `ko-sortable::onSortReceive`

**Subscriptions**

* `Stage::initListeners`

**Args Object/Params**

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

### `block:dropped:create`

**Triggers**

* `Stage::onBlockDropped`

**Subscriptions**

* `/`

**Args Object/Params**

``` js
ContentTypeReadyEventParamsInterface

{
    id: string;
  block: ContentTypeInterface;
}
```

[Back to top]

## `block:instanceDropped`

**Triggers**

* `KoSortable::onSortUpdate`
* `ColumnGroup.Preview::onExistingColumnDrop`

**Subscriptions**

* `Stage::initListeners`

**Args Object/Params**

``` js
ContentTypeInstanceDroppedtParamsInterface

{
    parent: ContentTypeInterface;
  blockInstance: ContentTypeInterface;
  index?: number;
  stageId: string;
}
```

[Back to top]

[Back to top]: #events