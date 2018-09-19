/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import DeferredInterface from "./promise-deferred.d";

/**
 * Returns a deferred promise
 *
 * @returns {DeferredInterface}
 * @api
 */
export default function deferred(): DeferredInterface {
    let resolve: () => void;
    let reject: () => void;
    const promise = new Promise((promiseResolve: () => void, promiseReject: () => void) => {
        resolve = promiseResolve;
        reject = promiseReject;
    });
    return { resolve, reject, promise };
}
