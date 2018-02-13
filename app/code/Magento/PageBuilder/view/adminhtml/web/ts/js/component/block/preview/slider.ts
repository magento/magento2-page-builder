/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import "Magento_PageBuilder/js/resource/slick/slick";
import _ from "underscore";
import {ConfigContentBlock} from "../../config";
import Block from "../block";
import PreviewBlock from "./block";

export default class Slider extends PreviewBlock {
    private ready: boolean = false;
    private element: Element;

    /**
     * Assign a debounce and delay to the init of slick to ensure the DOM has updated
     *
     * @type {(() => any) & _.Cancelable}
     */
    private buildSlick = _.debounce(() => {
        _.delay(() => {
            if (this.element && this.element.children.length > 0) {
                try {
                    $(this.element).slick("unslick");
                } catch (e) {
                    // This may error
                }
                $(this.element).slick(this.buildSlickConfig());
            }
        }, 100);
    }, 20);

    /**
     * @param {Block} parent
     * @param {object} config
     */
    constructor(parent: Block, config: ConfigContentBlock) {
        super(parent, config);

        parent.children.subscribe(this.buildSlick);
        this.parent.stage.store.subscribe(this.buildSlick);
    }

    /**
     * After child render record element
     *
     * @param {Element} element
     */
    public afterChildrenRender(element: Element) {
        this.element = element;
    }

    /**
     * Build the slack config object
     *
     * @returns {{autoplay: boolean; autoplaySpeed: (any | number);
     * fade: boolean; infinite: boolean; arrows: boolean; dots: boolean}}
     */
    private buildSlickConfig() {
        return {
            arrows: this.data.show_arrows() === "1",
            autoplay: this.data.autoplay() === "1",
            autoplaySpeed: this.data.autoplay_speed(),
            dots: this.data.show_dots() === "1",
            fade: this.data.fade() === "1",
            infinite: this.data.is_infinite() === "1",
        };
    }
}
