/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import Preview from "../content-type/preview";
import OptionInterface, {OptionConfigInterface} from "./option.types";

export default class Option implements OptionInterface {
    public config: OptionConfigInterface;
    public preview: Preview;
    public code: string;
    public icon: KnockoutObservable<string> = ko.observable("");
    public title: KnockoutObservable<string> = ko.observable("");
    public classes: KnockoutObservable<{[key: string]: boolean | KnockoutObservable<boolean>}> = ko.observable({});
    public sort: number;
    public action: () => void;
    public isDisabled: KnockoutObservable<boolean> = ko.observable(false);
    private readonly customTemplate: string;

    /**
     * @param {OptionConfigInterface} config
     */
    constructor(
        config: OptionConfigInterface,
    ) {
        this.config = config;
        this.preview = config.preview;
        this.icon(config.icon);
        this.title(config.title);

        this.code = config.code;
        this.sort = config.sort || 0;
        this.customTemplate = config.template;

        // Generate an array of classes for KO to consume
        const koClasses: {[key: string]: boolean | KnockoutObservable<boolean>} = {};
        if (config.classes && config.classes.length > 0) {
            config.classes.forEach((cssClass) => {
                koClasses[cssClass] = true;
            });
        }
        // Always add a disabled class which tracks whether this option is disabled
        koClasses.disabled = this.isDisabled;
        this.classes(koClasses);

        // If no action is supplied pass an empty function, this is called within the context of the preview
        const action = config.action ? config.action : () => { return; };
        this.action = (...args: any[]) => {
            if (!this.isDisabled()) {
                action.apply(this.preview, args);
            }
        };
    }

    get template(): string {
        return this.customTemplate || null;
    }
}
