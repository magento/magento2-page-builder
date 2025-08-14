/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
 */

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

export interface DeferredInterface {
    resolve: (...args: any[]) => void;
    reject: (...args: any[]) => void;
    promise: Promise<{}>;
}
