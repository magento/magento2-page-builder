/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../../config";
import ContentTypeCollectionInterface from "../../content-type-collection.d";
import createContentType from "../../content-type-factory";

/**
 * Create a column and add it to it's parent
 *
 * @param {ContentTypeCollectionInterface} parent
 * @param {number} width
 * @param {number} index
 * @returns {Promise<ContentTypeCollectionInterface>}
 */
export function createColumn(
    parent: ContentTypeCollectionInterface,
    width: number,
    index?: number,
): Promise<ContentTypeCollectionInterface> {
    return createContentType(
        Config.getContentTypeConfig("column"),
        parent,
        parent.stageId,
        {width: parseFloat(width.toString()) + "%"},
    ).then((column) => {
        parent.addChild(column, index);
        return column;
    });
}
