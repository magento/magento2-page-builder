import {ContentTypeConfigAppearanceElementInterface} from "../content-type-config.types";
import ConverterPool from "../converter/converter-pool";
import {DataObject} from "../data-store";

/**
 * Copyright 2019 Adobe
 * All Rights Reserved.
 */
/// <reference types="knockout" />

export default interface ObservableObject {
    [key: string]: {
        [key: string]: KnockoutObservable<any>;
    };
}

export interface GeneratedElementsData {
    [key: string]: Record<string, {}>;
    appearance?: any;
}

export type BindingGenerator = (
    elementName: string,
    config: ContentTypeConfigAppearanceElementInterface,
    data: DataObject,
    converterResolver: (config: object) => string,
    converterPool: typeof ConverterPool,
    previousData: Record<string, any>,
) => Record<string, any> | string;
