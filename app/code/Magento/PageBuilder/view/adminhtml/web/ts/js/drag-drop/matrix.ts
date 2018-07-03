/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import _ from "underscore";
import Config from "../config";
import ContentTypeConfigInterface from "../content-type-config";
import {AllowedParentsInterface} from "./allowed-parents.d";

const allowedParents: AllowedParentsInterface = {};

/**
 * Build a matrix of which containers each content type can go into, these are determined by the allowed_parents
 * node within the content types configuration
 */
export function generateAllowedParents(): void {
    _.values(Config.getConfig("content_types")).forEach((contentType: ContentTypeConfigInterface) => {
        allowedParents[contentType.name] = contentType.allowed_parents.slice();
    });
}

/**
 * Retrieve the containers a specific content type can be contained in
 *
 * @param {string} contentType
 * @returns {any}
 */
export function getContainersFor(contentType: string): string[] {
    if (allowedParents[contentType]) {
        return allowedParents[contentType];
    }

    return [];
}

/**
 * Generate classes of containers the content type is allowed within
 *
 * @param {string} contentType
 * @returns {string}
 */
export function getAllowedContainersClasses(contentType: string) {
    return getContainersFor(contentType)
        .map((value) => ".content-type-container." + value + "-container").join(", ");
}
