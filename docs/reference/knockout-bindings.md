# Page Builder Knockout bindings

## Summary

As part of the Page Builder application, we provide a number of several new Knockout bindings to add more functionality to certain content types through Knockouts binding syntax.

| Binding Name   | Description                                                    | 
| -------------- | -------------------------------------------------------------- |
| `sortable`       | Enables sorting the children of a bound element. We use this within container content types such as the root container, row and columns to enable drag and drop capabilities on their children content types. This can be used for easy access to the jQuery UI sortable functionality within your module. |
| `draggable`      | Enables draggable functionality on DOM elements. We use this to enable the content types in the left menu to be dragged and dropped into containers on the stage. |              
| `liveEdit`      | Enables basic live text editing on the stage. This also supports displaying additional items within the live edit UI for easier modification. You can read more about how to use live edit within our [How to add a custom Toolbar](../how-to/how-to-add-custom-toolbar.md) guide. |           
| `hasFocusNoScroll` | Enables an element to use Knockout `hasFocus` binding without it causing the browser to scroll to the element. We use this within Slider to ensure the correct slide is focused but we do not want to scroll this into view always. |        
{:style="table-layout:auto"}

### `sortable` binding

```shell
view/adminhtml/web/ts/js/binding/sortable.ts
```

This binding serves as an interface for jQuery UI Sortable.

Within Page Builder, we use the `sortable` binding to pass preview-component options to the drag-and-drop binding. We bind multiple options and events to the `sortable` instance so we can correctly respond to user actions when dragging and dropping content. Configuration and usage of the `sortable` binding can be seen in the Preview component:

**Configuration:**

See the options listed on jQuery UI's Sortable API page: http://api.jqueryui.com/sortable/

**Usage:**

```html
<div data-bind="sortable: getSortableOptions()" />
```
_Because jQuery UI can have callback functions, we recommend providing this configuration from a function within your Knockout view model._

### `draggable` binding

```shell
view/adminhtml/web/ts/js/binding/draggable.ts
```

This binding serves as an interface for jQuery UI Draggable.

Within Page Builder, we use this binding for the left panel's content types. You can see the configuration and usage of the `draggable` binding in the Panel component. If you have access to the Page Builder repo, you can find the Panel component template here: https://github.com/magento/magento2-page-builder/blob/develop/app/code/Magento/PageBuilder/view/adminhtml/web/template/panel.html.

**Configuration:**

See the options listed on jQuery UI's Sortable API page: http://api.jqueryui.com/draggable/

**Usage:**

```html
<div data-bind="draggable: getDraggableOptions()" />
```
_Because jQuery UI can have callback functions, we recommend providing this configuration from a function within your Knockout view model._

### `liveEdit` binding

This binding provides basic text live editing functionality to the current element. It does this by adding `contenteditable` to the bound element.

**Configuration:**

| Name           | Description                                                    | 
| -------------- | -------------------------------------------------------------- |
| `field`        | The field name from the UI component form you want the live edit instance to edit. | 
| `placeholder`  | _Optional_. A placeholder to display when there is no data entered for this field.
| `selectAll`    | _Optional_. Selects all text on focus within the live edit field. We use this within tabs. |           
{:style="table-layout:auto"}

**Usage:**

```html
<div data-bind="liveEdit: { field: 'field', placeholder: $t('Placeholder'), selectAll: true }" />
```

### `hasFocusNoScroll` binding

This binding enables the functionality of Knockout's [hasFocus](https://knockoutjs.com/documentation/hasfocus-binding.html) binding while removing the automatic scrolling that occurs when focusing an element within the browser.

The binding has no configuration and must be passed an observable with a boolean value. 

**Usage:**

```html
<div data-bind="hasFocusNoScroll: anObservable" />
```
