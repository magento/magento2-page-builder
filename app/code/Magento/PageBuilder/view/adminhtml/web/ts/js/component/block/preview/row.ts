/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import "Magento_PageBuilder/js/resource/jarallax/jarallax";
import _ from "underscore";
import {ConfigContentBlock} from "../../config";
import {StyleAttributeMapperResult} from "../../format/style-attribute-mapper";
import Block from "../block";
import PreviewBlock from "./block";

export default class Row extends PreviewBlock {
    public getChildren: KnockoutComputed<{}>;
    public wrapClass: KnockoutObservable<boolean> = ko.observable(false);
    // private childSubscribe: KnockoutSubscription;
    private element: Element;

    /**
     * Assign a debounce and delay to the init of Jarallax to ensure the DOM has updated
     *
     * @type {(() => any) & _.Cancelable}
     */
    private buildJarallax = _.debounce(() => {

        if (this.element && this.element.hasClass("jarallax")) {

            // Build Parallax
            $(this.element).jarallax(this.buildJarallaxConfig());
        }
    }, 10);

    /**
     * @param {Block} parent
     * @param {ConfigContentBlock} config
     */
    constructor(parent: Block, config: ConfigContentBlock) {
        super(parent, config);

        // this.childSubscribe = this.parent.children.subscribe(this.buildJarallax);
        // this.parent.stage.store.subscribe(this.buildJarallax);
    }

    /**
     * Capture an after render event
     */
    public onAfterRender(row: Element): void {
        this.element = $(row).closest(".pagebuilder-row");
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

    /**
     * Build the Jarallax config object
     *
     * @returns {{imgPosition: string; imgRepeat: string;
     * imgSize: string; speed: (any | number);}}
     */
    private buildJarallaxConfig() {
        return {
            imgPosition: this.data.background_position() || "50% 50%",
            imgRepeat: this.data.background_repeat() || "no-repeat",
            imgSize: this.data.background_size() || "cover",
            speed: this.data.parallax_speed() || 0.5,
        };
    }
}
