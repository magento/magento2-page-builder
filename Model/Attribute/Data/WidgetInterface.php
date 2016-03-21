<?php

namespace Gene\BlueFoot\Model\Attribute\Data;

/**
 * Interface WidgetInterface
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
interface WidgetInterface
{
    /**
     * Return the data models data as JSON
     *
     * @return array
     */
    public function asJson();
}