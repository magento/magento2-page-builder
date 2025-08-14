/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
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
