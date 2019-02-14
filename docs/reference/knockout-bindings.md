# Knockout Bindings

## Summary

As part of the Page Builder application, we provide new Knockout bindings you can use in your custom content types:

| Name           | Description                                                    | Usage                                  |
| -------------- | -------------------------------------------------------------- | -------------------------------------  |
| sortable       | Enables sorting the children of a bound element.               | \<div data-bind="sortable: {}"></div>  |
| draggable      | Enables draggable functionality on DOM elements.               | \<div data-bind="draggable: {}"></div> |
| live-edit      | Enables editing text directly from the Admin stage.            | \<div data-bind="liveEdit: {}"></div>  |
| focus          | Enables default focus on DOM elements.                         | \<div data-bind="hasFocusNoScroll: $parent.focusedSlide() === $index()"></div>     |

### Sortable binding

```shell
app/code/Magento/PageBuilder/view/adminhtml/web/ts/js/binding/sortable.ts
```

The options in this binding are passed to the jQuery UI sortable instance. All options and their descriptions are available on the jQuery UI site: http://api.jqueryui.com/sortable/.

Within Page Builder, we use the `sortable` binding to pass preview-component options to the drag-and-drop binding. We bind multiple options and events to the `sortable` instance so we can correctly respond to user actions when dragging and dropping content. Configuration and usage of the `sortable` binding can be seen in the Preview component:

Example Configuration:

```shell
app/code/Magento/PageBuilder/view/adminhtml/web/ts/js/content-type/preview.ts
```

Example Usage:

```shell
app/code/Magento/PageBuilder/view/adminhtml/web/template/content-type/preview.html
```

### Draggable binding

```shell
app/code/Magento/PageBuilder/view/adminhtml/web/ts/js/binding/draggable.ts
```

The options provided in this binding are passed to the jQuery UI draggable instance. All options and their descriptions are available on the jQuery UI site: http://api.jqueryui.com/draggable/.

Within Page Builder, we use this binding for the left panel's content types. The configuration and usage of the `draggable` binding can be seen in the Panel component:

Example Configuration:

```shell
app/code/Magento/PageBuilder/view/adminhtml/web/ts/js/panel.ts
```

Example Usage:

```shell
app/code/Magento/PageBuilder/view/adminhtml/web/template/panel.html
```

