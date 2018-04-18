# Adding New Content Type 

## Configuration

Adding new content type starts with [configuration](content-type-configuration.md).

## Preview, PreviewCollection, Content and ContentCollection

If your content type has custom preview logic, you need to specify `preview_component`, otherwise the default one `Magento_PageBuilder/js/preview` will be used.

If your content type can have other components as children, you need to extend `Magento_PageBuilder/js/preview-collection` component. Otherwice you need to extend `Magento_PageBuilder/js/preview`.

In the preview component you can add custom logic that will be available in the template. You can also do modifications to observables used in preview template if you override `afterObservablesUpdated` method. 

Here is example of extending preview component.

``` JS
define(["Magento_PageBuilder/js/preview"], function (Preview) {
    var Custom = function() {
        Preview.apply(this, arguments);
    };

    Custom.prototype = Object.create(Preview.prototype);
    Custom.prototype.constructor = Custom;
    Custom.__proto__ = Preview;
    
    var super_ = Preview.prototype;

    /**
     * Owerride isConfigured method in parent
     */
    Custom.prototype.isConfigured = function() {
        return super_.isConfigured.call(this);
    };

    return Custom;
});
```

You can also specify `content_component` if you want to do modifications to observables used in master format templates.

## Config

Backend configuration available in PageBuilder via `Magento_PageBuilder/js/component/config`.

Config have the following methods

| Method                 | Description                                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| `setConfig`            | Method is used for initial initialization of the config, not expected to be used by developers. |
| `getConfig`            | Returns the whole configuration as object.                                                      |
| `getContentTypeConfig` | Retrieves configuration for specific content type.                                              |
