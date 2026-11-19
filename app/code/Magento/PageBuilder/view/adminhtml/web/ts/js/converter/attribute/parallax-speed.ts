/**
 * Copyright 2026 Adobe
 * All Rights Reserved.
 */

import {DataObject} from "../../data-store";
import {get} from "../../utils/object";
import ConverterInterface from "../converter-interface";

export default class ParallaxSpeed implements ConverterInterface {
    private static readonly DEFAULT = "0.5";

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string}
     */
    public fromDom(value: string): string {
        return value === null || value === undefined ? ParallaxSpeed.DEFAULT : value;
    }

    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string | boolean}
     */
    public toDom(name: string, data: DataObject): string | boolean {
        const value = get<string | number>(data, name);

        if (value === null || value === undefined || value === "") {
            return false;
        }

        const speed = value.toString();
        const enableParallax = get<string | number>(data, "enable_parallax");

        if (speed === ParallaxSpeed.DEFAULT && (!enableParallax || enableParallax === "0")) {
            return false;
        }

        return speed;
    }
}
