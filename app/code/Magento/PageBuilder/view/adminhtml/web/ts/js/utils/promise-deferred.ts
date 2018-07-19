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
    let resolve: any;
    let reject: any;
    const promise = new Promise((res: (value?: (PromiseLike<any> | any)) => void, rej: (reason?: any) => void) => {
        resolve = res;
        reject = rej;
    });
    return { resolve, reject, promise };
}
