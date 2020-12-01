/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../../config";
import ContentTypeCollection from "../../content-type-collection";
import ContentTypeInterface from "../../content-type.types";
import {GeneratedElementsData} from "../../content-type/observable-updater.types";
import { DataObject } from "../../data-store";

export interface TreeItem {
    name: string;
    id: string;
    data: DataObject;
    children: TreeItem[];
    viewportsData: {[key: string]: DataObject};
}

/**
 * Serialize the tree as a simplified object for rendering
 *
 * @param contentType
 */
export function buildTree(contentType: ContentTypeInterface) {
    const data = getData(contentType);
    const viewportsData = getViewportsData(contentType);
    const tree: TreeItem = {
        name: contentType.config.name,
        id: contentType.id,
        data,
        children: [],
        viewportsData,
    };

    if (contentType instanceof ContentTypeCollection && contentType.getChildren()().length > 0) {
        contentType.getChildren()().forEach((child) => {
            tree.children.push(buildTree(child));
        });
    }

    return tree;
}

/**
 * Get a serialized version of the tree
 *
 * @param contentType
 */
export function getSerializedTree(contentType: ContentTypeInterface) {
    return buildTree(contentType);
}

/**
 * Retrieve the master data from the content types instance
 *
 * @param contentType
 */
function getData(contentType: ContentTypeInterface): GeneratedElementsData {
    /**
     * Flip flop to JSON and back again to ensure all data is serializable. Magento by default adds functions into
     * some basic types which cannot be serialized when calling PostMessage.
     */
    return JSON.parse(JSON.stringify(contentType.dataStores[Config.getConfig("defaultViewport")].getState())) || {};
}

/**
 * Retrieve the master data from the content types instance
 *
 * @param contentType
 */
function getViewportsData(contentType: ContentTypeInterface): {[key: string]: GeneratedElementsData} {
    /**
     * Flip flop to JSON and back again to ensure all data is serializable. Magento by default adds functions into
     * some basic types which cannot be serialized when calling PostMessage.
     */
    const result: {[key: string]: GeneratedElementsData} = {};

    Object.keys(contentType.dataStores).forEach((name: string) => {
        result[name] = JSON.parse(JSON.stringify(contentType.dataStores[name].getState())) || {};
    });

    return result;
}
