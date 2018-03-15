/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export default class ElementConverterPool {
    private styleConverters: object;
    private styleConvertersPreview: object;
    private attributeConverters: object;

    constructor(styleConverters: object, styleConvertersPreview: object, attributeConverters: object) {
        this.styleConverters = styleConverters;
        this.styleConvertersPreview = styleConvertersPreview;
        this.attributeConverters = attributeConverters;
    }

    public getStyleConverters() {
        return this.styleConverters;
    }

    public getStylePreviewConverters() {
        return this.styleConvertersPreview;
    }

    public getAttributeConverters() {
        return this.attributeConverters;
    }
}
