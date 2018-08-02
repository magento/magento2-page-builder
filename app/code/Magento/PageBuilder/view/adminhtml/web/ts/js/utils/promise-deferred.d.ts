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
    resolve: () => void;
    reject: () => void;
    promise: Promise<{}>;
}
