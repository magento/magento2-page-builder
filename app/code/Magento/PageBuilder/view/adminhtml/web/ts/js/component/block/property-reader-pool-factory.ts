/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadModule from "Magento_PageBuilder/js/component/loader";
import Config from "../config";
import PropertyReaderPool from "./property-reader-pool";

/**
 * Create a new instance of property reader pool
 */
export default function create(contentType: string): Promise<> {
    const config = Config.getContentType(contentType);

    const propertyReaders = [];

    for (key in config.appearances) {
        const dataMapping = config.appearances[key].data_mapping;
        if (dataMapping !== undefined && dataMapping.elements !== undefined) {
            for (const elementName in dataMapping.elements) {
                if (dataMapping.elements[elementName].style !== undefined) {
                    for (let i = 0; i < dataMapping.elements[elementName].style.length; i++) {
                        const styleProperty = dataMapping.elements[elementName].style[i];
                        if (!!styleProperty.complex
                            && styleProperty.reader
                            && propertyReaders.indexOf(styleProperty.reader) === -1
                            && !PropertyReaderPool.get(styleProperty.reader)
                        ) {
                            propertyReaders.push(styleProperty.reader);
                        }
                    }
                }

                if (dataMapping.elements[elementName].attributes !== undefined) {
                    for (let i = 0; i < dataMapping.elements[elementName].attributes.length; i++) {
                        const attributeProperty = dataMapping.elements[elementName].attributes[i];
                        if (!!attributeProperty.complex
                            && attributeProperty.reader
                            && propertyReaders.indexOf(attributeProperty.reader) === -1
                            && !PropertyReaderPool.get(attributeProperty.reader)
                        ) {
                            propertyReaders.push(attributeProperty.reader);
                        }
                    }
                }
            }
        }
    }

    return new Promise((resolve: (PropertyReaderPool: object) => void) => {
        loadModule(propertyReaders, (...loadedPropertyReaders: any[]) => {
            for (let i = 0; i < propertyReaders.length; i++) {
                PropertyReaderPool.register(propertyReaders[i], new loadedPropertyReaders[i]());
            }
            resolve(PropertyReaderPool);
        });
    });
}
