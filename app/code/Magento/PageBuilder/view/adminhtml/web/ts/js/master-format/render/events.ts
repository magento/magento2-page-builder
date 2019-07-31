/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * The frame does not need to create or observe events, however the app will naturally attempt too. So let's stop that!
 */
export default {
    on() {
        return this;
    },
    off() {
        return this;
    },
    trigger() {
        return this;
    },
};
