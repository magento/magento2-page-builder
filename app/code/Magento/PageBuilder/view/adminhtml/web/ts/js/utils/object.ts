/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import objectPath from "object-path";

/**
 * Retrieve a value from an object via a path
 *
 * @param {object} object
 * @param {string} path
 * @param {TResult} defaultValue
 * @returns {TResult}
 */
export function get<TResult>(object: object, path: string, defaultValue?: TResult): TResult {
    return objectPath.get(object, path, defaultValue);
}

/**
 * Set a value within an object via a path
 *
 * @param {object} object
 * @param {string} path
 * @param {TResult} value
 * @returns {TResult | undefined}
 */
export function set<TResult = any>(object: object, path: string, value: TResult): TResult | undefined {
    return objectPath.set(object, path, value);
}
