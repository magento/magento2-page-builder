<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Model\Attribute\Data;

/**
 * Interface WidgetInterface
 *
 */
interface WidgetInterface
{
    const ENTITY = 'entity';
    const ATTRIBUTE = 'attribute';

    /**
     * Return the entity
     *
     * @return \Gene\BlueFoot\Model\Entity
     */
    public function getEntity();

    /**
     * Return the attribute
     *
     * @return \Gene\BlueFoot\Model\Attribute
     */
    public function getAttribute();

    /**
     * Return the data models data as JSON
     *
     * @return array
     */
    public function asJson();
}
