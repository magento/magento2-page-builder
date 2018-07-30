/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ConfigFieldInterface from "./config-field.d";

/**
 * @api
 */
export default interface ContentTypeConfigInterface {
    name: string;
    label: string;
    icon: string;
    form: string;
    contentType: string;
    group: string;
    fields: ConfigFieldInterface;
    preview_template: string;
    render_template: string;
    preview_component: string;
    master_component: string;
    component: string;
    appearances: {
        [key: string]: ContentTypeConfigAppearanceInterface;
    };
    readers: string[];
    allowed_parents: string[];
    is_visible: boolean;
    concealable: boolean;
}

export interface ContentTypeConfigAppearanceInterface {
    readers: string[];
    data_mapping: DataMappingInterface;
    preview_template: string;
    render_template: string;
    render: string;
    default: string;
    form: string;
}

export interface DataMappingInterface {
    path: string;
    converters: ConverterInterface[];
    elements: {
        [key: string]: {
            style: DataMappingStyleInterface[];
            attributes: DataMappingAttributesInterface[];
            html: DataMappingHtmlInterface;
            css: DataMappingCssInterface[];
            tag: DataMappingTagInterface[];
        };
    };
}

export interface ConverterInterface {
    name: string;
    component: string;
    config: {
        [key: string]: string;
    };
}

export interface DataMappingStyleInterface {
    var?: string;
    name: string;
    reader?: string;
    value?: string;
    converter?: string;
    preview_converter?: string;
    virtual?: string;
    persist?: string;
    complex?: boolean;
    static?: boolean;
}

export interface DataMappingAttributesInterface {
    var?: string;
    name: string;
    reader?: string;
    value?: string;
    converter?: string;
    preview_converter?: string;
    virtual?: string;
    persist?: string;
    complex?: boolean;
    static?: boolean;
}

export interface DataMappingHtmlInterface {
    var: string;
    converter: string;
    preview_converter: string;
}

export interface DataMappingCssInterface {
    var: string;
    converter: string;
    filter: string[];
}

export interface DataMappingTagInterface {
    var: string;
    converter: string;
}
