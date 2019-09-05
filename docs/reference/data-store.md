# Page Builder data store

## Summary

The data store is a utility class that stores the user's input data for a content type. When Page Builder creates a content type, either from the master storage format or from a user dragging and dropping a content type, Page Builder also creates a data store instance for that content type. Whenever the user modifies a content type, either by editing it on the stage or from the UI component form, Page Builder updates the data store with the new data. The master format and preview both fetch the data required for their render from the data store.

## Access

The data store is available for access on the `ContentType` implementation, using the key `dataStore`. If you are within a preview or master component, you must first access the content type through the `contentType` property, as follows:

```js
Preview.contentType.dataStore;
```

## Events

The data store maintains its own event system. It does not use the global events system used by Page Builder. As a result, you need to create an instance of `dataStore` and subscribe to its data changes, as follows:

```js
var dataStore = self.contentType.dataStore;

dataStore.subscribe(() => {
    // handler to update content type
});
```

## API

### `get(key: string, defaultValue?: any): any`

Retrieve a single value from the content type's data store based on its key. You can provide an optional default value if no data is present.

### `getState(): object`

Get the entire state object for the current content type instance.

### `set(key: string, value: any): void`

Set a single piece of data into the content type's data store.

### `setState(): void`

Set the entire state for the current content type.

## Usage

You can use the data store to modify your content type when its data changes. For example, the Page Builder native Tabs content type (magento2-page-builder/app/code/Magento/PageBuilder/view/adminhtml/web/ts/js/content-type/tabs/preview.ts) subscribes to the data store and makes updates to it when a tab-item changes, as show here in TypeScript:

```typescript
...
    args.contentType.dataStore.subscribe(() => {
        this.updateTabNamesInDataStore();
    });
...

/**
* Update data store with active options
*/
private updateTabNamesInDataStore() {
    const activeOptions: ActiveOptionsInterface[] = [];
    this.contentType.children().forEach((tab: ContentTypeInterface, index: number) => {
        const tabData = tab.dataStore.getState();
        activeOptions.push({
            label: tabData.tab_name.toString(),
            labeltitle: tabData.tab_name.toString(),
            value: index,
        });
    });

    this.contentType.dataStore.set(
        "_default_active_options",
        activeOptions,
    );
}
```
