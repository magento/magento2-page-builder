/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

interface DismissibleConfirmInterface {
    actions: object;
    content: string;
    dismissKey?: string;
    dismissible?: boolean;
    title: string;
    haveCancelButton?: boolean;
}

declare function DismissibleConfirm(config: DismissibleConfirmInterface): void;

declare module "Magento_PageBuilder/js/modal/dismissible-confirm" {
    export = DismissibleConfirm;
}
