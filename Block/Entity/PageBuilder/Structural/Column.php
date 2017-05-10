<?php

namespace Gene\BlueFoot\Block\Entity\PageBuilder\Structural;

/**
 * Class Column
 *
 * @package Gene\BlueFoot\Block\Entity\PageBuilder\Structural
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Column extends AbstractStructural
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
