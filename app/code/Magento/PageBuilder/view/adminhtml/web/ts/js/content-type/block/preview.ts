/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import widgetInitializer from "Magento_PageBuilder/js/widget-initializer";
import Config from "../../config";
import ContentTypeInterface from "../../content-type";
import ContentTypeConfigInterface from "../../content-type-config.types";
import HideShowOption from "../../content-type-menu/hide-show-option";
import {OptionsInterface} from "../../content-type-menu/option.types";
import {DataObject} from "../../data-store";
import {get} from "../../utils/object";
import ObservableUpdater from "../observable-updater";
import BasePreview from "../preview";

/**
 * @api
 */
export default class Preview extends BasePreview {
    public displayingBlockPreview: KnockoutObservable<boolean> = ko.observable(false);
    public loading: KnockoutObservable<boolean> = ko.observable(false);
    public placeholderText: KnockoutObservable<string>;
    public element: HTMLElement;
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
        contentType: ContentTypeInterface,
        config: ContentTypeConfigInterface,
        observableUpdater: ObservableUpdater,
    ) {
        super(contentType, config, observableUpdater);
        this.placeholderText = ko.observable(this.messages.NOT_SELECTED);
    }

    /**
     * Return an array of options
     *
     * @returns {OptionsInterface}
     */
    public retrieveOptions(): OptionsInterface {
        const options = super.retrieveOptions();

        options.hideShow = new HideShowOption({
            preview: this,
            icon: HideShowOption.showIcon,
            title: HideShowOption.showText,
            action: this.onOptionVisibilityToggle,
            classes: ["hide-show-content-type"],
            sort: 40,
        });

        return options;
    }

    /**
     * Runs the widget initializer for each configured widget
     */
    public initializeWidgets(element: HTMLElement) {
        if (element) {
            this.element = element;
            widgetInitializer({
                config: Config.getConfig("widgets"),
                breakpoints: Config.getConfig("breakpoints"),
            }, element);
        }
    }

    /**
     * Updates the view state using the data provided
     * @param {DataObject} data
     */
    public processBlockData(data: DataObject): void {
        // Only load if something changed
        this.displayPreviewPlaceholder(data, "block_id");
        if (data.block_id && (data.template as string).length !== 0) {
            this.processRequest(data, "block_id", "title");
        }
    }

    /**
     * @inheritdoc
     */
    protected afterObservablesUpdated(): void {
        super.afterObservablesUpdated();

        const data = this.contentType.dataStore.getState();

        // Only load if something changed
        this.processBlockData(data);

    }

    /**
     * Display preview placeholder
     *
     * @param {DataObject} data
     * @param {string} identifierName
     */
    protected displayPreviewPlaceholder(data: DataObject, identifierName: string): void {
        const blockId = get<number>(data, identifierName);
        // Only load if something changed
        if (this.lastBlockId === blockId && this.lastTemplate === data.template) {
            // The mass converter will have transformed the HTML property into a directive
            if (this.lastRenderedHtml) {
                this.data.main.html(this.lastRenderedHtml);
                this.showBlockPreview(true);
                this.initializeWidgets(this.element);
            }
        } else {
            this.showBlockPreview(false);
            this.placeholderText("");
        }

        if (!blockId || (blockId && blockId.toString().length === 0) || data.template.length === 0) {
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
        const identifier = get(data, identifierName);
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
                    this.initializeWidgets(this.element);
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
    }
}
