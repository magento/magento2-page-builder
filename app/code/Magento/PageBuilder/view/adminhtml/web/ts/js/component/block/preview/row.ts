/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import "Magento_PageBuilder/js/resource/jarallax/jarallax.min";
import _ from "underscore";
import PreviewCollection from "../../../preview-collection";
import BlockMountEventParamsInterface from "../../block/block-mount-event-params.d";
import BlockReadyEventParamsInterface from "../../block/block-ready-event-params.d";
import EventBus from "../../event-bus";
import {Option} from "../../stage/structural/options/option";
import {OptionInterface} from "../../stage/structural/options/option.d";
import ObservableUpdater from "../../../observable-updater";
import {ContentTypeInterface} from "../../../content-type.d";
import {ContentTypeConfigInterface} from "../../../content-type-config.d";

export default class Row extends PreviewCollection {
    public getChildren: KnockoutComputed<{}>;
    public wrapClass: KnockoutObservable<boolean> = ko.observable(false);
    private element: Element;

    /**
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    constructor(
        parent: ContentTypeInterface,
        config: ContentTypeConfigInterface,
        observableUpdater: ObservableUpdater
    ) {
        super(parent, config, observableUpdater);

        this.parent.store.subscribe(this.buildJarallax);
        EventBus.on("row:block:ready", (event: Event, params: BlockReadyEventParamsInterface) => {
            if (params.id === this.parent.id) {
                this.buildJarallax();
            }
        });
        EventBus.on("block:mount", (event: Event, params: BlockMountEventParamsInterface) => {
            if (params.block.parent.id === this.parent.id) {
                this.buildJarallax();
            }
        });
    }

    /**
     * Return an array of options
     *
     * @returns {Array<Option>}
     */
    public retrieveOptions(): OptionInterface[] {
        const options = super.retrieveOptions();
        const newOptions = options.filter((option) => {
            return (option.code !== "remove");
        });
        const removeClasses = ["remove-structural"];
        let removeFn = this.onOptionRemove;
        if (this.parent.parent.children().length < 2) {
            removeFn = () => { return; };
            removeClasses.push("disabled");
        }
        newOptions.push(new Option(
            this,
            "remove",
            "<i class='icon-admin-pagebuilder-remove'></i>",
            $t("Remove"),
            removeFn,
            removeClasses,
            100,
        ));
        return newOptions;
    }

    /**
     * Init the parallax element
     *
     * @param {Element} element
     */
    public initParallax(element: Element) {
        this.element = element;
        this.buildJarallax();
    }

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
}
