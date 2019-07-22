/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import events from "Magento_PageBuilder/js/events";
import _ from "underscore";
import {Style, StylesUpdateEventParams} from "./style-registry";

interface StyleBlock {
    className: string;
    css: string;
}

export default class PreviewStyles {
    public styleBlocks: KnockoutObservableArray<StyleBlock> = ko.observableArray([]);
    private stageId: string;

    constructor(stageId: string) {
        this.stageId = stageId;
        events.on("styles:update", (args: StylesUpdateEventParams) => {
            if (args.stageId === this.stageId) {
                const css = this.generateCss(args.className, args.styles);
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

    /**
     * Generate CSS to push into the blocks
     *
     * @param className
     * @param styles
     */
    private generateCss(className: string, styles: Style) {
        let generatedStyles = "";
        Object.keys(styles).forEach((key: string) => {
            if (!_.isEmpty(styles[key])) {
                const formattedKey = key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
                generatedStyles += `${formattedKey}: ${styles[key]}; `;
            }
        });
        return `.${className} { ${generatedStyles} }`;
    }
}
