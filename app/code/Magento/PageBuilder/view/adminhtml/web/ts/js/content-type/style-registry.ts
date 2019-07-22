/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "Magento_PageBuilder/js/events";
import _ from "underscore";

const styleRegistries: Record<string, StyleRegistry> = {};

export type Style = Record<string, any>;

export default class StyleRegistry {
    public stageId: string;
    private styles: Record<string, Style> = {};

    constructor(stageId: string) {
        this.stageId = stageId;
        styleRegistries[stageId] = this;
    }

    /**
     * Update styles for className
     *
     * @param className
     * @param styles
     */
    public updateStyles(className: string, styles: Style): void {
        this.styles[className] = styles;
        events.trigger("styles:update", {className, styles, stageId: this.stageId});
    }

    /**
     * Retrieve all styles
     */
    public getStyles(): Record<string, Style> {
        return this.styles;
    }
}

/**
 * Return the style registry for the current stage
 *
 * @param stageId
 */
export function getStyleRegistryForStage(stageId: string): StyleRegistry {
    return styleRegistries[stageId] !== undefined ? styleRegistries[stageId] : null;
}

export interface StylesUpdateEventParams {
    className: string;
    styles: Style;
    stageId: string;
}
