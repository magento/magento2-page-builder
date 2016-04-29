<?php
/**
 * Class Gene_BlueFoot_Block_Entity_Pagebuilder_Block_Staticblock
 *
 * @author Hob Adams <hob@gene.co.uk>
 */
class Gene_BlueFoot_Block_Entity_Pagebuilder_Block_Staticblock extends Gene_BlueFoot_Block_Entity_Pagebuilder_Block_Default
{


    /**
     * @return Gene_BlueFoot_Model_Entity|null
     */
    public function getEntity()
    {
        return $this->getData('entity');
    }


    /**
     * Get the block
     * @return bool|Mage_Core_Model_Abstract
     */
    public function getBlock()
    {
        /* @var $dataModel Gene_BlueFoot_Model_Attribute_Data_Widget_Map */
        $dataModel = $this->getEntity()->getResource()->getAttribute('block_id')->getDataModel($this->getEntity());
        if ($dataModel instanceof Gene_BlueFoot_Model_Attribute_Data_Widget_Staticblock && method_exists($dataModel, 'getBlock')) {
            return $dataModel->getBlock();
        }
        return false;
    }
}