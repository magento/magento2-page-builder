/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import _ from "underscore";
import CreateValueForHref from "../../converter/attribute/link-href";
import {DataObject} from "../../data-store";
import {fromHex} from "../../utils/color-converter";
import {getImageUrl} from "../../utils/directives";
import {percentToDecimal} from "../../utils/number-converter";
import BaseMaster from "../master";

export default class Master extends BaseMaster {

    private createValueForHref: CreateValueForHref = new CreateValueForHref();

    /**
     * Get data for attr binding, example {"data-role": "element"}
     *
     * @returns {DataObject}
     * @deprecated
     */
    public getAttributes(element: string): {} {
        const attributes = _.clone(super.getAttributes(element));
        return {
            ...attributes,
            "data-slide-name": this.getData(element).slide_name,
        };
    }
    /**
     * Get the slide wrapper styles for the storefront
     *
     * @returns {object}
     */
    public getSlideStyles(type: string): {} {
        const data = this.parent.dataStore.get() as DataObject;
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
        const data = this.parent.dataStore.get() as DataObject;
        let overlayColorAttr: string = "transparent";
        if (data.show_overlay !== "never") {
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
        const data = this.parent.dataStore.get() as DataObject;
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
        const data = this.parent.dataStore.get() as DataObject;
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
        const data = this.parent.dataStore.get() as DataObject;
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
        const data = this.parent.dataStore.get() as DataObject;
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
        const data = this.parent.dataStore.get() as DataObject;
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
        const data = this.parent.dataStore.get() as DataObject;
        const attribute: any = {};
        if (typeof data.link_url === "object") {
            attribute.href = this.createValueForHref.toDom("link_url", data);
            attribute["data-link-type"] = data.link_url.type;
            attribute.target = data.link_url.setting === true ? "_blank" : "";
        }
        return attribute;
    }

    /**
     * Get the button style for the render
     *
     * @returns {object}
     */
    public getButtonStyle(): {} {
        const data = this.parent.dataStore.get() as DataObject;
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
}
