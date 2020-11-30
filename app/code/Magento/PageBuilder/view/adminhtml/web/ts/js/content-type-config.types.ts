/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */
export default interface ContentTypeConfigInterface {
    name: string;
    label: string;
    icon: string;
    form: string;
    group: string;
    fields: ConfigFieldInterface;
    preview_component: string;
    master_component: string;
    component: string;
    appearances: {
        [key: string]: ContentTypeConfigAppearanceInterface;
    };
    allowed_parents: string[];
    is_system: boolean;
    breakpoints: ContentTypeConfigBreakpointsInterface;
    additional_data: AdditionalDataConfigInterface;
}

export interface ConfigFieldInterface {
    [key: string]: {
        default: string;
        [key: string]: ConfigFieldInterface | any;
    };
}

export interface ContentTypeConfigAppearanceElementInterface {
    style: DataMappingStyleInterface[];
    attributes: DataMappingAttributesInterface[];
    html: DataMappingHtmlInterface;
    css: DataMappingCssInterface;
    tag: DataMappingTagInterface;
}

export interface ContentTypeConfigAppearanceInterface {
    breakpoints: ContentTypeConfigBreakpointsInterface;
    reader: string;
    path: string;
    converters: ConverterInterface[];
    elements: ContentTypeConfigAppearanceElementsInterface;
    preview_template: string;
    master_template: string;
    render: string;
    default: string;
    form: string;
}

export interface ContentTypeConfigBreakpointsInterface {
    [key: string]: ContentTypeConfigBreakpointInterface;
}

export interface ContentTypeConfigBreakpointInterface {
    form: string;
    fields: ConfigFieldInterface;
}

export interface ContentTypeConfigAppearanceElementsInterface {
    [key: string]: ContentTypeConfigAppearanceElementInterface;
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
    persistence_mode?: string;
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
    persistence_mode?: string;
    complex?: boolean;
    static?: boolean;
}

export interface DataMappingInterface {
    converter: string;
    preview_converter: string;
    var: string;
}

export interface DataMappingHtmlInterface extends DataMappingInterface {
    placeholder: string;
}

export interface DataMappingCssInterface extends DataMappingInterface {
    filter: string[];
}

export interface DataMappingTagInterface extends DataMappingInterface {

}

export interface AdditionalDataConfigInterface {
    [key: string]: any;
}
