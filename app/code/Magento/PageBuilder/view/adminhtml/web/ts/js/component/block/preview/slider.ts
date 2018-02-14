/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
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
                $(this.element).on("afterChange", function(slick: {}, current: any){
                    this.setActiveSlide(current.currentSlide);
                }.bind(this));
            }
        }, 100);
    }, 20);

    /**
     * @param {Block} parent
     * @param {ConfigContentBlock} config
     */
    constructor(parent: Block, config: ConfigContentBlock) {
        super(parent, config);

        this.parent.children.subscribe(this.buildSlick);
        this.parent.stage.store.subscribe(this.buildSlick);
    }

    /**
     * Set an active slide for navigation dot
     *
     * @param slideIndex
     */
    public setActiveSlide(slideIndex: number): void {
        this.data.activeSlide(slideIndex);
    }

    /**
     * Navigate to a slide
     *
     * @param slideIndex
     */
    public navigateToSlide(slideIndex: number): void {
        $(this.element).slick("slickGoTo", slideIndex);
        this.setActiveSlide(slideIndex);
    }

    /**
     * After child render record element
     *
     * @param {Element} element
     */
    public afterChildrenRender(element: Element): void {
        this.element = element;
    }

    /**
     * Setup fields observables within the data class property
     */
    protected setupDataFields() {
        super.setupDataFields();
        this.updateDataValue("activeSlide", 0);
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
            dots: false, // We have our own dots implemented
            fade: this.data.fade() === "1",
            infinite: this.data.is_infinite() === "1",
        };
    }
}
