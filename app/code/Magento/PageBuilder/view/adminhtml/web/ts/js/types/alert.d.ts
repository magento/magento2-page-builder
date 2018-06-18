/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

interface AlertConfig {
    content: string;
    title: string;
}

declare function Alert(config: AlertConfig): void;

declare module "Magento_Ui/js/modal/alert" {
    export = Alert;
}
