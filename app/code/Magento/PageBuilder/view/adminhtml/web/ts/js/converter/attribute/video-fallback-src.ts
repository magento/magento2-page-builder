/**
 * Copyright 2026 Adobe
 * All Rights Reserved.
 */

import {DataObject} from "../../data-store";
import {get} from "../../utils/object";
import ConverterInterface from "../converter-interface";
import Src from "./src";

export default class VideoFallbackSrc implements ConverterInterface {
    private src: Src = new Src();

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        return this.src.fromDom(value);
    }

    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string | boolean}
     */
    public toDom(name: string, data: DataObject): string | boolean {
        if (get<string>(data, "background_type") !== "video") {
            return false;
        }

        return this.src.toDom(name, data);
    }
}
