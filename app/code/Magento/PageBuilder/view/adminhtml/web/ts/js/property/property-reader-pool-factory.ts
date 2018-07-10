/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadModule from "Magento_PageBuilder/js/utils/loader";
import Config from "../config";
import PropertyReaderPool from "./property-reader-pool";

/**
 * Create a new instance of property reader pool
 * @api
 */
export default function create(contentType: string): Promise<typeof PropertyReaderPool> {
    const config = Config.getContentTypeConfig(contentType);
    const propertyReaders: string[] = [];
    let appearanceName: string;
    for (appearanceName of Object.keys(config.appearances)) {
        const dataMapping = config.appearances[appearanceName].data_mapping;
        if (dataMapping !== undefined && dataMapping.elements !== undefined) {
            let elementName: string;
            for (elementName of Object.keys(dataMapping.elements)) {
                const element = dataMapping.elements[elementName];
                if (element.style !== undefined) {
                    for (const propertyConfig of element.style) {
                        if (!!propertyConfig.complex
                            && propertyConfig.reader
                            && propertyReaders.indexOf(propertyConfig.reader) === -1
                            && !PropertyReaderPool.get(propertyConfig.reader)
                        ) {
                            propertyReaders.push(propertyConfig.reader);
                        }
                    }
                }

                if (element.attributes !== undefined) {
                    for (const attributeConfig of element.attributes) {
                        if (!!attributeConfig.complex
                            && attributeConfig.reader
                            && propertyReaders.indexOf(attributeConfig.reader) === -1
                            && !PropertyReaderPool.get(attributeConfig.reader)
                        ) {
                            propertyReaders.push(attributeConfig.reader);
                        }
                    }
                }
            }
        }
    }

    return new Promise((resolve: (propertyReaderPool: typeof PropertyReaderPool) => void) => {
        loadModule(propertyReaders, (...loadedPropertyReaders: any[]) => {
            for (let i = 0; i < propertyReaders.length; i++) {
                PropertyReaderPool.register(propertyReaders[i], new loadedPropertyReaders[i]());
            }
            resolve(PropertyReaderPool);
        });
    });
}
