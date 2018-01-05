/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import EventEmitter from "../../../event-emitter";
import ko from 'knockout';

/**
 * Block Class
 */
'use strict';
/*eslint-disable */
export class Block extends EventEmitter {
    config: ContentBlockConfig;
    identifier: KnockoutObservable<string> = ko.observable('');
    label: KnockoutObservable<string> = ko.observable('');
    icon: KnockoutObservable<string> = ko.observable('');
    droppable: boolean = true;

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
    getDraggableConfig() {
        return this.config.allowed_parents.map(function(value, index) {return '.' + value + '-container'}).join(', ');
    }
}
