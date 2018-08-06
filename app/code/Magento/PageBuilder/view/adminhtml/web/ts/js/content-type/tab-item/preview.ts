/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "Magento_PageBuilder/js/events";
import Options from "../../content-type-menu";
import ContentTypeReadyEventParamsInterface from "../content-type-ready-event-params";
import PreviewCollection from "../preview-collection";

/**
 * @api
 */
export default class Preview extends PreviewCollection {

    /**
     * Fields that should not be considered when evaluating whether an object has been configured.
     *
     * @see {Preview.isConfigured}
     * @type {[string]}
     */
    protected fieldsToIgnoreOnRemove: string[] = ["tab_name"];

    /**
     * Get the options instance
     *
     * @returns {Options}
     */
    public getOptions(): Options {
        const options = super.getOptions();
        options.removeOption("move");
        options.removeOption("title");
        return options;
    }

    /**
     * Bind events
     */
    public bindEvents(): void {
        super.bindEvents();

        events.on(`${this.config.name}:mountAfter`, (args: ContentTypeReadyEventParamsInterface) => {
            if (args.id === this.parent.id) {
                // Disable the remove option when there is only a single tab
                const removeOption = this.getOptions().getOption("remove");
                if (this.parent.parent.children().length < 2) {
                    removeOption.isDisabled(true);
                }
                this.parent.parent.children.subscribe((children) => {
                    removeOption.isDisabled((children.length < 2));
                });
            }
        });
    }
}
