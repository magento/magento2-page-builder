<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilderDataMigration\Setup\DataConverter\ChildrenRenderer;

use Magento\PageBuilderDataMigration\Setup\DataConverter\ChildrenRendererInterface;
use Magento\PageBuilderDataMigration\Setup\DataConverter\Renderer\Column;

/**
 * Children renderer which handles wrapping columns in column groups
 */
class Row implements ChildrenRendererInterface
{
    /**
     * @inheritdoc
     */
    public function render(array $children, $renderChildCallback) : string
    {
        $childHtml = '';
        $columns = [];
        foreach ($children as $childIndex => $childItem) {
            if (isset($childItem['type']) && $childItem['type'] === 'column') {
                $columns[] = $childItem;
            } else {
                // If there's mixed content in the row we need to render the columns before the next item
                if (count($columns) > 0) {
                    $childHtml .= $this->renderColumnGroup($columns, $childIndex, $renderChildCallback);
                    $columns = [];
                }
                $childHtml .= $renderChildCallback($childItem, $childIndex);
            }
        }

        // If we have additional columns to process append them
        if (count($columns) > 0) {
            $childHtml .= $this->renderColumnGroup($columns, 0, $renderChildCallback);
        }

        return $childHtml;
    }

    /**
     * Wrap columns in a column group
     *
     * @param array $columns
     * @param number $childIndex
     * @param \Closure $renderChildCallback
     *
     * @return string
     */
    private function renderColumnGroup($columns, $childIndex, $renderChildCallback)
    {
        $childHtml = '';

        $currentTotalWidth = 0;
        $columnsInGroup = [];
        foreach ($columns as $index => $column) {
            $currentTotalWidth += $this->getColumnWidth($column);
            $columnsInGroup[] = $column;

            /**
             * Check to see if the next columns width would cause itself to wrap, meaning we need to insert an empty
             * column to ensure the total width of this group is 100%. Also check if we're the last column in the
             * current set and the total width is below 1, then we need to add an empty column.
             */
            if ($currentTotalWidth < 1
                && (isset($columns[$index + 1]) && $currentTotalWidth + $this->getColumnWidth($columns[$index + 1]) > 1)
                || (count($columns) - 1 === $index && $currentTotalWidth < 1)
            ) {
                $remainingWidth = 1 - $currentTotalWidth;
                $columnsInGroup[] = [
                    'type' => 'column',
                    'formData' => [
                        'width' => $remainingWidth
                    ]
                ];
                $currentTotalWidth += $remainingWidth;
            }

            if ($currentTotalWidth == 1) {
                $childHtml .= $renderChildCallback(['type' => 'column_group'], $childIndex, $columnsInGroup);
                $currentTotalWidth = 0;
                $columnsInGroup = [];
            }
        }

        return $childHtml;
    }

    /**
     * Retrieve the column width
     *
     * @param array $column
     *
     * @return float
     */
    private function getColumnWidth(array $column)
    {
        if (!isset($column['formData']['width'])) {
            return 0;
        }

        return $column['formData']['width'];
    }
}
