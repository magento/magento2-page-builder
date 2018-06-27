<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Ui\Component\Listing\Columns;

/**
 * The purpose of this class is adding value of invisible 'is_active_label'
 */
class BlockStatus extends \Magento\Ui\Component\Listing\Columns\Column
{
    /** Status column name used to get its column value */
    const SOURCE_FIELD_NAME = 'is_active';

    /**
     * Prepare Data Source
     *
     * @param array $dataSource
     * @return array
     */
    public function prepareDataSource(array $dataSource)
    {
        $dataSource = parent::prepareDataSource($dataSource);

        if (empty($dataSource['data']['items'])) {
            return $dataSource;
        }

        $fieldName = $this->getData('name');

        foreach ($dataSource['data']['items'] as &$item) {
            if (isset($item[self::SOURCE_FIELD_NAME])) {
                $item[$fieldName] = $this->getOptionText($item[self::SOURCE_FIELD_NAME]);
            }
        }

        return $dataSource;
    }

    /**
     * Returns option text by option value
     *
     * @param int $item
     * @return string|null
     */
    private function getOptionText($item)
    {
        $statusesArray = [
            \Magento\Cms\Model\Block::STATUS_ENABLED => __('Active'),
            \Magento\Cms\Model\Block::STATUS_DISABLED => __('Inactive')
        ];
        return isset($statusesArray[$item]) ? $statusesArray[$item]: null;
    }
}
