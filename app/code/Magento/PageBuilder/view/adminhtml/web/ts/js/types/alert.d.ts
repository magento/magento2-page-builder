/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

interface AlertConfigInterface {
    content: string;
    title: string;
    actions?: {
        always: (event: JQueryEventObject) => void;
    };
}

declare function Alert(config: AlertConfigInterface): void;

declare module "Magento_Ui/js/modal/alert" {
    export = Alert;
}

declare module "Magento_PageBuilder/js/modal/confirm-alert" {
    export = Alert;
}

interface TemplateManagerSaveInterface {
    title: string;
    label: string;
    validation?: boolean;
    modalClass?: string;
    validationRules?: string[];
    promptContentTmpl?: string;
    attributesForm?: {
        novalidate: string;
        action: string;
    };
    attributesField?: {
        "name": string;
        "data-validate": string;
        "maxlength": string;
    };
    actions?: {
        confirm: (name: string, createdFor: string) => void;
    };
    [key: string]: any;
}

declare function Prompt(config: TemplateManagerSaveInterface): void;

declare module "Magento_PageBuilder/js/modal/template-manager-save" {
    export = Prompt;
}
