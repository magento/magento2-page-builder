<?php

namespace Gene\BlueFoot\Block\Entity\PageBuilder\Block;

/**
 * Class Base
 *
 * @package Gene\BlueFoot\Block\Entity\PageBuilder\Block
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class AbstractBlock extends \Magento\Framework\View\Element\Template
{
    /**
     * @var \Gene\BlueFoot\Model\Stage\Render
     */
    protected $_render;

    /**
     * @var \Magento\Framework\Data\CollectionFactory
     */
    protected $_dataCollectionFactory;

    /**
     * AbstractBlock constructor.
     *
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param \Gene\BlueFoot\Model\Stage\Render                $render
     * @param \Magento\Framework\Data\CollectionFactory        $dataCollectionFactory
     * @param array                                            $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Gene\BlueFoot\Model\Stage\Render $render,
        \Magento\Framework\Data\CollectionFactory $dataCollectionFactory,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->_render = $render;
        $this->_dataCollectionFactory = $dataCollectionFactory;
    }

    /**
     * @return \Gene\BlueFoot\Model\Entity|null
     */
    public function getEntity()
    {
        return $this->getData('entity');
    }

    /**
     * Array of directions, used for the metrics
     * @var array
     */
    protected $_order = array('top', 'right', 'bottom', 'left');

    /**
     * Return the attribute text from the entity
     *
     * @param $key
     * @return null
     */
    public function getAttributeText($key)
    {
        if($this->getEntity() && $this->getEntity()->getId() && $this->getEntity()->getResource()->getAttribute($key)) {
            return $this->getEntity()->getResource()->getAttribute($key)->getFrontend()->getValue($this->getEntity());
        }
        return null;
    }


    /**
     * Does the entity have child entities for a specific field
     *
     * @param $field
     *
     * @return bool
     */
    public function hasChildEntities($field)
    {
        $structure = $this->getStructure();
        return ($structure && is_array($structure) && isset($structure['children']) && isset($structure['children'][$field]));
    }

    /**
     * Return child entities
     *
     * @param $field
     *
     * @return bool|\Magento\Framework\Data\Collection
     * @throws \Exception
     */
    public function getChildEntities($field)
    {
        $structure = $this->getStructure();
        if ($structure && is_array($structure) && isset($structure['children']) && isset($structure['children'][$field])) {
            $children = $structure['children'][$field];
            $childCollection = $this->_dataCollectionFactory->create();

            // Iterate through the children and build up the blocks
            foreach($children as $child) {
                $block = $this->_render->buildEntityBlock($child);
                if ($block) {
                    $childCollection->addItem($block);
                }
            }

            return $childCollection;
        }

        return false;
    }

    /**
     * Return the amount of child entities
     *
     * @param $field
     *
     * @return int|void
     */
    public function getChildEntitiesCount($field)
    {
        if ($this->hasChildEntities($field)) {
            $structure = $this->getStructure();
            return count($structure['children'][$field]);
        }

        return 0;
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