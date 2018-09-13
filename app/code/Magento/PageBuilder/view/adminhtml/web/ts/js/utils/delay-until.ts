/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * Delay until a condition is met
 *
 * @param {() => void} callback
 * @param {() => boolean} condition
 * @param {number} interval
 */
export default function delayUntil(
    callback: () => void,
    condition: () => boolean,
    interval: number = 50,
) {
    const delayInterval = setInterval(() => {
        if (condition()) {
            clearInterval(delayInterval);
            callback();
        }
    }, interval);
}
