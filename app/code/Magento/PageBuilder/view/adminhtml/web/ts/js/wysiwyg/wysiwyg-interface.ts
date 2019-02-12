/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {AdditionalDataConfigInterface} from "../content-type-config.types";
import DataStore from "../data-store";

/**
 * Provides an interface for the constructor of a WysiwygInterface object
 */
export type WysiwygConstructorInterface = new (
        contentTypeId: string,
        elementId: string,
        config: AdditionalDataConfigInterface,
        dataStore: DataStore,
        fieldName: string,
        stageId: string,
    ) => WysiwygInterface;

/**
 * Describes an instance of a WYSIWYG component not specific to a specific editor
 */
export interface WysiwygInterface {
    contentTypeId: string;
    stageId: string;
    elementId: string;
    config: AdditionalDataConfigInterface;

    /**
     * Retrieves the created component for the editor
     *
     * @return {WysiwygInstanceInterface}
     */
    getAdapter(): WysiwygInstanceInterface;
}

export default WysiwygInterface;
