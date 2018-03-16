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
export default function create(contentType: string): Promise<{}> {
    return new Promise((resolve: (elementConverterPool: any) => void) => {

        const styleMapperCodes: string[] = [];
        const styleMappers: string[] = [];
        const styleMapperPreviewCodes: string[] = [];
        const styleMappersPreview: string[] = [];
        const attributeMapperCodes: string[] = [];
        const attributeMappers: string[] = [];
        const attributeMapperPreviewCodes: string[] = [];
        const attributeMappersPreview: string[] = [];

        const config = appearanceConfig(contentType, undefined);

        if (config.data_mapping !== undefined && config.data_mapping.elements !== undefined) {
            for (const el in config.data_mapping.elements) {
                if (config.data_mapping.elements[el].style !== undefined) {
                    for (let i = 0; i < config.data_mapping.elements[el].style.length; i++) {
                        const styleProperty = config.data_mapping.elements[el].style[i];
                        if ((styleProperty.converter !== "" && styleProperty.converter !== null)
                            || (styleProperty.preview_converter !== "" && styleProperty.preview_converter !== null)
                        ) {
                            const mapper = styleProperty.converter !== "" && styleProperty.converter !== null
                                ? styleProperty.converter
                                : null;
                            styleMapperCodes.push(styleProperty.var + styleProperty.name);
                            styleMappers.push(mapper);

                            const mapperPreview = styleProperty.preview_converter !== "" && styleProperty.preview_converter !== null
                                ? styleProperty.preview_converter
                                : (mapper ? mapper : null);
                            styleMapperPreviewCodes.push(styleProperty.var + styleProperty.name);
                            styleMappersPreview.push(mapperPreview);
                        }
                    }
                }

                if (config.data_mapping.elements[el].attributes !== undefined) {
                    for (let i = 0; i < config.data_mapping.elements[el].attributes.length; i++) {
                        const attributeProperty = config.data_mapping.elements[el].attributes[i];
                        if ((attributeProperty.converter !== "" && attributeProperty.converter !== null)
                            || (attributeProperty.preview_converter !== "" && attributeProperty.preview_converter !== null)
                        ) {
                            const mapper = attributeProperty.converter !== "" && attributeProperty.converter !== null
                                ? attributeProperty.converter
                                : null;
                            attributeMapperCodes.push(attributeProperty.var + attributeProperty.name);
                            attributeMappers.push(mapper);

                            const mapperPreview = attributeProperty.preview_converter !== "" && attributeProperty.preview_converter !== null
                                ? attributeProperty.preview_converter
                                : (mapper ? mapper : null);
                            attributeMapperPreviewCodes.push(attributeProperty.var + attributeProperty.name);
                            attributeMappersPreview.push(mapperPreview);
                        }
                    }
                }
            }
        }

        const styleMappersLoadedPromise = new Promise((resolve: (data: object) => void) => {
            loadModule(styleMappers, (...styleMappersLoaded: any[]) => {
                const result: any = {};
                for (let i = 0; i < styleMapperCodes.length; i++) {
                    result[styleMapperCodes[i]] = new styleMappersLoaded[i]();
                }
                resolve(result);
            });
        });

        const styleMappersPreviewLoadedPromise = new Promise((resolve: (data: object) => void) => {
            loadModule(styleMappersPreview, (...styleMappersPreviewLoaded: any[]) => {
                const result: any = {};
                for (let i = 0; i < styleMapperPreviewCodes.length; i++) {
                    result[styleMapperPreviewCodes[i]] = new styleMappersPreviewLoaded[i]();
                }
                resolve(result);
            });
        });

        const attributeMappersLoadedPromise = new Promise((resolve: (data: object) => void) => {
            loadModule(attributeMappers, (...attributeMappersLoaded: any[]) => {
                const result: any = {};
                for (let i = 0; i < attributeMapperCodes.length; i++) {
                    result[attributeMapperCodes[i]] = new attributeMappersLoaded[i]();
                }
                resolve(result);
            });
        });

        const attributeMappersPreviewLoadedPromise = new Promise((resolve: (data: object) => void) => {
            loadModule(attributeMappersPreview, (...attributeMappersPreviewLoaded: any[]) => {
                const result: any = {};
                for (let i = 0; i < attributeMapperPreviewCodes.length; i++) {
                    result[attributeMapperPreviewCodes[i]] = new attributeMappersPreviewLoaded[i]();
                }
                resolve(result);
            });
        });

        const mappersLoaded: Array<Promise<any>> = [];
        mappersLoaded.push(styleMappersLoadedPromise);
        mappersLoaded.push(styleMappersPreviewLoadedPromise);
        mappersLoaded.push(attributeMappersLoadedPromise);
        mappersLoaded.push(attributeMappersPreviewLoadedPromise);

        Promise.all(mappersLoaded).then((loadedMappers) => {
            const [styleMappers, styleMappersPreview, attributeMappers, attributeMappersPreview] = loadedMappers;
            resolve(new ElementConverterPool(styleMappers, styleMappersPreview, attributeMappers, attributeMappersPreview));
        }).catch((error) => {
            console.error( error );
        });
    });
}
