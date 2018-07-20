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
    let resolve: PromiseLike<any> | any;
    let reject: any;
    const promise = new Promise(
        (promiseResolve: (value?: (PromiseLike<any> | any)) => void, promiseReject: (reason?: any) => void) => {
            resolve = promiseResolve;
            reject = promiseReject;
    });
    return { resolve, reject, promise };
}
