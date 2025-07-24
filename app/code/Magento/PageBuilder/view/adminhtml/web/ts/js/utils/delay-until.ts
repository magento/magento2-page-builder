/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
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
