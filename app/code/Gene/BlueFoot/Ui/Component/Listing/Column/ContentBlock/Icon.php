<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Ui\Component\Listing\Column\ContentBlock;

/**
 * Class Icon
 */
class Icon extends \Magento\Ui\Component\Listing\Columns\Column
{
    /**
     * Convert icon value into HTML markup
     *
     * @param array $dataSource
     * @return array
     */
    public function prepareDataSource(array $dataSource)
    {
        if (isset($dataSource['data']['items'])) {
            foreach ($dataSource['data']['items'] as & $item) {
                if (isset($item[$this->getData('name')])) {
                    $item[$this->getData('name')] = $this->getMarkup($item[$this->getData('name')]);
                }
            }
        }

        return $dataSource;
    }

    /**
     * Retrieve markup for icon
     *
     * @param $value
     * @return string
     */
    protected function getMarkup($value)
    {
        return '<i style="color:#444; font-size:24px;" class="' . $value . '"></i>';
    }
}
