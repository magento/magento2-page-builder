/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Block from "../block";
import PreviewBlock from "./block";
import $ from "jquery";
import "Gene_BlueFoot/js/resource/slick/slick";
import {Dictionary} from "underscore";

export default class AdvancedSlider extends PreviewBlock {
    element: Element;
    ready: boolean = false;

    /**
     * @param {Block} parent
     * @param {Object} config
     */
    constructor(parent: Block, config: object) {
        super(parent, config);

        parent.children.subscribe(_.debounce(() => {
            //$(this.element).slick(this.buildSlickConfig());
            this.ready = true;
        }, 10));

        this.parent.stage.store.subscribe(
            (data: Dictionary<{}>) => {
                if (this.ready) {
                    //$(this.element).slick(this.buildSlickConfig());
                }
            }
        );
    }

    /**
     * After child render record element
     *
     * @param {Element} element
     */
    afterChildrenRender(element: Element) {
        this.element = element;
    }

    /**
     * Build the slack config object
     *
     * @returns {{autoplay: boolean; autoplaySpeed: (any | number); fade: boolean; infinite: boolean; arrows: boolean; dots: boolean}}
     */
    private buildSlickConfig() {
        return {
            autoplay: this.data.autoplay() === '1',
            autoplaySpeed: this.data.autoplay_speed(),
            fade: this.data.fade() === '1',
            infinite: this.data.is_infinite() === '1',
            arrows: this.data.show_arrows() === '1',
            dots: this.data.show_dots() === '1'
        }
    }
}
