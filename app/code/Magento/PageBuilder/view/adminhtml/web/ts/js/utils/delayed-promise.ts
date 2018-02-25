/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * Callback that will add a delay between chained Promises
 *
 * @param {number} delay
 * @returns {() => Promise<any>}
 */
export default function delayedPromise(delay: number): () => Promise<any> {
    return (value) => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(value), delay);
        });
    };
}
