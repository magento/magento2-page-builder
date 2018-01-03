<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Model\Attribute\Data\Widget;

/**
 * Class Map
 */
class Map extends \Gene\BlueFoot\Model\Attribute\Data\AbstractWidget implements
    \Gene\BlueFoot\Model\Attribute\Data\WidgetInterface
{
    /**
     * Return Map data from the given field
     *
     * @return mixed
     */
    public function getMap()
    {
        return $this->getEntity()->getData($this->getAttribute()->getData('attribute_code'));
    }

    /**
     * Return an array of basic map data used by the page builder
     *
     * @return array
     */
    public function asJson()
    {
        $map = $this->getMap();
        list($long, $lat, $zoom) = explode(',', $map);

        return [
            'long' => $long,
            'lat' => $lat,
            'zoom' => (int) $zoom
        ];
    }
}
