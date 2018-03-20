/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadModule from "Magento_PageBuilder/js/component/loader";
import PropertyReaderPool from "./property-reader-pool"
import Config from "../config";

/**
 * Create a new instance of converter pool
 */
export default function create(contentType: string): Promise<> {
    const config = Config.getContentType(contentType);

    const properties = [];

    for (key in config.appearances) {
        const dataMapping = config.appearances[key].data_mapping;
        if (dataMapping !== undefined && dataMapping.elements !== undefined) {
            for (const elementName in dataMapping.elements) {
                if (dataMapping.elements[elementName].style !== undefined) {
                    for (let i = 0; i < dataMapping.elements[elementName].style.length; i++) {
                        const styleProperty = dataMapping.elements[elementName].style[i];
                        if (!!styleProperty.complex
                            && properties.indexOf(styleProperty.reader) == -1
                            && !PropertyReaderPool.get(styleProperty.reader)
                        ) {
                            properties.push(styleProperty.reader);
                        }
                    }
                }

                if (dataMapping.elements[elementName].attributes !== undefined) {
                    for (let i = 0; i < dataMapping.elements[elementName].attributes.length; i++) {
                        const attributeProperty = dataMapping.elements[elementName].attributes[i];
                        if (!!attributeProperty.complex
                            && properties.indexOf(attributeProperty.reader) == -1
                            && !PropertyReaderPool.get(attributeProperty.reader)
                        ) {
                            properties.push(attributeProperty.reader);
                        }
                    }
                }
            }
        }
    }

    return new Promise((resolve: (PropertyReaderPool: object) => void) => {
        loadModule(properties, (...loadedProperties: any[]) => {
            for (let i = 0; i < properties.length; i++) {
                PropertyReaderPool.register(properties[i], new loadedProperties[i]());
            }
            resolve(PropertyReaderPool);
        });
    });
}
