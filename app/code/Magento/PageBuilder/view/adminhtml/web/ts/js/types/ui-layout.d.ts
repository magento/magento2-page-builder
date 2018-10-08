/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * Application entry point
 *
 * @param {Object} nodes
 * @param {Object} parent
 * @param {Boolean} cached
 * @param {Boolean} merge
 * @returns {Boolean|undefined}
 */
declare function run(nodes: object, parent?: object, cached?: boolean, merge?: boolean): boolean | undefined;

declare module "uiLayout" {
    export = run;
}
