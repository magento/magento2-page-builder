/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import EventEmitter from "../../../event-emitter";

export class Block extends EventEmitter {
    public droppable: boolean = true;
    private config: ContentBlockConfig;
    private icon: KnockoutObservable<string> = ko.observable("");
    private identifier: KnockoutObservable<string> = ko.observable("");
    private label: KnockoutObservable<string> = ko.observable("");

    /**
     * Block Constructor
     *
     * @param {string} identifier
     * @param {ContentBlockConfig} config
     */
    constructor(identifier: string, config: ContentBlockConfig) {
        super();
        this.config = config;
        this.identifier(identifier);
        this.label(config.label);
        this.icon(config.icon);
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
