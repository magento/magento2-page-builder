/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

interface WidgetIntializerConfigInterface {
    currentViewport: any;
    config: any;
    breakpoints: any;
}

declare function WidgetInitializer(data: WidgetIntializerConfigInterface, contextElement?: HTMLElement): void;

declare module "Magento_PageBuilder/js/widget-initializer" {
    export = WidgetInitializer;
}
