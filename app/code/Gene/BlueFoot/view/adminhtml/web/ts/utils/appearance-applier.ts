/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import {DataObject} from "../component/data-store";

export default class AppearanceApplier {
    /**
     * @param data
     * @returns {object}
     */
    getAppearanceData(data: DataObject): object {
        let attributes: any = {};

        const role =  data['name'] !== 'undefined' ? data['name'] : data['role'];

        if (role === 'column') {
            attributes['flex_grow'] = 1;
            if (data['appearance'] === 'top') {
                attributes['align_self'] = 'flex-start';
            }
            if (data['appearance'] === 'middle') {
                attributes['align_self'] = 'center';
            }
            if (data['appearance'] === 'bottom') {
                attributes['align_self'] = 'flex-end';
            }
        }

        return attributes;
    }
}
