/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import widgetInitializer from "Magento_PageBuilder/js/widget-initializer";
import Config from "../../config";
import ContentTypeInterface from "../../content-type";
import ContentTypeConfigInterface from "../../content-type-config";
import {DataObject} from "../../data-store";
import ContentTypeDroppedCreateEventParamsInterface from "../content-type-dropped-create-event-params";
import ObservableUpdater from "../observable-updater";
import BasePreview from "../preview";

/**
 * @api
 */
export default class Preview extends BasePreview {
    public displayingBlockPreview: KnockoutObservable<boolean> = ko.observable(false);
    public loading: KnockoutObservable<boolean> = ko.observable(false);
    public placeholderText: KnockoutObservable<string>;
    protected messages = {
        NOT_SELECTED: $t("Empty Block"),
        UNKNOWN_ERROR: $t("An unknown error occurred. Please try again."),
    };
    private lastBlockId: number;
    private lastTemplate: string;
    private lastRenderedHtml: string;

    /**
     * @inheritdoc
     */
    constructor(
        parent: ContentTypeInterface,
        config: ContentTypeConfigInterface,
        observableUpdater: ObservableUpdater,
    ) {
        super(parent, config, observableUpdater);
        this.placeholderText = ko.observable(this.messages.NOT_SELECTED);
    }

    /**
     * Runs the widget initializer for each configured widget
     */
    public initializeWidgets() {
        widgetInitializer({
            config: Config.getConfig("widgets"),
        });
    }

    /**
     *
     * @param {DataObject} data
     */
    public processBlockData(data: DataObject): void {
        // Only load if something changed
        this.displayPreviewPlaceholder(data, "banner_ids");
        this.processRequest(data, "banner_ids", "name");
    }

    /**
     * @inheritdoc
     */
    protected bindEvents() {
        super.bindEvents();
        // When a block type is dropped for the first time open the edit panel
        events.on("block:dropAfter", (args: ContentTypeDroppedCreateEventParamsInterface) => {
            if (args.id === this.parent.id) {
                setTimeout(() => {
                    this.openEdit();
                }, 300);
            }
        });
    }

    /**
     * @inheritdoc
     */
    protected afterObservablesUpdated(): void {
        super.afterObservablesUpdated();

        const data = this.parent.dataStore.get() as DataObject;

        // Only load if something changed
        this.processBlockData(data);

    }

    /**
     * Displsay preview placeholder
     *
     * @param {DataObject} data
     * @param {string} identifierName
     */
    protected displayPreviewPlaceholder(data: DataObject, identifierName: string): void {
        // Only load if something changed
        if (this.lastBlockId === data[identifierName] && this.lastTemplate === data.template) {
            // The mass converter will have transformed the HTML property into a directive
            if (this.lastRenderedHtml) {
                this.data.main.html(this.lastRenderedHtml);
                this.showBlockPreview(true);
                this.initializeWidgets();
            }
        } else {
            this.showBlockPreview(false);
            this.placeholderText("");
        }

        if (!data[identifierName] || data.template.length === 0) {
            this.showBlockPreview(false);
            this.placeholderText(this.messages.NOT_SELECTED);
            return;
        }
    }

    /**
     *
     * @param {DataObject} data
     * @param {string} identifierName
     * @param {string} labelKey
     */
    protected processRequest(data: DataObject, identifierName: string, labelKey: string): void {
        const url = Config.getConfig("preview_url");
        const identifier = data[identifierName];
        const requestConfig = {
            // Prevent caching
            method: "POST",
            data: {
                role: this.config.name,
                block_id: identifier,
                directive: this.data.main.html(),
            },
        };
        this.loading(true);
        // Retrieve a state object representing the block from the preview controller and process it on the stage
        $.ajax(url, requestConfig)
        // The state object will contain the block name and either html or a message why there isn't any.
            .done((response) => {
                // Empty content means something bad happened in the controller that didn't trigger a 5xx
                if (typeof response.data !== "object") {
                    this.showBlockPreview(false);
                    this.placeholderText(this.messages.UNKNOWN_ERROR);

                    return;
                }

                // Update the stage content type label with the real block title if provided
                this.displayLabel(response.data[labelKey] ? response.data[labelKey] : this.config.label);

                if (response.data.content) {
                    this.showBlockPreview(true);
                    this.data.main.html(response.data.content);
                    this.initializeWidgets();
                } else if (response.data.error) {
                    this.showBlockPreview(false);
                    this.placeholderText(response.data.error);
                }

                this.lastBlockId = parseInt(identifier.toString(), 10);
                this.lastTemplate = data.template.toString();
                this.lastRenderedHtml = response.data.content;
            })
            .fail(() => {
                this.showBlockPreview(false);
                this.placeholderText(this.messages.UNKNOWN_ERROR);
            })
            .always(() => {
                this.loading(false);
            });
    }

    /**
     * Toggle display of block preview.  If showing block preview, add hidden mode to PB preview.
     * @param {boolean} isShow
     */
    private showBlockPreview(isShow: boolean) {
        this.displayingBlockPreview(isShow);

        // preview is hidden only if block is shown
        this.display(!isShow);
    }
}
