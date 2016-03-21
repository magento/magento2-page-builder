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
     * Return the attribute text from the entity
     *
     * @param $key
     * @return null
     */
    public function getAttributeText($key)
    {
        if($this->getEntity() && $this->getEntity()->getId()) {
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

}