/**
 * Copyright 2026 Adobe
 * All Rights Reserved.
 */

import {DataObject} from "../../data-store";
import {get} from "../../utils/object";
import ConverterInterface from "../converter-interface";

export default class VideoBackgroundSetting implements ConverterInterface {
    private static readonly DEFAULT = "true";

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string}
     */
    public fromDom(value: string): string {
        return value === null || value === undefined ? VideoBackgroundSetting.DEFAULT : value;
    }

    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string | boolean}
     */
    public toDom(name: string, data: DataObject): string | boolean {
        const value = get<string | boolean>(data, name);

        if (value === null || value === undefined || value === "") {
            return false;
        }

        const setting = value.toString();

        if (setting === VideoBackgroundSetting.DEFAULT && get<string>(data, "background_type") !== "video") {
            return false;
        }

        return setting;
    }
}
