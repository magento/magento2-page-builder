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
    getContent(): string,
    setContent(content: string): void,
}

declare var WysiwygSetup: {
    prototype: WysiwygSetup;
    new (id: string, config: object): WysiwygSetup;
};

declare module "mage/adminhtml/wysiwyg/tiny_mce/setup" {
    export = WysiwygSetup;
}
