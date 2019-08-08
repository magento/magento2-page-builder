# Page Builder data store

## Summary
The data store's purpose is to store all configured data associated with a content type's instance. You can modify this data in several ways, including through live edit on the Admin stage or from the content type's UI component form editor.

Page Builder accesses the data store when generating the data sets in the preview and master templates before render.

## Access

The data store is available for access on the `ContentType` implementation via the key `dataStore`. If you're within a preview or master component, you must first access the content type through the `contentType` property.

## API
#### `get(key: string, defaultValue?: any): any`
Retrieve a single value from the content type's data store based on its key. You can provide an optional default value if no data is present.

#### `getState(): object`
Get the entire state object for the current content type instance.

#### `set(key: string, value: any): void`
Set a single piece of data into the content type's data store.

#### `setState(): void`
Set the entire state for the current content type.

## Events
The data store maintains its own events system and does not use the global events system that's otherwise used by Page Builder.

Because of this, you need to create an instance of `dataStore` to observe events.

Page Builder fires a single event called `state`, which returns the entire state of the data store. Page Builder fires this event whenever the state changes.

```js
dataStore.events.on("state", function (state) {
    console.log(state);    
});
```