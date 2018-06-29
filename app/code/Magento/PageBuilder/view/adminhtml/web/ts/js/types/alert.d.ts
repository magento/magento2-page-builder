/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

interface AlertConfigInterface {
    content: string;
    title: string;
}

declare function Alert(config: AlertConfigInterface): void;

declare module "Magento_Ui/js/modal/alert" {
    export = Alert;
}
