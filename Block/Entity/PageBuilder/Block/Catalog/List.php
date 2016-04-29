<?php
/**
 * Class Gene_BlueFoot_Block_Entity_Pagebuilder_Block_Catalog_List
 *
 * @author Hob Adams <hob@gene.co.uk>
 */
class Gene_BlueFoot_Block_Entity_Pagebuilder_Block_Catalog_List extends Mage_Catalog_Block_Product_Abstract
{


    /**
     * @return Gene_BlueFoot_Model_Entity|null
     */
    public function getEntity()
    {
        return $this->getData('entity');
    }

    /**
     * Return array of SKUs
     * @return array|bool
     */
    protected function _getSkuArray()
    {
        if ($skuList = $this->getEntity()->getSkuList()) {
            $skuArray = explode(' ', $skuList);
            if (!empty($skuArray)) {
                return $skuArray;
            }
        }

        return false;
    }



    /**
     * Get the product collection
     * @return bool|Mage_Core_Model_Abstract
     */
    public function getProductCollection()
    {
        /* @var $dataModel Gene_BlueFoot_Model_Attribute_Data_Widget_Category */
        $dataModel = $this->getEntity()->getResource()->getAttribute('category_id')->getDataModel($this->getEntity());
        if ($dataModel instanceof Gene_BlueFoot_Model_Attribute_Data_Widget_Category && method_exists($dataModel, 'getProductCollection')) {
            return $dataModel->getProductCollection();
        }
        return false;
    }


    /**
     * Function to return css classes as a well formatted string
     * @return string
     */
    public function getCssAttributes()
    {
        $html = 'bluefoot-entity';

        // Add Align class
        $align = '';
        if ($align = $this->getEntity()->getAlign()) {
            $align = 'bluefoot-align-' . $align;
        }

        // Build and array of classes from the entity, the block and the alignment
        $classes = $this->parseCss($this->getCssClasses() . ' ' . $align . ' ' . $this->getEntity()->getCssClasses());

        if (!empty($classes)) {

            // Loop through all the classes
            foreach($classes as $class) {
                $html .= ' ' . $class;
            }
        }
        return $html;
    }


    /**
     * Convert classes to an array with only unique values
     * @param bool|false $string
     * @return array
     */
    public function parseCss($string = false)
    {
        $array = array();
        if($string) {
            $array = explode(' ', trim($string));
        }
        return array_unique(array_filter($array));
    }

    /**
     * Function to build up the style attributes of a block
     * @return string
     */
    public function getStyleAttributes()
    {
        if ($this->getStyles() || $this->parseMetrics()) {
            $html = ' style="';
            $html .= $this->getStyles() . $this->parseMetrics();
            $html .= '"';
            return $html;
        }
        return '';
    }

    /**
     * Array of directions, used for the metrics
     * @var array
     */
    protected $_order = array('top', 'right', 'bottom', 'left');

    /**
     * Function to return the metrics as a useful string
     * @return string
     */
    public function parseMetrics()
    {
        $html = '';
        if($this->getEntity() && $this->getEntity()->getMetric()) {

            foreach(json_decode($this->getEntity()->getMetric(), true) as $key => $string) {

                $values = explode(' ', $string);

                // Loop through all metrics and add any with values
                $i = 0; foreach ($values as $value) {
                    if ($value != '-') {
                        $html .= $key . '-' . $this->_order[$i] . ':' . $value . ';';
                    }
                    $i++;
                }
            }
        }
        return $html;
    }
}