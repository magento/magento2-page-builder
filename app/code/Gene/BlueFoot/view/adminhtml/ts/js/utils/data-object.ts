import {DataObject} from "../component/data-store";

/**
 * Create a mapping of strings to booleans
 *
 * @param array
 * @returns {DataObject}
 */
export function toDataObject(array: Array<string>): DataObject {
    return array.reduce((acc: any, next: string) => {
        acc[next] = true;
        return acc;
    }, {})
}

/**
 * Filters attributes in a DataObject
 *
 * @param data
 * @param attributes
 * @returns {DataObject}
 */
export function filterAttributes(data: DataObject, attributes:DataObject): DataObject {
    let result: DataObject = {};
    for (let key in data) {
        if (attributes[key]) {
            result[key] = data[key];
        }
    }
    return result;
}