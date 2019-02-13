/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import ContentTypeConfigInterface from "../../content-type-config.types";
import {getAllowedContainersClasses} from "../../drag-drop/matrix";

export class ContentType {
    public droppable: boolean = true;
    private config: ContentTypeConfigInterface;
    private icon: KnockoutObservable<string> = ko.observable("");
    private identifier: KnockoutObservable<string> = ko.observable("");
    private label: KnockoutObservable<string> = ko.observable("");
    private stageId: string;

    /**
     * @param {string} identifier
     * @param {ContentTypeConfigInterface} config
     * @param {string} stageId
     */
    constructor(identifier: string, config: ContentTypeConfigInterface, stageId: string) {
        this.config = config;
        this.identifier(identifier);
        this.label(config.label);
        this.icon(config.icon);
        this.stageId = stageId;
    }

    /**
     * Retrieve the config object
     *
     * @returns {ContentTypeConfigInterface}
     */
    public getConfig() {
        return this.config;
    }

    /**
     * Only connect to container sortable instances that the current content type is accepted into
     *
     * @returns {string}
     */
    public getDraggableOptions() {
        return {
            connectToSortable: getAllowedContainersClasses(this.config.name, this.stageId),
        };
    }
}
