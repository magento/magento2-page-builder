/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadModule from "Magento_PageBuilder/js/component/loader";
import Config from "../config";
import ElementConverterPool from "./element-converter-pool";

/**
 * Create a new instance of converter pool
 */
export default function create(contentType: string): Promise<> {
    const config = Config.getContentType(contentType);
    const converters = [];
    for (key in config.appearances) {
        const dataMapping = config.appearances[key].data_mapping;
        if (dataMapping !== undefined && dataMapping.elements !== undefined) {
            for (const elementName in dataMapping.elements) {
                if (dataMapping.elements[elementName].style !== undefined) {
                    for (let i = 0; i < dataMapping.elements[elementName].style.length; i++) {
                        const styleProperty = dataMapping.elements[elementName].style[i];
                        if (!!styleProperty.converter
                            && converters.indexOf(styleProperty.converter) === -1
                            && !ElementConverterPool.get(styleProperty.converter)
                        ) {
                            converters.push(styleProperty.converter);
                        }
                        if (!!styleProperty.preview_converter
                            && converters.indexOf(styleProperty.preview_converter) === -1
                            && !ElementConverterPool.get(styleProperty.preview_converter)
                        ) {
                            converters.push(styleProperty.preview_converter);
                        }
                    }
                }

                if (dataMapping.elements[elementName].attributes !== undefined) {
                    for (let i = 0; i < dataMapping.elements[elementName].attributes.length; i++) {
                        const attributeProperty = dataMapping.elements[elementName].attributes[i];
                        if (!!attributeProperty.converter
                            && converters.indexOf(attributeProperty.converter) === -1
                            && !ElementConverterPool.get(attributeProperty.converter)
                        ) {
                            converters.push(attributeProperty.converter);
                        }
                        if (!!attributeProperty.preview_converter
                            && converters.indexOf(attributeProperty.preview_converter) === -1
                            && !ElementConverterPool.get(attributeProperty.preview_converter)
                        ) {
                            converters.push(attributeProperty.preview_converter);
                        }
                    }
                }
            }
        }
    }

    return new Promise((resolve: (elementConverterPool: object) => void) => {
        loadModule(converters, (...loadedConverters: any[]) => {
            for (let i = 0; i < converters.length; i++) {
                ElementConverterPool.register(converters[i], new loadedConverters[i]());
            }
            resolve(ElementConverterPool);
        });
    });
}
