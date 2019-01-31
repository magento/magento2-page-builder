/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../../config";
import ContentTypeCollectionInterface from "../../content-type-collection.types";
import createContentType from "../../content-type-factory";
import ColumnPreview from "../column/preview";

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
): Promise<ContentTypeCollectionInterface<ColumnPreview>> {
    return createContentType(
        Config.getContentTypeConfig("column"),
        parent,
        parent.stageId,
        {width: parseFloat(width.toString()) + "%"},
    ).then((column: ContentTypeCollectionInterface<ColumnPreview>) => {
        parent.addChild(column, index);
        return column;
    }).catch((error) => {
        console.error(error);
        return null;
    });
}
