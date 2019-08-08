/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

interface EventBusInterface {
    attachEventHandler(eventName: string, handler: () => any): void;
}

interface WysiwygSetupInterface {
    eventBus: EventBusInterface;
    wysiwygInstance: WysiwygInstanceInterface;
    setup(mode: string): void;
}

interface WysiwygInstanceInterface {
    id: string;
    eventBus: EventBusInterface;
    getContent(): string;
    setContent(content: string): void;
}

declare var WysiwygSetup: {
    prototype: WysiwygSetupInterface;
    new (id: string, config: object): WysiwygSetupInterface;
};

declare var WysiwygInstanceInterface: {
    prototype: WysiwygInstanceInterface;
    new (id: string, config: object): WysiwygInstanceInterface
};

declare module "mage/adminhtml/wysiwyg/tiny_mce/setup" {
    export = WysiwygSetup;
}

declare module "wysiwygAdapter" {
    export = WysiwygInstanceInterface;
}
