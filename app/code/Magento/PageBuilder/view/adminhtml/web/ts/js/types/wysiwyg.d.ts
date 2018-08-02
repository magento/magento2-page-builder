/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

interface EventBusInterface {
    attachEventHandler(eventName: string, handler: () => any): void;
}

interface WysiwygSetupInterface {
    eventBus: EventBusInterface,
    setup(mode: string): void,
    wysiwygInstance: WysiwygInstanceInterface
}

interface WysiwygInstanceInterface {
    eventBus: EventBusInterface,
    getContent(): string,
    setContent(content: string): void
}

declare var WysiwygSetupInterface: {
    prototype: WysiwygSetupInterface;
    new (id: string, config: object): WysiwygSetupInterface;
};

declare var WysiwygInstance: {
    prototype: WysiwygInstanceInterface;
    new (id: string, config: object): WysiwygInstanceInterface
};

declare module "mage/adminhtml/wysiwyg/tiny_mce/setup" {
    export = WysiwygSetupInterface;
}

declare module "wysiwygAdapter" {
    export = WysiwygInstanceInterface;
}