/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import "Magento_PageBuilder/js/resource/jarallax/jarallax.min";
import ResizeObserver from "Magento_PageBuilder/js/resource/resize-observer/ResizeObserver.min";
import _ from "underscore";
import ContentTypeCollection from "../../content-type-collection";
import ContentTypeConfigInterface from "../../content-type-config.d";
import Option from "../../content-type-menu/option";
import OptionInterface from "../../content-type-menu/option.d";
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
            jarallax(this.element, "destroy");
        } catch (e) {
            // Failure of destroying is acceptable
        }
        if (this.element && $(this.element).hasClass("jarallax")) {
            _.defer(() => {
                // Build Parallax on elements with the correct class
                jarallax(
                    this.element,
                    {
                        imgPosition: this.data.main.style().backgroundPosition || "50% 50%",
                        imgRepeat: this.data.main.style().backgroundRepeat === "0" ? "no-repeat" : "repeat",
                        imgSize: this.data.main.style().backgroundSize || "cover",
                        speed: this.data.main.attributes()["data-parallax-speed"] || 0.5,
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

                // Disable the remove option when there is only a single row
                const removeOption = this.getOptions().getOption("remove");
                this.parent.parent.children.subscribe((children) => {
                    removeOption.isDisabled((children.length < 2));
                });
            }
        });
        events.on("contentType:mountAfter", (args: ContentTypeMountEventParamsInterface) => {
            if (args.contentType.parent.id === this.parent.id) {
                this.buildJarallax();
            }
        });
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
            if ($(this.element).hasClass("jarallax")) {
                jarallax(this.element, "onResize");
                jarallax(this.element, "onScroll");
            }
        }).observe(this.element);
    }
}
