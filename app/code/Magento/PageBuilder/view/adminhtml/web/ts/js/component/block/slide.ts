/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import _ from "underscore";
import {fromHex} from "../../utils/color-converter";
import {getImageUrl} from "../../utils/directives";
import {percentToDecimal} from "../../utils/number-converter";
import {Options} from "../stage/structural/options";
import Block from "./block";
import {Option} from "../stage/structural/options/option";
import {OptionInterface} from "../stage/structural/options/option.d";
import EventBus from "../event-bus";

export default class Slide extends Block {

    /**
     * Get the options instance
     *
     * @returns {Options}
     */
    public getOptions(): Options {
        const options = super.getOptions();
        options.removeOption("move");
        return options;
    }

    /**
     * Get the slide wrapper styles for the storefront
     *
     * @returns {object}
     */
    public getSlideStyles(type: string): {} {
        const data = this.getData();
        const style = _.clone(this.getStyle());

        let backgroundImage: any = "";
        if (type === "image") {
            backgroundImage = this.getImage() ? this.getStyle().backgroundImage : "none";
        }

        if (type === "mobileImage") {
            if (this.getMobileImage()) {
                backgroundImage = this.getStyle().mobileImage;
            } else {
                if (this.getImage()) {
                    backgroundImage = this.getStyle().backgroundImage;
                } else {
                    backgroundImage = "none";
                }
            }
        }

        return Object.assign(
            style,
            {
                backgroundImage,
                backgroundSize: data.background_size,
                border: "",
                borderColor: "",
                borderRadius: "",
                borderWidth: "",
                marginBottom: "",
                marginLeft: "",
                marginRight: "",
                marginTop: "",
                paddingBottom: "",
                paddingLeft: "",
                paddingRight: "",
                paddingTop: "",
            },
        );
    }

    /**
     * Get the slide overlay attributes for the storefront
     *
     * @returns {object}
     */
    public getOverlayAttributes(): {} {
        const data = this.getData();
        let overlayColorAttr: string = "transparent";
        if (data.show_overlay !== "never_show") {
            if (data.overlay_color !== "" && data.overlay_color !== undefined) {
                overlayColorAttr = fromHex(data.overlay_color, percentToDecimal(data.overlay_transparency));
            }
        }
        return {
            "data-overlay-color" : overlayColorAttr,
        };
    }

    /**
     * Get the slide overlay styles for the storefront
     *
     * @returns {object}
     */
    public getOverlayStyles(): {} {
        const data = this.getData();
        const { top = 0, right = 0, bottom = 0, left = 0 } = data.margins_and_padding.padding;
        return {
            backgroundColor: this.getOverlayColorStyle().backgroundColor,
            minHeight: data.min_height + "px",
            paddingBottom: bottom + "px",
            paddingLeft: left + "px",
            paddingRight: right + "px",
            paddingTop: top + "px",
        };
    }

    /**
     * Get the overlay color style only for the storefront
     *
     * @returns {object}
     */
    public getOverlayColorStyle(): {} {
        const data = this.getData();
        let overlayColor: string = "transparent";
        if (data.show_overlay === "always" && data.overlay_color !== "" && data.overlay_color !== undefined) {
            overlayColor = fromHex(data.overlay_color, percentToDecimal(data.overlay_transparency));
        }
        return {
            backgroundColor: overlayColor,
        };
    }

    /**
     * Get the slide content for the storefront
     *
     * @returns {string}
     */
    public getContentHtml(): string {
        const data = this.getData();
        if (data.content === "" || data.content === undefined) {
            return;
        } else {
            return $t(data.content);
        }
    }

    /**
     * Get the desktop (main) image attributes for the render
     *
     * @returns {object}
     */
    public getImage(): {} {
        const data = this.getData();
        if (data.background_image === "" || data.background_image === undefined) {
            return false;
        }
        if (_.isEmpty(data.background_image[0])) {
            return;
        }
        return getImageUrl(data.background_image);
    }

    /**
     * Get the mobile image attributes for the render
     *
     * @returns {object}
     */
    public getMobileImage(): {} {
        const data = this.getData();
        if (data.mobile_image === "" || data.mobile_image === undefined) {
            return false;
        }
        if (_.isEmpty(data.mobile_image[0])) {
            return;
        }
        return getImageUrl(data.mobile_image);
    }

    /**
     * Get the link attributes for the render
     *
     * @returns {object}
     */
    public getLinkAttribute(): {} {
        const data = this.getData();
        const attribute: any = {};
        if (data.link_url !== "") {
            attribute.href = data.link_url;
        }
        if (data.open_in_new_tab === "1") {
            attribute.target = "_blank";
        }
        return attribute;
    }

    /**
     * Get the button style for the render
     *
     * @returns {object}
     */
    public getButtonStyle(): {} {
        const data = this.getData();
        return {
            opacity: data.show_button === "always" ? "1" : "0",
            visibility: data.show_button === "always" ? "visible" : "hidden",
        };
    }

    /**
     * Get slide container style only for the storefront
     *
     * @returns {object}
     */
    public getSlideContainerStyle(): {} {
        const style = _.clone(this.getStyle());
        return Object.assign(
            style,
            {
                backgroundImage: "",
                minHeight: "",
                padding: "",
                paddingBottom: "",
                paddingLeft: "",
                paddingRight: "",
                paddingTop: "",
                textAlign: "",
            },
        );
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
        if (this.parent.children().length < 2) {
            removeFn = () => { return; };
            removeClasses.push("disabled");
        }
        newOptions.push(new Option(
            this,
            "remove",
            "<i></i>",
            $t("Remove"),
            removeFn,
            removeClasses,
            100,
        ));
        return newOptions;
    }
}
