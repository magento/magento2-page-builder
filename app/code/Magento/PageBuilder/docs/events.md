# Events

This document describes events dispatched in PageBuilder and parameters.

### block:dropped

Parameters:

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

Triggered: ko-sortable::onSortReceive

