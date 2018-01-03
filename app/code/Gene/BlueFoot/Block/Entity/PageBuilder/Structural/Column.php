<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Block\Entity\PageBuilder\Structural;

/**
 * Class Column
 */
class Column
{
    /**
     * Return the column width
     *
     * @return mixed|null
     */
    protected function getWidth()
    {
        return $this->getEntityData('width');
    }

    /**
     * Return the number of columns based on the width
     *
     * @param int $total
     * @return float
     */
    public function getColumnsFromWidth($total = 12)
    {
        // Work out the columns based on the total number of columns
        return round($this->getWidth() * $total);
    }
}
