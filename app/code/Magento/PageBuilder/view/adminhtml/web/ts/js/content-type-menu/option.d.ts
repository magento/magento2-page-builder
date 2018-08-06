/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */
export default interface OptionInterface {
    code: string;
    icon?: KnockoutObservable<string>;
    title?: KnockoutObservable<string>;
    classes?: KnockoutObservable<{ [key: string]: boolean | KnockoutObservable<boolean> }>;
    sort: number;
    optionTemplate?: string;
    is_disabled?: KnockoutObservable<boolean>;

    setAction?(action: () => void): void;

    /**
     * Bind events for the option menu item
     */
    bindEvents(): void;
}
