<?php

namespace Gene\BlueFoot\Block\Entity\PageBuilder\Block;

/**
 * Class Base
 *
 * @package Gene\BlueFoot\Block\Entity\PageBuilder\Block
 *
 * @author Hob Adams <hob@gene.co.uk>
 */
class Map extends AbstractBlock
{
    /**
     * Retrieve the map from the data model
     *
     * @return bool|mixed
     */
    public function getMap()
    {
        /* @var $dataModel \Gene\BlueFoot\Model\Attribute\Data\Widget\Map */
        $dataModel = $this->getEntity()->getResource()->getAttribute('map')->getDataModel($this->getEntity());
        if ($dataModel instanceof \Gene\BlueFoot\Model\Attribute\Data\Widget\Map && method_exists($dataModel, 'getMap')) {
            return $dataModel->getMap();
        }
        return false;
    }

    /**
     * Function to get map data as an object
     *
     * @return bool|\Magento\Framework\DataObject
     */
    public function getMapData()
    {
        $map = $this->getEntity()->getMap();
        if ($map) {
            // Convert the map data into separate variables
            list($long, $lat, $zoom) = explode(',', $map);

            return new \Magento\Framework\DataObject(array(
                'long' => $long,
                'lat' => $lat,
                'zoom' => (int) $zoom
            ));
        }
        return false;
    }
}