/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
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
