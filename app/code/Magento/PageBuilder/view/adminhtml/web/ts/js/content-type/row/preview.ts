/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import "jarallax";
import "jarallaxVideo";
import $ from "jquery";
import ko from "knockout";
import events from "Magento_PageBuilder/js/events";
import ResizeObserver from "Magento_PageBuilder/js/resource/resize-observer/ResizeObserver";
import _ from "underscore";
import "vimeoWrapper";
import ContentTypeConfigInterface from "../../content-type-config.types";
import ConditionalRemoveOption from "../../content-type-menu/conditional-remove-option";
import HideShowOption from "../../content-type-menu/hide-show-option";
import {OptionsInterface} from "../../content-type-menu/option.types";
import ContentTypeInterface from "../../content-type.types";
import {ContentTypeMountEventParamsInterface, ContentTypeReadyEventParamsInterface} from "../content-type-events.types";
import ObservableUpdater from "../observable-updater";
import PreviewCollection from "../preview-collection";

/**
 * @api
 */
export default class Preview extends PreviewCollection {
    public getChildren: KnockoutComputed<{}>;
    public wrapClass: KnockoutObservable<boolean> = ko.observable(false);
    private element: HTMLElement;

    /**
     * Debounce and defer the init of Jarallax
     *
     * @type {(() => void) & _.Cancelable}
     */
    private buildJarallax = _.debounce(() => {
        // Destroy all instances of the plugin prior
        try {
            jarallax(this.element, "destroy");
        } catch (e) {
            // Failure of destroying is acceptable
        }
        if (this.element &&
            $(this.element).hasClass("jarallax") &&
            (this.contentType.dataStore.get("background_type") as string) !== "video" &&
            (this.contentType.dataStore.get("background_image") as any[]).length
        ) {
            _.defer(() => {
                // Build Parallax on elements with the correct class
                const parallaxSpeed = Number.parseFloat(this.contentType.dataStore.get("parallax_speed") as string);
                jarallax(
                    this.element,
                    {
                        imgPosition: this.contentType.dataStore.get("background_position") as string || "50% 50%",
                        imgRepeat: (
                            (this
                                .contentType
                                .dataStore
                                .get("background_repeat") as "repeat" | "no-repeat") || "no-repeat"
                        ),
                        imgSize: this.contentType.dataStore.get("background_size") as string || "cover",
                        speed: !isNaN(parallaxSpeed) ? parallaxSpeed : 0.5,
                    },
                );

                jarallax(this.element, "onResize");
            });
        }

        if (this.element &&
            (this.element.dataset.backgroundType as string) === "video" &&
            (this.element.dataset.videoSrc as string).length
        ) {
            const parallaxSpeed = (this.contentType.dataStore.get("enable_parallax") as string) === "1"
                ? Number.parseFloat(this.contentType.dataStore.get("parallax_speed") as string)
                : 1;

            _.defer(() => {
                // Build Parallax on elements with the correct class
                jarallax(
                    this.element,
                    {
                        videoSrc: this.element.dataset.videoSrc as string,
                        imgSrc: this.element.dataset.videoFallbackSrc as string,
                        videoLoop: (this.contentType.dataStore.get("video_loop") as string) === "true",
                        speed: !isNaN(parallaxSpeed) ? parallaxSpeed : 0.5,
                        videoPlayOnlyVisible: (this.contentType.dataStore.get("video_play_only_visible") as string) === "true",
                        videoLazyLoading: (this.contentType.dataStore.get("video_lazy_load") as string) === "true",
                    },
                );
                // @ts-ignore
                if (this.element.jarallax && this.element.jarallax.video) {
                    // @ts-ignore
                    this.element.jarallax.video.on("started", () => {
                        // @ts-ignore
                        if (this.element.jarallax.$video) {
                            // @ts-ignore
                            this.element.jarallax.$video.style.visibility = "visible";
                        }
                    });
                }

            });
        }

    }, 50);

    /**
     * @param {ContentTypeInterface} contentType
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    constructor(
        contentType: ContentTypeInterface,
        config: ContentTypeConfigInterface,
        observableUpdater: ObservableUpdater,
    ) {
        super(contentType, config, observableUpdater);

        this.contentType.dataStore.subscribe(this.buildJarallax);
        events.on("row:mountAfter", (args: ContentTypeReadyEventParamsInterface) => {
            if (args.id === this.contentType.id) {
                this.buildJarallax();
            }
        });
        events.on("contentType:mountAfter", (args: ContentTypeMountEventParamsInterface) => {
            if (args.contentType.parentContentType && args.contentType.parentContentType.id === this.contentType.id) {
                this.buildJarallax();
            }
        });
        events.on(
            `stage:${this.contentType.stageId}:fullScreenModeChangeAfter`,
            this.toggleFullScreen.bind(this),
        );
        events.on(`stage:${this.contentType.stageId}:viewportChangeAfter`, (args: {viewport: string}) => {
            this.buildJarallax();
        });
    }

    /**
     * Get background image url base on the viewport.
     *
     * @returns {string}
     */
    public getBackgroundImage(): string {
        const mobileImage = (this.contentType.dataStore.get("mobile_image") as any[]);
        const desktopImage = (this.contentType.dataStore.get("background_image") as any[]);
        const backgroundImage = this.viewport() === "mobile" && mobileImage.length ?
            mobileImage :
            desktopImage;

        return backgroundImage.length ? `url("${backgroundImage[0].url}")` : "none";
    }

    /**
     * Toggle fullscreen
     */
    public toggleFullScreen()
    {
        if ($(this.element).hasClass("jarallax")) {
            this.buildJarallax();
        }
    }

    /**
     * Use the conditional remove to disable the option when the content type has a single child
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
     * Init the parallax element
     *
     * @param {HTMLElement} element
     */
    public initParallax(element: HTMLElement) {
        this.element = element;
        _.defer(() => {
            this.buildJarallax();
        });

        new ResizeObserver(() => {
            // Observe for resizes of the element and force jarallax to display correctly
            if ($(this.element).hasClass("jarallax") &&
                (this.contentType.dataStore.get("background_image") as any[]).length
            ) {
                jarallax(this.element, "onResize");
                jarallax(this.element, "onScroll");
            }
        }).observe(this.element);
    }

    /**
     * Destroy jarallax instance.
     */
    public destroy(): void {
        super.destroy();

        if (this.element) {
            jarallax(this.element, "destroy");
        }
    }

    /**
     * Return selected element styles
     *
     * @param element
     * @param styleProperties
     */
    public getStyle(element: {[key: string]: any}, styleProperties: string[]) {
        const stylesObject = element.style();

        return styleProperties.reduce((obj, key) => ({ ...obj, [key]: stylesObject[key] }), {});
    }

    /**
     * Return element styles without selected
     *
     * @param element
     * @param styleProperties
     */
    public getStyleWithout(element: {[key: string]: any}, styleProperties: string[]) {
        const stylesObject = element.style();

        return Object.keys(stylesObject)
            .filter((key) => !styleProperties.includes(key))
            .reduce((obj, key) => {
                return {
                    ...obj,
                    [key]: stylesObject[key],
                };
            }, {});
    }
}
