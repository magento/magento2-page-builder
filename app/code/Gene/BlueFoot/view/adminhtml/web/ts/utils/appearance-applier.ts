/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from 'underscore';

import {DataObject} from "../component/data-store";
import Config from "../component/config";

export default class AppearanceApplier {
    // Content types config
    contentTypesConfig: any = Config.getInitConfig('contentTypes');

    /**
     * @param data
     * @returns {object}
     */
    apply(data: DataObject): object {
        let appearanceData = {};
        const role: string =  data['name'] !== 'undefined' ? data['name'] : data['role'];

        if (data['appearance'] !== undefined && this.contentTypesConfig[role]['loaded_appearances'] !== undefined) {
            appearanceData = this.contentTypesConfig[role]['loaded_appearances'][data['appearance']].getData();
        }
        _.extend(data, appearanceData);
        return data;
    }
}
