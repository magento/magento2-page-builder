/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import Config from "../../component/config";
import {DataObject} from "../../component/data-store";
import {toDataUrl} from "../../utils/directives";
import {decodeUrl} from "../../utils/image";
import {convertUrlToPathIfOtherUrlIsOnlyAPath} from "../../utils/url";

export default class StyleAttributeMapper {

    /**
     * Map style attribute keys to DOM key names and normalize values
     *
     * @param {DataObject} data
     * @returns {StyleAttributeMapperResult}
     */
    public toDom(data: DataObject): StyleAttributeMapperResult {
        const result: StyleAttributeMapperResult = {};
        data = _.extend({}, data);

        // Handle the border being set to none and default
        if (typeof data.border !== "undefined") {
            if (data.border === "none") {
                data.border_color = "";
                data.border_width = "";
            }
        }

        Object.keys(data).map(
            (key: string) => {
                let value: any = data[key];

                /**
                 * If a field is set to _default then don't append it to the stylesheet. This is used when you need an
                 * empty value but can't as the field has a default value
                 */
                if (value === "" || value === "_default") {
                    return;
                }

                if (key === "color" && value === "default") {
                    value = "";
                }

                if (key === "border" && value === "default") {
                    value = "";
                }

                if (key === "min_height" || key === "border_width" || key === "border_radius") {
                    if (typeof value === "number") {
                        value = value.toString();
                    }
                    value = value.replace("px", "") + "px";
                }
                if (key === "background_repeat") {
                    value = value === "1" ? "repeat" : "no-repeat";
                }
                if (key === "background_repeat-x" || key === "background_repeat-y") {
                    value = "";
                }
                if ((key === "background_image" && Array.isArray(value) && value[0] !== undefined)
                    || (key === "mobile_image" && Array.isArray(value) && value[0] !== undefined)) {
                    // convert to media directive
                    const imageUrl = value[0].url;
                    const mediaUrl = convertUrlToPathIfOtherUrlIsOnlyAPath(Config.getInitConfig("media_url"), imageUrl);

                    const mediaPath = imageUrl.split(mediaUrl);
                    const directive = "{{media url=" + mediaPath[1] + "}}";
                    value = "url(\'" + toDataUrl(directive) + "\')";
                }
                if (key === "margins_and_padding") {
                    // The default value is set as a string
                    if (_.isString(value)) {
                        value = JSON.parse(value);
                    }

                    if (value.margin) {
                        result.marginTop = value.margin.top ? value.margin.top + "px" : null;
                        result.marginRight = value.margin.right ? value.margin.right + "px" : null;
                        result.marginBottom = value.margin.bottom ? value.margin.bottom + "px" : null;
                        result.marginLeft = value.margin.left ? value.margin.left + "px" : null;
                    }

                    if (value.padding) {
                        result.paddingTop = value.padding.top ? value.padding.top + "px" : null;
                        result.paddingRight = value.padding.right ? value.padding.right + "px" : null;
                        result.paddingBottom = value.padding.bottom ? value.padding.bottom + "px" : null;
                        result.paddingLeft = value.padding.left ? value.padding.left + "px" : null;
                    }

                    return;
                }
                result[this.fromSnakeToCamelCase(key)] = value;
            },
        );
        return result;
    }

    /**
     * Map DOM key names and values to internal format
     *
     * @param {DataObject} data
     * @returns {StyleAttributeMapperResult}
     */
    public fromDom(data: DataObject): StyleAttributeMapperResult {
        const result: StyleAttributeMapperResult = {};
        data = _.extend({}, data);

        // Set the initial state of margins & paddings and allow the reader below to populate it as desired
        result.margins_and_padding = {
            margin: {
                bottom: "",
                left: "",
                right: "",
                top: "",
            },
            padding: {
                bottom: "",
                left: "",
                right: "",
                top: "",
            },
        };

        Object.keys(data).map(
            (key: any) => {
                let value: any = data[key];
                if (value === "") {
                    return;
                }

                // The border values will be translated through as their top, left etc. so map them to the border-width
                if (key === "border-top-width" && value !== "initial") {
                    key = "border-width";
                }
                if (key === "border-top-style") {
                    key = "border";
                }
                if (key === "border-top-left-radius") {
                    key = "border-radius";
                }

                if (key === "min-height" || key === "border-width" || key === "border-radius") {
                    value = value.replace("px", "");
                }
                if (key === "background-repeat-y") {
                    key = "background-repeat";
                    value = value === "repeat" ? "1" : "0";
                }
                if (key === "background-position-y") {
                    key = "background-position";
                    if (value === "top") {
                        value = "left top";
                    } else if (value === "bottom") {
                        value = "left bottom";
                    } else {
                        value = "center center";
                    }
                }
                if (key === "border-top-color") {
                    key = "border-color";
                }
                if (key === "background-color" || key === "border-color") {
                    if (value === "default" || value === "initial" || value === "") {
                        value = "";
                    } else {
                        value = this.convertRgbToHex(value);
                    }
                }
                if (key === "color") {
                    if (value === "") {
                        value = "default";
                    } else {
                        value = this.convertRgbToHex(value);
                    }
                }

                if (key === "border") {
                    if (value === "") {
                        value = "default";
                    }
                }
                if (key === "background-image" || key === "mobile-image") {
                    value = decodeUrl(value);
                }
                if (key.startsWith("margin") || key.startsWith("padding")) {
                    const [attributeType, attributeDirection] = key.split("-");
                    result.margins_and_padding[(attributeType as "margin" | "padding")] = _.extend(
                        result.margins_and_padding[(attributeType as "margin" | "padding")],
                        {[attributeDirection]: value.replace("px", "")},
                    );
                    return;
                }
                result[key.replace("-", "_")] = value;
            },
        );
        return result;
    }

    /**
     * Convert from snake case to camel case
     *
     * @param {string} string
     * @returns {string}
     */
    private fromSnakeToCamelCase(currentString: string): string {
        const parts: string[] = currentString.split(/[_-]/);
        let newString: string = "";
        for (let i = 1; i < parts.length; i++) {
            newString += parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
        }
        return parts[0] + newString;
    }

    /**
     * Convert from int to hex
     *
     * @param {number} value
     * @returns {string}
     */
    private fromIntToHex(value: number): string {
        const hex = value.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }

    /**
     * Convert from string to hex
     *
     * @param {string} value
     * @returns {string}
     */
    private convertRgbToHex(value: string): string {
        if (value) {
            const regexp = /(\d{0,3}),\s(\d{0,3}),\s(\d{0,3})/;
            const matches = regexp.exec(value);
            if (matches) {
                return "#"
                    + this.fromIntToHex(parseInt(matches[1], 10))
                    + this.fromIntToHex(parseInt(matches[2], 10))
                    + this.fromIntToHex(parseInt(matches[3], 10));
            }
        }
        return value;
    }
}

export interface StyleAttributeMapperResult {
    [key: string]: string | number | StyleAttributeMarginsAndPadding;
    margins_and_padding?: StyleAttributeMarginsAndPadding;
}

export interface StyleAttributeMarginsAndPadding {
    margin: {
        bottom: string,
        left: string,
        right: string,
        top: string,
    };
    padding: {
        bottom: string,
        left: string,
        right: string,
        top: string,
    };
}
