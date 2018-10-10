/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare var DomObserver: {
    /**
     * Disable a node from being observed by the mutations
     *
     * @param {HTMLElement} node
     */
    disableNode(node: HTMLElement): void;

    /**
     * Adds listener for the appearance of nodes that matches provided
     * selector and which are inside of the provided context. Callback will be
     * also invoked on elements which a currently present.
     *
     * @param {String} selector - CSS selector.
     * @param {Function} callback - Function that will invoked when node appears.
     * @param {HTMLElement} [ctx=document.body] - Context inside of which to search for the node.
     */
    get(selector: string, callback: () => void, ctx: HTMLElement): void;

    /**
     * Adds listener for the nodes removal.
     *
     * @param {(jQueryObject|HTMLElement|Array|String)} selector
     * @param {Function} callback - Function that will invoked when node is removed.
     * @param {HTMLElement} [ctx=document.body] - Context inside of which to search for the node.
     */
    remove(selector: string, callback: () => void, ctx: HTMLElement): void;

    /**
     * Removes listeners.
     *
     * @param {String} selector
     * @param {Function} [fn]
     */
    off(selector: string, fn: () => void): void;
};

declare module "Magento_Ui/js/lib/view/utils/dom-observer" {
    export = DomObserver;
}
