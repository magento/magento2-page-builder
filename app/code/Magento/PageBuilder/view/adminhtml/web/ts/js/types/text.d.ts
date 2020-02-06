/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare let text: {
    load(name: string, req: () => {}, onLoad: () => {}): void;
    get(url: string, callback: () => {}, fail: () => {}, headers: {}): void;
};

declare module "mage/requirejs/text" {
    export = text;
}

declare module "text!*" {
    const content: string;
    export default content;
}
