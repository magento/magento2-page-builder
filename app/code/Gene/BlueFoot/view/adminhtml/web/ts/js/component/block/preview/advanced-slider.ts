/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Block from "../block";
import PreviewBlock from "./block";
import $ from "jquery";
import "Gene_BlueFoot/js/resource/slick/slick";
import _, {Dictionary} from "underscore";
import Structural from "../../stage/structural/abstract";

/*eslint-disable */
export default class AdvancedSlider extends PreviewBlock {
    element: Element;
    ready: boolean = false;

    /**
     * Assign a debounce and delay to the init of slick to ensure the DOM has updated
     *
     * @type {(() => any) & _.Cancelable}
     */
    buildSlick = _.debounce(() => {
        _.delay(() => {
            if (this.element && this.element.children.length > 0) {
                try {
                    $(this.element).slick('unslick');
                } catch (e) {
                    // This may error
                }
                $(this.element).slick(this.buildSlickConfig());
            }
        }, 100);
    }, 20);

    /**
     * @param {Block} parent
     * @param {Object} config
     */
    constructor(parent: Block, config: object) {
        super(parent, config);

        parent.children.subscribe(this.buildSlick);
        this.parent.stage.store.subscribe(this.buildSlick);
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
