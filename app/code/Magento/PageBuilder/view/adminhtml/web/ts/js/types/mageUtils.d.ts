/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

interface CompareObject {
    containers: object;
    changes: CompareObjectItem[];
    equal: boolean;
}

interface CompareObjectItem {
    path: string;
    name: string;
    value: any;
    oldValue: any;
}

declare let mageUtils: {
    /**
     * Generates a unique identifier.
     *
     * @param {Number} [size=7] - Length of a resulting identifier.
     * @returns {String}
     */
    uniqueid(size?: number): string,

    /**
     * Performs deep extend of specified objects.
     *
     * @returns {Object|Array} Extended object.
     */
    extend(...args: any[]): object;

    /**
     * Compare two objects
     * @param args
     *
     * @return {CompareObject}.
     */
    compare(...args: any[]): CompareObject;
};
declare module "mageUtils" {
    export = mageUtils;
}
