<?php

namespace Gene\BlueFoot\Block\Entity\PageBuilder\Block;

/**
 * Class StaticBlock
 *
 * @package Gene\BlueFoot\Block\Entity\PageBuilder\Block
 *
 * @author  Hob Adams <hob@gene.co.uk>
 */
class StaticBlock extends AbstractBlock
{
    /**
     * Retrieve the static block from the data model
     *
     * @return bool|mixed
     */
    public function getBlock()
    {
        /* @var $dataModel \Gene\BlueFoot\Model\Attribute\Data\Widget\StaticBlock */
        $dataModel = $this->getEntity()->getResource()->getAttribute('block_id')->getDataModel($this->getEntity());
        if ($dataModel instanceof \Gene\BlueFoot\Model\Attribute\Data\Widget\StaticBlock &&
            method_exists($dataModel, 'getBlock')
        ) {
            return $dataModel->getBlock();
        }

        return false;
    }
}
