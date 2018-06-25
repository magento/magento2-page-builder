/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../../config";
import createContentType from "../../content-type-factory";
import Column from "../column/preview";
import ColumnGroup from "./preview";

/**
 * Create a column and add it to it's parent
 *
 * @param {ColumnGroup} parent
 * @param {number} width
 * @param {number} index
 * @returns {Promise<Column>}
 * @api
 */
export function createColumn(parent: ColumnGroup, width: number, index?: number): Promise<Column> {
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
