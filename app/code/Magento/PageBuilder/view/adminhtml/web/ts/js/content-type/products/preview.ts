/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import "slick";
import Config from "../../config";
import ContentTypeInterface from "../../content-type";
import ContentTypeConfigInterface from "../../content-type-config.types";
import HideShowOption from "../../content-type-menu/hide-show-option";
import {OptionsInterface} from "../../content-type-menu/option.types";
import ObservableUpdater from "../observable-updater";
import BasePreview from "../preview";

/**
 * @api
 */
export default class Preview extends BasePreview {
    public displayPreview: KnockoutObservable<boolean> = ko.observable(false);
    public placeholderText: KnockoutObservable<string>;
    private element: Element;
    private sliderReady: boolean = false;
    private messages = {
        EMPTY: $t("Empty Products"),
        NO_RESULTS: $t("No products were found matching your condition"),
        LOADING: $t("Loading..."),
        UNKNOWN_ERROR: $t("An unknown error occurred. Please try again."),
    };

    /**
     * @inheritdoc
     */
    constructor(
        contentType: ContentTypeInterface,
        config: ContentTypeConfigInterface,
        observableUpdater: ObservableUpdater,
    ) {
        super(contentType, config, observableUpdater);
        this.placeholderText = ko.observable(this.messages.EMPTY);
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
     * On afterRender callback.
     *
     * @param {Element} element
     */
    public onAfterRender(element: Element): void {
        this.element = element;
        this.initSlider();
    }

    /**
     * @inheritDoc
     */
    public onOptionVisibilityToggle(): void {
        this.element = undefined;
        this.sliderReady = false;
        super.onOptionVisibilityToggle();
    }

    /**
     * @inheritdoc
     */
    protected afterObservablesUpdated(): void {
        super.afterObservablesUpdated();
        this.displayPreview(false);

        const data = this.contentType.dataStore.getState();

        if ((typeof data.conditions_encoded !== "string") || data.conditions_encoded.length === 0) {
            this.placeholderText(this.messages.EMPTY);

            return;
        }

        const url = Config.getConfig("preview_url");
        const requestConfig = {
            // Prevent caching
            method: "POST",
            data: {
                role: this.config.name,
                directive: this.data.main.html(),
            },
        };

        this.placeholderText(this.messages.LOADING);

        $.ajax(url, requestConfig)
            .done((response) => {
                if (typeof response.data !== "object" || !Boolean(response.data.content)) {
                    this.placeholderText(this.messages.NO_RESULTS);

                    return;
                }

                if (response.data.error) {
                    this.data.main.html(response.data.error);
                } else {
                    this.data.main.html(response.data.content);
                    this.initSlider();
                    this.displayPreview(true);
                }
            })
            .fail(() => {
                this.placeholderText(this.messages.UNKNOWN_ERROR);
            });
    }

    protected initSlider(): void {
        if (!this.sliderReady && this.element && this.appearance() === "carousel") {
            $(this.element.children).slick(this.buildSlickConfig());
            this.sliderReady = true;
        }
    }

    /**
     * Build the slick config object
     *
     * @returns {{autoplay: boolean; autoplay: number; infinite: boolean; arrows: boolean; dots: boolean;
     * centerMode: boolean; slidesToScroll: number, slidesToShow: number}}
     */
    private buildSlickConfig() {
        const attributes = this.data.main.attributes();

        return {
            slidesToShow: 5,
            slidesToScroll: attributes["data-slide-all"] === "true" ? 5 : 1,
            centerMode: attributes["data-center-mode"] === "true",
            dots: attributes["data-show-dots"] === "true",
            arrows: attributes["data-show-arrows"] === "true",
            infinite: attributes["data-infinite-loop"] === "true",
            autoplay: attributes["data-autoplay"] === "true",
            autoplaySpeed: parseFloat(attributes["data-autoplay-speed"]),
        };
    }
}
