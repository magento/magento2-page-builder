/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import loadModule from "Magento_PageBuilder/js/utils/loader";
import {AdditionalDataConfigInterface} from "../content-type-config";
import DataStore from "../data-store";
import Wysiwyg from "./tinymce4";
import WysiwygInterface, {WysiwygConstructorInterface} from "./wysiwyg-interface";
import ContentTypeInterface from "../content-type.d";

/**
 * @param {ContentTypeInterface} contentType The content type in the registry.
 * @param {String} elementId The ID of the editor element in the DOM.
 * @param {String} contentTypeName The type of content type this editor will be used in. E.g. "banner".
 * @param {AdditionalDataConfigInterface} config The configuration for the wysiwyg.
 * @param {DataStore} dataStore The datastore to store the content in.
 * @param {String} fieldName The key in the provided datastore to set the data.
 * @returns {Wysiwyg}
 */
export default function create(
    contentType: ContentTypeInterface,
    elementId: string,
    contentTypeName: string,
    config: AdditionalDataConfigInterface,
    dataStore: DataStore,
    fieldName: string,
): Promise<WysiwygInterface> {
    config = $.extend(true, {}, config);

    return new Promise((resolve: (WysiwygInstance: WysiwygInterface) => void) => {
        loadModule([config.adapter_config.component], (WysiwygInstance: WysiwygConstructorInterface) => {
            new Promise((configResolve: () => void): void => {
                if (config.adapter_config.config_modifiers
                    && config.adapter_config.config_modifiers[contentTypeName]
                ) {
                    loadModule(
                        [config.adapter_config.config_modifiers[contentTypeName]],
                        (ConfigModifierType: any) => {
                            const modifier = new ConfigModifierType();
                            // Allow dynamic settings to be set before editor is initialized
                            modifier.modify(contentType.id, config);
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
                    contentType.id,
                    elementId,
                    config,
                    dataStore,
                    fieldName,
                    contentType.stageId
                );

                if (config.adapter_config.component_initializers
                    && config.adapter_config.component_initializers[contentTypeName]
                ) {
                    loadModule(
                        [config.adapter_config.component_initializers[contentTypeName]],
                        (InitializerType: any) => {
                            const initializer = new InitializerType();
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
