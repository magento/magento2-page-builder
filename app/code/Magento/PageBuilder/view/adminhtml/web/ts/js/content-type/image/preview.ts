/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import events from "Magento_PageBuilder/js/events";
import {DataObject} from "../../data-store";
import ContentTypeAfterRenderEventParamsInterface from "../content-type-after-render-event-params";
import BasePreview from "../preview";
import Uploader from "../uploader";

/**
 * @api
 */
export default class Preview extends BasePreview {

    /**
     * Get registry callback reference to uploader UI component
     *
     * @returns {Uploader}
     */
    public getUploader() {
        const dataStore = this.parent.dataStore.get() as DataObject;
        const initialImageValue = dataStore[this.config.additional_data.uploaderConfig.dataScope] || "";

        return new Uploader(
            "imageuploader_" + this.parent.id,
            this.config.additional_data.uploaderConfig,
            this.parent.id,
            this.parent.dataStore,
            (initialImageValue as object[]),
        );
    }

    /**
     * @inheritDoc
     */
    protected bindEvents() {
        super.bindEvents();

        events.on(`${this.config.name}:${this.parent.id}:updateAfter`, () => {
            const dataStore = this.parent.dataStore.get() as DataObject;
            const files: object[] = (dataStore[this.config.additional_data.uploaderConfig.dataScope] as object[]);
            const imageObject: object = files ? (files[0] as object) : {};
            events.trigger(`image:${this.parent.id}:assignAfter`, imageObject);
        });
    }
}
