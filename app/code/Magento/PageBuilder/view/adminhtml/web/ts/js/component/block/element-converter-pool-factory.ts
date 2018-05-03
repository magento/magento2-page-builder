/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadModule from "Magento_PageBuilder/js/loader";
import Config from "../../config";
import ElementConverterPool from "./element-converter-pool";

/**
 * Create a new instance of converter pool
 */
export default function create(contentType: string): Promise<> {
    const config = Config.getContentTypeConfig(contentType);
    const converters = [];
    for (const appearanceName: string of Object.keys(config.appearances)) {
        const dataMapping = config.appearances[appearanceName].data_mapping;
        if (dataMapping !== undefined && dataMapping.elements !== undefined) {
            for (const elementName: string of Object.keys(dataMapping.elements)) {
                if (dataMapping.elements[elementName].style !== undefined) {
                    for (const propertyConfig of dataMapping.elements[elementName].style) {
                        if (!!propertyConfig.converter
                            && converters.indexOf(propertyConfig.converter) === -1
                            && !ElementConverterPool.get(propertyConfig.converter)
                        ) {
                            converters.push(propertyConfig.converter);
                        }
                        if (!!propertyConfig.preview_converter
                            && converters.indexOf(propertyConfig.preview_converter) === -1
                            && !ElementConverterPool.get(propertyConfig.preview_converter)
                        ) {
                            converters.push(propertyConfig.preview_converter);
                        }
                    }
                }

                if (dataMapping.elements[elementName].attributes !== undefined) {
                    for (const attributeConfig of dataMapping.elements[elementName].attributes) {
                        if (!!attributeConfig.converter
                            && converters.indexOf(attributeConfig.converter) === -1
                            && !ElementConverterPool.get(attributeConfig.converter)
                        ) {
                            converters.push(attributeConfig.converter);
                        }
                        if (!!attributeConfig.preview_converter
                            && converters.indexOf(attributeConfig.preview_converter) === -1
                            && !ElementConverterPool.get(attributeConfig.preview_converter)
                        ) {
                            converters.push(attributeConfig.preview_converter);
                        }
                    }
                }

                if (dataMapping.elements[elementName].html !== undefined) {
                    const htmlConfig = dataMapping.elements[elementName].html;
                    if (!!htmlConfig.converter
                        && converters.indexOf(htmlConfig.converter) === -1
                        && !ElementConverterPool.get(htmlConfig.converter)
                    ) {
                        converters.push(htmlConfig.converter);
                    }

                    if (!!htmlConfig.preview_converter
                        && converters.indexOf(htmlConfig.preview_converter) === -1
                        && !ElementConverterPool.get(htmlConfig.preview_converter)
                    ) {
                        converters.push(htmlConfig.preview_converter);
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
