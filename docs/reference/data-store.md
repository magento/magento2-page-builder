# Data Store

## Summary
The purpose of the data store is to store all configured data associated with a content types instance. This data can be modified by a number of different interfaces including live edit and the UI component edit panel.

The data store is accessed when generating the data sets to be applied within the preview and master templates before render.

## Access
The data store is available for access on the `ContentType` implementation via the key `dataStore`. If you're within a preview or master you'll need to first access the content type through the `contentType` property.

## API
#### `get(key: string, defaultValue?: any): any`
Retrieve a single value from the content types data store based on it's key, optionally provide a default value if no data is present.

#### `getState(): object`
Get the entire state object for the current instance.

#### `set(key: string, value: any): void`
Set a single piece of data into the data store.

#### `setState(): void`
Set the entire state for the current content type.

## Events
The data store maintains it's own events system and does not use the global events system that's otherwise used by Page Builder.

Due to this you'll require an instance of `dataStore` to observe events.

We fire a single event called `state`, this returns the entire state and is fired whenever the state is changed.
```js
dataStore.events.on("state", function (state) {
    console.log(state);    
});
```