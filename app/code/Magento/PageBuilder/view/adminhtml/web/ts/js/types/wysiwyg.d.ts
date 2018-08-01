/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

interface EventBus {
    attachEventHandler(eventName: string, handler: () => any): void;
}

interface WysiwygSetup {
    eventBus: EventBus,
    setup(mode: string): void,
    wysiwygInstance: WysiwygInstance
}

interface WysiwygInstance {
    eventBus: EventBus,
    EVENT: any,
    getContent(): string,
    setContent(content: string): void
}

declare var WysiwygSetup: {
    prototype: WysiwygSetup;
    new (id: string, config: object): WysiwygSetup;
};

declare var WysiwygInstance: {
    prototype: WysiwygInstance;
    new (id: string, config: object): WysiwygInstance
};

declare module "mage/adminhtml/wysiwyg/tiny_mce/setup" {
    export = WysiwygSetup;
}

declare module "wysiwygAdapter" {
    export = WysiwygInstance;
}