/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import {ConfigContentBlock} from "../../../config";
import EventEmitter from "../../../event-emitter";

export class Block extends EventEmitter {
    public droppable: boolean = true;
    private config: ConfigContentBlock;
    private icon: KnockoutObservable<string> = ko.observable("");
    private identifier: KnockoutObservable<string> = ko.observable("");
    private label: KnockoutObservable<string> = ko.observable("");

    /**
     * Block Constructor
     *
     * @param {string} identifier
     * @param {ConfigContentBlock} config
     */
    constructor(identifier: string, config: ConfigContentBlock) {
        super();
        this.config = config;
        this.identifier(identifier);
        this.label(config.label);
        this.icon(config.icon);
    }

    /**
     * Retrieve the config object
     *
     * @returns {ConfigContentBlock}
     */
    public getConfig() {
        return this.config;
    }

    /**
     * Return the draggable config to the element
     *
     * @returns {string}
     */
    public getDraggableConfig() {
        return this.config.allowed_parents.map((value, index) => "." + value + "-container").join(", ");
    }
}
