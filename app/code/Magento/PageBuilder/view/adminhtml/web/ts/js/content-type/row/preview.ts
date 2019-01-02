/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import "jarallax";
import $ from "jquery";
import ko from "knockout";
import events from "Magento_PageBuilder/js/events";
import ResizeObserver from "Magento_PageBuilder/js/resource/resize-observer/ResizeObserver";
import _ from "underscore";
import ContentTypeConfigInterface from "../../content-type-config.d";
import ConditionalRemoveOption from "../../content-type-menu/conditional-remove-option";
import HideShowOption from "../../content-type-menu/hide-show-option";
import {OptionsInterface} from "../../content-type-menu/option.d";
import ContentTypeInterface from "../../content-type.d";
import ContentTypeMountEventParamsInterface from "../content-type-mount-event-params.d";
import ContentTypeReadyEventParamsInterface from "../content-type-ready-event-params.d";
import ObservableUpdater from "../observable-updater";
import PreviewCollection from "../preview-collection";

/**
 * @api
 */
export default class Preview extends PreviewCollection {
    public getChildren: KnockoutComputed<{}>;
    public wrapClass: KnockoutObservable<boolean> = ko.observable(false);
    private element: Element;

    /**
     * Debounce and defer the init of Jarallax
     *
     * @type {(() => void) & _.Cancelable}
     */
    private buildJarallax = _.debounce(() => {
        // Destroy all instances of the plugin prior
        try {
            // store/apply correct style after destroying, as jarallax incorrectly overrides it with stale value
            const style = this.element.getAttribute("data-jarallax-original-styles") ||
                this.element.getAttribute("style");
            jarallax(this.element, "destroy");
            this.element.setAttribute("style", style);
        } catch (e) {
            // Failure of destroying is acceptable
        }
        if (this.element &&
            $(this.element).hasClass("jarallax") &&
            (this.parent.dataStore.get("background_image") as any[]).length
        ) {
            _.defer(() => {
                // Build Parallax on elements with the correct class
                jarallax(
                    this.element,
                    {
                        imgSrc: (this.parent.dataStore.get("background_image") as any[])[0].url as string,
                        imgPosition: this.parent.dataStore.get("background_position") as string || "50% 50%",
                        imgRepeat: (
                            (this.parent.dataStore.get("background_repeat") as "repeat" | "no-repeat") || "no-repeat"
                        ),
                        imgSize: this.parent.dataStore.get("background_size") as string || "cover",
                        speed: Number.parseFloat(this.parent.dataStore.get("parallax_speed") as string) || 0.5,
                    },
                );

                jarallax(this.element, "onResize");
            });
        }
    }, 50);

    /**
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    constructor(
        parent: ContentTypeInterface,
        config: ContentTypeConfigInterface,
        observableUpdater: ObservableUpdater,
    ) {
        super(parent, config, observableUpdater);

        this.parent.dataStore.subscribe(this.buildJarallax);
        events.on("row:mountAfter", (args: ContentTypeReadyEventParamsInterface) => {
            if (args.id === this.parent.id) {
                this.buildJarallax();
            }
        });
        events.on("contentType:mountAfter", (args: ContentTypeMountEventParamsInterface) => {
            if (args.contentType.parent.id === this.parent.id) {
                this.buildJarallax();
            }
        });
    }

    /**
     * Use the conditional remove to disable the option when the parent has a single child
     *
     * @returns {OptionsInterface}
     */
    public retrieveOptions(): OptionsInterface {
        const options = super.retrieveOptions();

        options.remove = new ConditionalRemoveOption({
            ...options.remove.config,
            preview: this,
        });

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
     * @param {Element} element
     */
    public initParallax(element: Element) {
        this.element = element;
        _.defer(() => {
            this.buildJarallax();
        });

        new ResizeObserver(() => {
            // Observe for resizes of the element and force jarallax to display correctly
            if ($(this.element).hasClass("jarallax") &&
                (this.parent.dataStore.get("background_image") as any[]).length
            ) {
                jarallax(this.element, "onResize");
                jarallax(this.element, "onScroll");
            }
        }).observe(this.element);
    }
}
