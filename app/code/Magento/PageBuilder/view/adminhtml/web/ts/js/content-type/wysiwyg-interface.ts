/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {AdditionalDataConfigInterface} from "../content-type-config";
import DataStore from "../data-store";

export interface WysiwygConstructableInterface {
    /**
     * @param {String} contentTypeId
     * @param {String} elementId
     * @param {String} contentTypeName
     * @param {AdditionalDataConfigInterface} config
     * @param {DataStore} dataStore
     */
    new (
        contentTypeId: string,
        elementId: string,
        contentTypeName: string,
        config: AdditionalDataConfigInterface,
        dataStore: DataStore,
    ): WysiwygInterface;
}
export interface WysiwygInterface {
    contentTypeId: string;
    elementId: string;
    contentTypeName: string;
    config: AdditionalDataConfigInterface;
    dataStore: DataStore;
    getAdapter(): WysiwygInstanceInterface;
}
