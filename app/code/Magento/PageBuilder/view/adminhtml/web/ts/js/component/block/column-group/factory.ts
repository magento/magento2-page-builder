/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import Config from "../../config";
import Column from "../column";
import ColumnGroup from "../column-group";
import createBlock from "../factory";

/**
 * Create a column and add it to it's parent
 *
 * @param {ColumnGroup} parent
 * @param {number} width
 * @param {number} index
 * @returns {Promise<Column>}
 */
export function createColumn(parent: ColumnGroup, width: number, index?: number): Promise<Column> {
    return createBlock(
        Config.getContentTypeConfig("column"),
        parent,
        parent.stageId,
        {width: parseFloat(width.toString()) + "%"},
    ).then((column) => {
        parent.addChild(column, index);
        return column;
    });
}
