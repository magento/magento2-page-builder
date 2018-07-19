/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */
export default interface DeferredInterface {
    resolve: () => void;
    reject: () => void;
    promise: Promise<{}>;
}
