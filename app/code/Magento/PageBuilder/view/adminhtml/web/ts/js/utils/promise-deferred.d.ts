/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * Interface for deferred promise
 *
 * @api
 */
export default interface DeferredInterface {
    resolve: (...args: any[]) => void;
    reject: (...args: any[]) => void;
    promise: Promise<{}>;
}
