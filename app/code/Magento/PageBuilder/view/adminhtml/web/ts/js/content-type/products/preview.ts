/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import "slick";
import _ from "underscore";
import Config from "../../config";
import ContentTypeInterface from "../../content-type";
import ContentTypeConfigInterface from "../../content-type-config.types";
import HideShowOption from "../../content-type-menu/hide-show-option";
import {OptionsInterface} from "../../content-type-menu/option.types";
import {DataObject} from "../../data-store";
import {ContentTypeAfterRenderEventParamsInterface} from "../content-type-events.types";
import ObservableUpdater from "../observable-updater";
import BasePreview from "../preview";

/**
 * @api
 */
export default class Preview extends BasePreview {
    public displayPreview: KnockoutObservable<boolean> = ko.observable(false);
    public placeholderText: KnockoutObservable<string>;
    public previewElement: JQueryDeferred<Element> = $.Deferred();
    public widgetUnsanitizedHtml: KnockoutObservable<string> = ko.observable();
    protected slidesToShow: number = 5;
    private element: Element;
    private productItemSelector: string = ".product-item";
    private centerModeClass: string = "center-mode";
    private messages = {
        EMPTY: $t("Empty Products"),
        NO_RESULTS: $t("No products were found matching your condition"),
        LOADING: $t("Loading..."),
        UNKNOWN_ERROR: $t("An unknown error occurred. Please try again."),
    };

    /**
     * Define keys which when changed should not trigger the slider to be rebuilt
     *
     * @type {string[]}
     */
    private ignoredKeysForBuild: string[] = [
        "margins_and_padding",
        "border",
        "border_color",
        "border_radius",
        "border_width",
        "css_classes",
        "text_align",
    ];
    private previousData: DataObject;

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

        // Redraw slider after content type gets redrawn
        events.on("contentType:redrawAfter", (args: ContentTypeAfterRenderEventParamsInterface) => {
            if (this.element && this.element.children) {
                const $element = $(this.element.children);

                if (args.element && $element.closest(args.element).length) {
                    $element.slick("setPosition");
                }
            }
        });

        events.on(`stage:${this.contentType.stageId}:viewportChangeAfter`, (args: {viewport: string}) => {
            const viewports = Config.getConfig("viewports");
            if (this.element && this.appearance() === "carousel") {
                this.slidesToShow = parseFloat(viewports[args.viewport].options.products.default.slidesToShow);
                this.destroySlider();
                this.initSlider();
            }
        });
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
        this.previewElement.resolve(element);
        this.initSlider();
    }

    /**
     * @inheritdoc
     */
    protected afterObservablesUpdated(): void {
        super.afterObservablesUpdated();
        const data = this.contentType.dataStore.getState();

        if (this.hasDataChanged(this.previousData, data)) {
            this.displayPreview(false);

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
                        this.widgetUnsanitizedHtml(response.data.error);
                    } else {
                        this.widgetUnsanitizedHtml(response.data.content);
                        this.displayPreview(true);
                    }

                    this.previewElement.done(() => {
                        $(this.element).trigger("contentUpdated");
                    });
                })
                .fail(() => {
                    this.placeholderText(this.messages.UNKNOWN_ERROR);
                });
        }
        this.previousData = Object.assign({}, data);
    }

    protected initSlider(): void {
        if (this.element && this.appearance() === "carousel") {
            $(this.element.children).slick(this.buildSlickConfig());
        }
    }

    protected destroySlider(): void {
        $(this.element.children).slick("unslick");
    }

    /**
     * Build the slick config object
     *
     * @returns {{autoplay: boolean; autoplay: number; infinite: boolean; arrows: boolean; dots: boolean;
     * centerMode: boolean; slidesToScroll: number; slidesToShow: number;}}
     */
    private buildSlickConfig() {
        const attributes = this.data.main.attributes();
        const productCount = $(this.widgetUnsanitizedHtml()).find(this.productItemSelector).length;
        const viewports = Config.getConfig("viewports");
        const currentViewport = this.viewport();
        const carouselMode = attributes["data-carousel-mode"];
        const config: {[key: string]: any} = {
            slidesToShow: this.slidesToShow,
            slidesToScroll: this.slidesToShow,
            dots: attributes["data-show-dots"] === "true",
            arrows: attributes["data-show-arrows"] === "true",
            autoplay: attributes["data-autoplay"] === "true",
            autoplaySpeed: parseFloat(attributes["data-autoplay-speed"]),
        };

        const slidesToShow = viewports[currentViewport].options.products[carouselMode] ?
            viewports[currentViewport].options.products[carouselMode].slidesToShow :
            viewports[currentViewport].options.products.default.slidesToShow;

        config.slidesToShow = parseFloat(slidesToShow);

        if (attributes["data-carousel-mode"] === "continuous" && productCount > config.slidesToShow) {
            config.centerPadding = attributes["data-center-padding"];
            config.centerMode = true;
            $(this.element).addClass(this.centerModeClass);
        } else {
            config.infinite = attributes["data-infinite-loop"] === "true";
            $(this.element).removeClass(this.centerModeClass);
        }

        return config;
    }

    /**
     * Determine if the data has changed, whilst ignoring certain keys which don't require a rebuild
     *
     * @param {DataObject} previousData
     * @param {DataObject} newData
     * @returns {boolean}
     */
    private hasDataChanged(previousData: DataObject, newData: DataObject) {
        previousData = _.omit(previousData, this.ignoredKeysForBuild);
        newData = _.omit(newData, this.ignoredKeysForBuild);
        return !_.isEqual(previousData, newData);
    }
}
