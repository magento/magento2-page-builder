/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import ConditionalRemoveOption from "../../content-type-menu/conditional-remove-option";
import {OptionsInterface} from "../../content-type-menu/option.types";
import PreviewCollection from "../preview-collection";
import TabsPreview from "../tabs/preview";
import _ from "underscore";
import events from "Magento_PageBuilder/js/events";

/**
 * @api
 */
export default class Preview extends PreviewCollection {
    /**
     * The element the text content type is bound to
     */
    private wrapper: HTMLElement;

    /**
     * Fields that should not be considered when evaluating whether an object has been configured.
     *
     * @see {Preview.isConfigured}
     * @type {[string]}
     */
    protected fieldsToIgnoreOnRemove: string[] = ["tab_name"];

    /**
     * Debounce and defer the init of Jarallax
     *
     * @type {(() => void) & _.Cancelable}
     */
    private buildJarallax = _.debounce(() => {
        // Destroy all instances of the plugin prior
        try {
            // store/apply correct style after destroying, as jarallax incorrectly overrides it with stale value
            const style = this.wrapper.getAttribute("style") ||
                this.wrapper.getAttribute("data-jarallax-original-styles");
            const backgroundImage = this.getBackgroundImage();
            jarallax(this.wrapper, "destroy");
            this.wrapper.setAttribute("style", style);
            if (this.contentType.dataStore.get("background_type") as string !== "video" &&
                this.wrapper.style.backgroundImage !== backgroundImage &&
                backgroundImage !== "none"
            ) {
                this.wrapper.style.backgroundImage = backgroundImage;
            }
        } catch (e) {
            // Failure of destroying is acceptable
        }

        if (this.wrapper &&
            (this.wrapper.dataset.backgroundType as string) === "video" &&
            (this.wrapper.dataset.videoSrc as string).length
        ) {
            _.defer(() => {
                // Build Parallax on elements with the correct class
                jarallax(
                    this.wrapper,
                    {
                        videoSrc: this.wrapper.dataset.videoSrc as string,
                        imgSrc: this.wrapper.dataset.videoFallbackSrc as string,
                        videoLoop: (this.contentType.dataStore.get("video_loop") as string) === "true",
                        speed: 1,
                        videoPlayOnlyVisible: (this.contentType.dataStore.get("video_play_only_visible") as string) === "true",
                        videoLazyLoading: (this.contentType.dataStore.get("video_lazy_load") as string) === "true",
                    },
                );
                // @ts-ignore
                if (this.wrapper.jarallax && this.wrapper.jarallax.video) {
                    // @ts-ignore
                    this.wrapper.jarallax.video.on("started", () => {
                        // @ts-ignore
                        if (this.wrapper.jarallax && this.wrapper.jarallax.$video) {
                            // @ts-ignore
                            this.wrapper.jarallax.$video.style.visibility = "visible";
                        }
                    });
                }
            });
        }

    }, 50);

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
     * Force the focus on the clicked tab header
     *
     * @param {number} index
     * @param {JQueryEventObject} event
     */
    public onClick(index: number, event: JQueryEventObject): void {
        $(event.currentTarget).find("[contenteditable]").focus();
        event.stopPropagation();
    }

    /**
     * On focus in set the focused button
     *
     * @param {number} index
     * @param {Event} event
     */
    public onFocusIn(index: number, event: Event): void {
        const parentPreview = this.contentType.parentContentType.preview as TabsPreview;
        if (parentPreview.focusedTab() !== index) {
            parentPreview.setFocusedTab(index, true);
        }
    }

    /**
     * On focus out set the focused tab to null
     *
     * @param {number} index
     * @param {JQueryEventObject} event
     */
    public onFocusOut(index: number, event: JQueryEventObject): void {
        if (this.contentType && this.contentType.parentContentType) {
            const parentPreview = this.contentType.parentContentType.preview as TabsPreview;
            const unfocus = () => {
                window.getSelection().removeAllRanges();
                parentPreview.focusedTab(null);
            };
            if (event.relatedTarget && $.contains(parentPreview.wrapperElement, event.relatedTarget)) {
                // Verify the focus was not onto the options menu
                if ($(event.relatedTarget).closest(".pagebuilder-options").length > 0) {
                    unfocus();
                } else {
                    // Have we moved the focus onto another button in the current group?
                    const tabItem = ko.dataFor(event.relatedTarget) as Preview;
                    if (tabItem &&
                        tabItem.contentType &&
                        tabItem.contentType.parentContentType &&
                        tabItem.contentType.parentContentType.id ===
                        this.contentType.parentContentType.id
                    ) {
                        const newIndex = tabItem
                            .contentType
                            .parentContentType.children()
                            .indexOf(tabItem.contentType);
                        parentPreview.setFocusedTab(newIndex, true);
                    } else {
                        unfocus();
                    }
                }
            } else if (parentPreview.focusedTab() === index) {
                unfocus();
            }
        }
    }

    /**
     * Get the options instance
     *
     * @returns {OptionsInterface}
     */
    public retrieveOptions(): OptionsInterface {
        const options = super.retrieveOptions();
        delete options.move;
        delete options.title;
        options.remove = new ConditionalRemoveOption({
            ...options.remove.config,
            preview: this,
        });
        return options;
    }

    /**
     * @inheritDoc
     */
    protected bindEvents() {
        super.bindEvents();

        events.on(`stage:${this.contentType.stageId}:viewportChangeAfter`, (args: {viewport: string}) => {
            if (this.contentType.dataStore.get("background_type") !== "video") {
                this.buildJarallax();
            }
        });
    }
}
