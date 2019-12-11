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

interface PromptConfigInterface {
    title: string;
    label: string;
    validation: boolean;
    modalClass: string;
    validationRules: string[];
    promptContentTmpl: string,
    attributesForm: {
        novalidate: string;
        action: string;
    };
    attributesField: {
        "name": string;
        "data-validate": string;
        "maxlength": string;
    };
    actions: {
        confirm: (name: string) => void;
    };
    [key: string]: any;
}

declare function Prompt(config: PromptConfigInterface): void;

declare module "Magento_Ui/js/modal/prompt" {
    export = Prompt;
}
