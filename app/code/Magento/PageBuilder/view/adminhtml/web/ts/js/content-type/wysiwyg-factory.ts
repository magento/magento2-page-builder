/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import loadModule from "Magento_PageBuilder/js/utils/loader";
import {AdditionalDataConfigInterface} from "../content-type-config";
import DataStore from "../data-store";
import Wysiwyg from "./wysiwyg";
import {WysiwygConstructableInterface, WysiwygInterface} from "./wysiwyg-interface";

/**
 *
 * @param {string} contentTypeId
 * @param {string} elementId
 * @param {String} contentTypeName
 * @param {AdditionalDataConfigInterface} config
 * @param {DataStore} dataStore
 * @returns {Wysiwyg}
 * @api
 */
export default function create(
    contentTypeId: string,
    elementId: string,
    contentTypeName: string,
    config: AdditionalDataConfigInterface,
    dataStore: DataStore,
): Promise<WysiwygInterface> {
    config = $.extend(true, {}, config);

    return new Promise((resolve: (WysiwygInstance: WysiwygInterface) => void) => {
        loadModule([config.additional.component], (WysiwygInstance: WysiwygConstructableInterface) => {
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
                            initializer.initializeConfig(contentTypeId, config);
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
                            initializer.initializeComponent(wysiwyg);
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
