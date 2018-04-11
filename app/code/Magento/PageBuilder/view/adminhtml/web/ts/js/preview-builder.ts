/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export default class PreviewBuilder {
    elementDataConverter;
    dataConverter;
    contentType;
    config;
    classInstance;

    public setElementDataConverter(converter)
    {
        this.elementDataConverter = converter;
        return this;
    }

    public setDataConverter(converter)
    {
        this.dataConverter = converter;
        return this;
    }

    public setContentType(contentType)
    {
        this.contentType = contentType;
        return this;
    }

    public setConfig(config)
    {
        this.config = config;
        return this;
    }

    public setClassInstance(classInstance)
    {
        this.classInstance = classInstance;
        return this;
    }

    public build()
    {
        return new this.classInstance(
            this.contentType,
            this.config,
            this.elementDataConverter,
            this.dataConverter
        );
    }
}

