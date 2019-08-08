/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../config";
import loadModule from "../utils/loader";
import PropertyReaderPool from "./property-reader-pool";

/**
 * Create a new instance of property reader pool
 */
export default function create(contentType: string): Promise<typeof PropertyReaderPool> {
    const config = Config.getContentTypeConfig(contentType);
    const propertyReaders: string[] = [];
    let appearanceName: string;
    for (appearanceName of Object.keys(config.appearances)) {
        const appearance = config.appearances[appearanceName];
        if (appearance !== undefined && appearance.elements !== undefined) {
            let elementName: string;
            for (elementName of Object.keys(appearance.elements)) {
                const element = appearance.elements[elementName];
                if (element.style !== undefined) {
                    for (const propertyConfig of element.style) {
                        if (propertyConfig.reader
                            && propertyReaders.indexOf(propertyConfig.reader) === -1
                            && !PropertyReaderPool.get(propertyConfig.reader)
                        ) {
                            propertyReaders.push(propertyConfig.reader);
                        }
                    }
                }

                if (element.attributes !== undefined) {
                    for (const attributeConfig of element.attributes) {
                        if (attributeConfig.reader
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
