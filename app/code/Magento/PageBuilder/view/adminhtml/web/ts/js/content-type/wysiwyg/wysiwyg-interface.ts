/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {AdditionalDataConfigInterface} from "../../content-type-config";
import DataStore from "../../data-store";

/**
 * Provides an interface for the constructor of a WysiwygInterface object
 */
export interface WysiwygConstructorInterface {
    /**
     * @param {String} contentTypeId The ID in the registry of the content type.
     * @param {String} elementId The ID of the editor element in the DOM.
     * @param {String} contentTypeName The type of content type this editor will be used in. E.g. "banner".
     * @param {AdditionalDataConfigInterface} config The configuration for the wysiwyg.
     * @param {DataStore} dataStore The datastore to store the content in.
     * @param {String} fieldName The ket in the provided datastore to set the data.
     * @return {WysiwygInterface}
     */
    new (
        contentTypeId: string,
        elementId: string,
        contentTypeName: string,
        config: AdditionalDataConfigInterface,
        dataStore: DataStore,
        fieldName: string,
    ): WysiwygInterface;
}

/**
 * Describes an instance of a WYSIWYG component not specific to a specific editor
 */
export interface WysiwygInterface {
    contentTypeId: string;
    elementId: string;
    contentTypeName: string;
    config: AdditionalDataConfigInterface;

    /**
     * Retrieves the created component for the editor
     *
     * @return {WysiwygInstanceInterface}
     */
    getAdapter(): WysiwygInstanceInterface;
}

export default WysiwygInterface;
