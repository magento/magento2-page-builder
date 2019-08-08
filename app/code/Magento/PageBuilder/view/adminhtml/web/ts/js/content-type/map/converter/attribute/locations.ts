/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import ConverterInterface from "../../../../converter/converter-interface";
import LocationObject from "../../../../converter/location-object.types";
import {DataObject} from "../../../../data-store";
import {get} from "../../../../utils/object";

export default class Locations implements ConverterInterface {

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        if (value && value !== "") {
            return JSON.parse(value);
        }
        return [];
    }

    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | object}
     */
    public toDom(name: string, data: DataObject): string | object {
        let content = get<LocationObject[]>(data, name);
        if (_.isString(content) && content !== "") {
            content = JSON.parse(content);
        }
        if (content && Object.keys(content).length) {
            content.forEach((marker: any) => {
                if (marker.position) {
                    marker.position.latitude = parseFloat(marker.position.latitude);
                    marker.position.longitude = parseFloat(marker.position.longitude);
                }
            });
            return JSON.stringify(content);
        }
        return JSON.stringify([]);
    }
}
