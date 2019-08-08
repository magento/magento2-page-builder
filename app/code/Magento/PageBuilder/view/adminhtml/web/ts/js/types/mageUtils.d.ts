/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

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
};
declare module "mageUtils" {
    export = mageUtils;
}
