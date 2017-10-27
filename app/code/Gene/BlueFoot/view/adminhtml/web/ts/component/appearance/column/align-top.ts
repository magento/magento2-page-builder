/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export default class AlignTop {
    /**
     * @returns {object}
     */
    getData(): object {
        return {flex_grow: 1, align_self: 'flex-start'};
    }
}
