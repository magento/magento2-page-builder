/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

interface NestLinkDialogInterface {
    actions: object;
    content: string;
    title: string;
    buttonText?: string;
}

declare function NestLinkDialog(config: NestLinkDialogInterface): void;

declare module "Magento_PageBuilder/js/modal/nest-link-dialog" {
    export = NestLinkDialog;
}
