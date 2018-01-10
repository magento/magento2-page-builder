/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export interface EventEmitterInterface {
    emit: Function;
    addListener: Function;
    on: Function;
    removeListener: Function;
    off: Function;
    once: Function;
}