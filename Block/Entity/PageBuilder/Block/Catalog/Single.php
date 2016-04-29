<?php
/**
 * Class Gene_BlueFoot_Block_Entity_Pagebuilder_Block_Catalog_Single
 *
 * @author Hob Adams <hob@gene.co.uk>
 */
class Gene_BlueFoot_Block_Entity_Pagebuilder_Block_Catalog_Single extends Mage_Catalog_Block_Product_Abstract
{
    /**
     * @return Gene_BlueFoot_Model_Entity|null
     */
    public function getEntity()
    {
        return $this->getData('entity');
    }

    /**
     * Return the attribute text from the entity
     *
     * @param $key
     * @return null
     */
    protected function getAttributeText($key)
    {
        if($this->getEntity()
            && $this->getEntity()->getId()
            && $this->getEntity()->getResource()->getAttribute($key)
            && $this->getEntity()->getResource()->getAttribute($key)->getFrontend()
        ) {
            return $this->getEntity()->getResource()->getAttribute($key)->getFrontend()->getValue($this->getEntity());
        }
        return null;
    }

    /**
     * Get the product
     * @return bool|Mage_Core_Model_Abstract
     */
    public function getProduct()
    {
        /* @var $dataModel Gene_BlueFoot_Model_Attribute_Data_Widget_Product */
        $dataModel = $this->getEntity()->getResource()->getAttribute('product_id')->getDataModel($this->getEntity());
        if ($dataModel instanceof Gene_BlueFoot_Model_Attribute_Data_Widget_Product && method_exists($dataModel, 'getProduct')) {
            return $dataModel->getProduct();
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