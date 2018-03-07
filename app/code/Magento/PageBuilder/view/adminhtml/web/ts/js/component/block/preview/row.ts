/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import "Magento_PageBuilder/js/resource/jarallax/jarallax.min";
import _ from "underscore";
import {ConfigContentBlock} from "../../config";
import EventBus from "../../event-bus";
import {StyleAttributeMapperResult} from "../../format/style-attribute-mapper";
import {BlockMountEventParams} from "../../stage/structural/editable-area";
import Block from "../block";
import {BlockReadyEventParams} from "../factory";
import PreviewBlock from "./block";

export default class Row extends PreviewBlock {
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
                        imgPosition: this.data.background_position() || "50% 50%",
                        imgRepeat: this.data.background_repeat() === "0" ? "no-repeat" : "repeat",
                        imgSize: this.data.background_size() || "cover",
                        speed: this.data.parallax_speed() || 0.5,
                    },
                );
            });
        }
    }, 50);

    /**
     * @param {Block} parent
     * @param {ConfigContentBlock} config
     */
    constructor(parent: Block, config: ConfigContentBlock) {
        super(parent, config);

        this.parent.stage.store.subscribe(this.buildJarallax);
        EventBus.on("row:block:ready", (event: Event, params: BlockReadyEventParams) => {
            if (params.id === this.parent.id) {
                this.buildJarallax();
            }
        });
        EventBus.on("block:mount", (event: Event, params: BlockMountEventParams) => {
            if (params.block.parent.id === this.parent.id) {
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
        this.buildJarallax();
    }

    /**
     * Update the style attribute mapper converts images to directives, override it to include the correct URL
     *
     * @returns styles
     */
    protected afterStyleMapped(styles: StyleAttributeMapperResult) {
        // The style attribute mapper converts images to directives, override it to include the correct URL
        if (this.data.background_image && typeof this.data.background_image()[0] === "object") {
            styles.backgroundImage = "url(" + this.data.background_image()[0].url + ")";
        }

        // If the bottom margin is 0, we set it to 1px to overlap the rows to create a single border
        if (styles.marginBottom === "0px") {
            styles.marginBottom = "1px";
        }

        // If the border is set to default we show no border in the admin preview, as we're unaware of the themes styles
        if (this.data.border && this.data.border() === "_default") {
            styles.border = "none";
        }

        return styles;
    }
}
