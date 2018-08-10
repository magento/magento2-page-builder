/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Preview from "../content-type/preview";
import ko from "knockout";
import OptionConfigInterface from "./option-config";

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
