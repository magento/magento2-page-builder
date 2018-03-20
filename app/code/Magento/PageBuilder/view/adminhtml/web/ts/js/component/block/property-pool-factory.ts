/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadModule from "Magento_PageBuilder/js/component/loader";
import PropertyPool from "./property-pool"
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
                            && properties.indexOf(styleProperty.component) == -1
                            && !PropertyPool.getProperty(styleProperty.component)
                        ) {
                            properties.push(styleProperty.component);
                        }
                    }
                }

                if (dataMapping.elements[elementName].attributes !== undefined) {
                    for (let i = 0; i < dataMapping.elements[elementName].attributes.length; i++) {
                        const attributeProperty = dataMapping.elements[elementName].attributes[i];
                        if (!!attributeProperty.complex
                            && properties.indexOf(attributeProperty.component) == -1
                            && !PropertyPool.getProperty(attributeProperty.component)
                        ) {
                            properties.push(attributeProperty.component);
                        }
                    }
                }
            }
        }
    }

    return new Promise((resolve: (PropertyPool: object) => void) => {
        loadModule(properties, (...loadedProperties: any[]) => {
            for (let i = 0; i < properties.length; i++) {
                PropertyPool.registerProperty(properties[i], new loadedProperties[i]());
            }
            resolve(PropertyPool);
        });
    });
}
