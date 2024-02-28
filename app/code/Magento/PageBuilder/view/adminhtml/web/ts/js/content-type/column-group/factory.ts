/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ColumnLinePreview from "Magento_PageBuilder/js/content-type/column-line/preview";
import Config from "../../config";
import ContentTypeCollectionInterface from "../../content-type-collection.types";
import createContentType from "../../content-type-factory";
import ColumnPreview from "../column/preview";

/**
 * Create a column and add it to it's column group
 *
 * @param {ContentTypeCollectionInterface} columnGroup
 * @param {number} width
 * @param {number} index
 * @returns {Promise<ContentTypeCollectionInterface>}
 */
export function createColumn(
    columnGroup: ContentTypeCollectionInterface,
    width: number,
    index?: number,
): Promise<ContentTypeCollectionInterface<ColumnPreview>> {
    return createContentType(
        Config.getContentTypeConfig("column"),
        columnGroup,
        columnGroup.stageId,
        {width: parseFloat(width.toString()) + "%"},
    ).then((column: ContentTypeCollectionInterface<ColumnPreview>) => {
        columnGroup.addChild(column, index);
        return column;
    }).catch((error) => {
        console.error(error);
        return null;
    });
}

/**
 * Create a column and add it to it's column group
 *
 * @param {ContentTypeCollectionInterface} columnGroup
 * @param {number} width
 * @param {number} index
 * @returns {Promise<ContentTypeCollectionInterface>}
 */
export function createColumnLine(
    columnGroup: ContentTypeCollectionInterface,
    width: number,
    index?: number,
): Promise<ContentTypeCollectionInterface<ColumnLinePreview>> {
    return createContentType(
        Config.getContentTypeConfig("column-line"),
        columnGroup,
        columnGroup.stageId,
        {width: parseFloat(width.toString()) + "%"},
    ).then((columnLine: ContentTypeCollectionInterface<ColumnLinePreview>) => {
        columnGroup.addChild(columnLine, index);
        return columnLine;
    }).catch((error) => {
        console.error(error);
        return null;
    });
}
