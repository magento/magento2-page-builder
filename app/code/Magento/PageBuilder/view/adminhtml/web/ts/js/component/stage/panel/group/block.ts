/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import EventEmitter from "../../../event-emitter";

export class Block extends EventEmitter {
    public droppable: boolean = true;
    protected config: ContentBlockConfig;
    protected icon: KnockoutObservable<string> = ko.observable("");
    protected identifier: KnockoutObservable<string> = ko.observable("");
    protected label: KnockoutObservable<string> = ko.observable("");

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
