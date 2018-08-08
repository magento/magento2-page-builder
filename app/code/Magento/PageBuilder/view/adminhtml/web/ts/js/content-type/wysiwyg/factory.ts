/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import loadModule from "Magento_PageBuilder/js/utils/loader";
import {AdditionalDataConfigInterface} from "../../content-type-config";
import DataStore from "../../data-store";
import Wysiwyg from "./tinymce4";
import WysiwygInterface, {WysiwygConstructorInterface} from "./wysiwyg-interface";

/**
 * @param {String} contentTypeId The ID in the registry of the content type.
 * @param {String} elementId The ID of the editor element in the DOM.
 * @param {String} contentTypeName The type of content type this editor will be used in. E.g. "banner".
 * @param {AdditionalDataConfigInterface} config The configuration for the wysiwyg.
 * @param {DataStore} dataStore The datastore to store the content in.
 * @param {String} fieldName The ket in the provided datastore to set the data.
 * @returns {Wysiwyg}
 * @api
 */
export default function create(
    contentTypeId: string,
    elementId: string,
    contentTypeName: string,
    config: AdditionalDataConfigInterface,
    dataStore: DataStore,
    fieldName: string,
): Promise<WysiwygInterface> {
    config = $.extend(true, {}, config);

    return new Promise((resolve: (WysiwygInstance: WysiwygInterface) => void) => {
        loadModule([config.additional.component], (WysiwygInstance: WysiwygConstructorInterface) => {
            new Promise((configResolve: () => void): void => {
                if (config.additional.initializers
                    && config.additional.initializers.config
                    && config.additional.initializers.config[contentTypeName]
                ) {
                    loadModule(
                        [config.additional.initializers.config[contentTypeName]],
                        (InitializerInstance: any) => {
                            const initializer = new InitializerInstance();
                            // Allow dynamic settings to be set before editor is initialized
                            initializer.initialize(contentTypeId, config);
                            configResolve();
                        },
                    );
                }
                else {
                    configResolve();
                }
            }).then(() => {
                // Instantiate the component
                const wysiwyg = new WysiwygInstance(
                    contentTypeId,
                    elementId,
                    contentTypeName,
                    config,
                    dataStore,
                    fieldName,
                );

                if (config.additional.initializers
                    && config.additional.initializers.component
                    && config.additional.initializers.component[contentTypeName]
                ) {
                    loadModule(
                        [config.additional.initializers.component[contentTypeName]],
                        (InitializerInstance: any) => {
                            const initializer = new InitializerInstance();
                            // Allow dynamic bindings from configuration such as events from the editor
                            initializer.initialize(wysiwyg);
                            resolve(wysiwyg);
                        },
                    );
                }
                else {
                    resolve(wysiwyg);
                }
            });
        });
    });
}
