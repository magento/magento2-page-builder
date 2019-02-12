/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Preview from "../content-type/preview";

/**
 * @api
 */
export default interface OptionInterface {
    config: OptionConfigInterface;
    preview: Preview;
    code: string;
    icon: KnockoutObservable<string>;
    title: KnockoutObservable<string>;
    classes: KnockoutObservable<{[key: string]: boolean | KnockoutObservable<boolean>}>;
    sort: number;
    action: () => void;
    isDisabled: KnockoutObservable<boolean>;
}

/**
 * @api
 */
export interface OptionsInterface {
    [key: string]: OptionInterface;
}

/**
 * @api
 */
export interface OptionConfigInterface {
    preview: Preview;
    code?: string;
    icon?: string;
    title: string;
    action?: () => void;
    classes?: string[];
    sort?: number;
    template?: string;
}
