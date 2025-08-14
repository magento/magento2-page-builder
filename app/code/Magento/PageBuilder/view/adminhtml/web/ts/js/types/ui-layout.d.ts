/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
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
