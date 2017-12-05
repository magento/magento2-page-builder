/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import {DataObject} from "../../component/data-store";
import Config from "../../component/config";
import {toDataUrl} from "../../utils/directives";

interface FromDomResult {
    [key: string]: any;
}

export default class StyleAttributeMapper {
    /**
     * Map style attribute keys to DOM key names and normalize values
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    toDom(data: DataObject): DataObject {
        let result: DataObject = {};
        Object.keys(data).map(
            (key: string) => {
                let value = data[key];
                if (value === '') {
                    return;
                }
                if (key === 'min_height' || key === 'border_width') {
                    value = value.replace('px', '') + 'px';
                }
                if (key === 'background_repeat') {
                    value = value === "1" ? 'repeat' : 'no-repeat';
                }
                if (key === 'background_repeat-x' || key === 'background_repeat-y') {
                    value = '';
                }
                if (key === 'background_image' && Array.isArray(value) && value[0] != undefined) {
                    // convert to media directive
                    let imageUrl = value[0]['url'],
                        mediaUrl = Config.getInitConfig('media_url'),
                        mediaPath = imageUrl.split(mediaUrl),
                        directive = '{{media url=' + mediaPath[1] + '}}';
                    value = 'url(\'' + toDataUrl(directive) + '\')';
                }

                if (key === 'margins_and_padding') {
                    result['margin'] = `${value.margin.top}px ${value.margin.right}px`
                        + ` ${value.margin.bottom}px ${value.margin.left}px`;
                    result['padding'] = `${value.padding.top}px ${value.padding.right}px`
                        + ` ${value.padding.bottom}px ${value.padding.left}px`;
                    return;
                }

                result[this.fromSnakeToCamelCase(key)] = value;
            }
        );
        return result;
    }

    /**
     * Map DOM key names and values to internal format
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    public fromDom(data: DataObject): DataObject {
        let result: FromDomResult = {};
        Object.keys(data).map(
            (key: any) => {
                let value = data[key];
                if (key === 'border-top-width') {
                    key = 'border-width';
                }
                if (key === 'min-height' || key === 'border-width') {
                    value = value.replace('px', '');
                }
                if (key === 'background-repeat-y') {
                    key = 'background-repeat';
                    value = value === 'repeat' ? '1' : '0';
                }
                if (key === 'background-position-y') {
                    key = 'background-position';
                    if (value === 'top') {
                        value = 'left top';
                    } else if (value === 'bottom') {
                        value = 'left bottom'
                    } else {
                        value = 'center center';
                    }
                }
                if (key === 'border-top-color') {
                    key = 'border-color';
                }
                if (key === 'background-color' || key === 'border-color') {
                    const regexp = /(\d{0,3}),\s(\d{0,3}),\s(\d{0,3})/;
                    let matches = regexp.exec(value);
                    value = '#'
                        + this.fromIntToHex(parseInt(matches[1]))
                        + this.fromIntToHex(parseInt(matches[2]))
                        + this.fromIntToHex(parseInt(matches[3]));
                }
                if (key === 'background-image') {
                    // Replace the location.href if it exists and decode the value
                    value = decodeURIComponent((value as string).replace(window.location.href, ''));
                    const [, url, type] = /{{.*\s*url="?(.*\.([a-z|A-Z]*))"?\s*}}/.exec(value),
                        image = {
                            "name": url.split('/').pop(),
                            "size": 0,
                            "type": "image/" + type,
                            "url": Config.getInitConfig('media_url') + url
                        };
                    value = [image];
                }

                if (key.startsWith('margin') || key.startsWith('padding')) {
                    const spacingObj = {margin: {}, padding: {}};
                    let [attributeType, attributeDirection] = key.split('-');
                    result['margins_and_padding'] = result['margins_and_padding'] || spacingObj;
                    result['margins_and_padding'][attributeType] = _.extend(result['margins_and_padding'][attributeType], {[attributeDirection]: value.replace('px', '')});
                    return;
                }

                result[key.replace('-', '_')] = value;
            }
        );
        return result;
    }

    /**
     * Convert from snake case to camel case
     *
     * @param {string} string
     * @returns {string}
     */
    private fromSnakeToCamelCase(string: string): string {
        let parts: Array<string> = string.split(/[_-]/);
        let newString: string = '';
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
        let hex = value.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }
}
