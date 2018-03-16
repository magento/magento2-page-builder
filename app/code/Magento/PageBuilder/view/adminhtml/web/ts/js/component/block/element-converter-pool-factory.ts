/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadModule from "Magento_PageBuilder/js/component/loader";
import ElementConverterPool from "./element-converter-pool"
import appearanceConfig from "./appearance-config";

/**
 * Create a new instance of element converter pool
 */
export default function create(contentType: string): Promise<> {
    return new Promise((resolve: (elementConverterPool) => void) => {

        const styleMapperCodes = [];
        const styleMappers = [];
        const styleMapperPreviewCodes = [];
        const styleMappersPreview = [];
        const attributeMapperCodes = [];
        const attributeMappers = [];

        const config = appearanceConfig(contentType, undefined);

        if (config.data_mapping !== undefined && config.data_mapping.elements !== undefined) {
            for (let el in config.data_mapping.elements) {
                if (config.data_mapping.elements[el].style !== undefined) {
                    for (let i = 0; i < config.data_mapping.elements[el].style.length; i++) {
                        let styleProperty = config.data_mapping.elements[el].style[i];
                        if ((styleProperty.converter !== '' && styleProperty.converter !== null)
                            || (styleProperty.preview_converter !== '' && styleProperty.preview_converter !== null)
                        ) {
                            const mapper = styleProperty.converter !== '' && styleProperty.converter !== null
                                ? styleProperty.converter
                                : null;
                            styleMapperCodes.push(styleProperty.var + styleProperty.name);
                            styleMappers.push(mapper);

                            const mapperPreview = styleProperty.preview_converter !== '' && styleProperty.preview_converter !== null
                                ? styleProperty.preview_converter
                                : (mapper ? mapper : null);
                            styleMapperPreviewCodes.push(styleProperty.var + styleProperty.name);
                            styleMappersPreview.push(mapperPreview);
                        }
                    }
                }

                if (config.data_mapping.elements[el].attributes !== undefined) {
                    for (let i = 0; i < config.data_mapping.elements[el].attributes.length; i++) {
                        let attribute = config.data_mapping.elements[el].attributes[i];
                        if (attribute.converter !== '' && attribute.converter !== null) {
                            attributeMapperCodes.push(attribute.var + attribute.name);
                            attributeMappers.push(attribute.converter);
                        }
                    }
                }
            }
        }

        const styleMappersLoadedPromise = new Promise((resolve: (data: object) => void) => {
            loadModule(styleMappers, (...styleMappersLoaded: any[]) => {
                const result = {};
                for (let i = 0; i < styleMapperCodes.length; i++) {
                    result[styleMapperCodes[i]] = new styleMappersLoaded[i]();
                }
                resolve(result);
            });
        });

        const styleMappersPreviewLoadedPromise = new Promise((resolve: (data: object) => void) => {
            loadModule(styleMappersPreview, (...styleMappersPreviewLoaded: any[]) => {
                const result = {};
                for (let i = 0; i < styleMapperPreviewCodes.length; i++) {
                    result[styleMapperPreviewCodes[i]] = new styleMappersPreviewLoaded[i]();
                }
                resolve(result);
            });
        });

        const attributeMappersLoadedPromise = new Promise((resolve: (data: object) => void) => {
            loadModule(attributeMappers, (...attributeMappersLoaded: any[]) => {
                const result = {};
                for (let i = 0; i < attributeMapperCodes.length; i++) {
                    result[attributeMapperCodes[i]] = new attributeMappersLoaded[i]();
                }
                resolve(result);
            });
        });

        const meppersLoaded: Array<Promise<any>> = [];
        meppersLoaded.push(styleMappersLoadedPromise);
        meppersLoaded.push(styleMappersPreviewLoadedPromise);
        meppersLoaded.push(attributeMappersLoadedPromise);

        Promise.all(meppersLoaded).then((loadedMappers) => {
            const [styleMappers, styleMappersPreview, attributeMappers] = loadedMappers;
                resolve(new ElementConverterPool(styleMappers, styleMappersPreview, attributeMappers));
        }).catch((error) => {
            console.error( error );
        });
    });
}
