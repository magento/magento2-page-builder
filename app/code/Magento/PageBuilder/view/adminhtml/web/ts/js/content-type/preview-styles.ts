/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import events from "Magento_PageBuilder/js/events";
import {generateCssBlock, StylesUpdateEventParams} from "./style-registry";

interface StyleBlock {
    className: string;
    css: string;
}

export default class PreviewStyles {
    public styleBlocks: KnockoutObservableArray<StyleBlock> = ko.observableArray([]);
    private readonly stageId: string;

    constructor(stageId: string) {
        this.stageId = stageId;
        events.on("styles:update", (args: StylesUpdateEventParams) => {
            if (args.stageId === this.stageId) {
                const css = generateCssBlock(args.className, args.styles);
                // Remove any existing style blocks for the current class name
                const existingBlock = this.styleBlocks().find((block) => block.className === args.className);
                if (existingBlock) {
                    // Don't do an update if the CSS matches
                    if (existingBlock.css === css) {
                        return;
                    }
                    this.styleBlocks.splice(this.styleBlocks().indexOf(existingBlock), 1);
                }
                this.styleBlocks.push({
                    className: args.className,
                    css,
                });
            }
        });
    }

    /**
     * Get template.
     *
     * @returns {string}
     */
    public getTemplate() {
        return "Magento_PageBuilder/content-type/preview-styles";
    }
}
