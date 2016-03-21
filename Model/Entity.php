<?php

namespace Gene\BlueFoot\Model;

/**
 * Class Entity
 *
 * @package Gene\BlueFoot\Model
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Entity extends \Magento\Framework\Model\AbstractModel
{
    const ENTITY = 'gene_bluefoot_entity';

    /**
     * @var \Gene\BlueFoot\Model\Entity\FrontendFactory
     */
    protected $_frontend;

    /**
     * @var \Gene\BlueFoot\Model\Entity\Frontend
     */
    protected $_frontendInstance = null;

    /**
     * @var \Gene\BlueFoot\Model\Attribute\ContentBlockFactory
     */
    protected $_contentBlock;

    /**
     * Entity constructor.
     *
     * @param \Magento\Framework\Model\Context                             $context
     * @param \Magento\Framework\Registry                                  $registry
     * @param \Gene\BlueFoot\Model\Entity\FrontendFactory                  $frontend
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null           $resourceCollection
     * @param array                                                        $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Gene\BlueFoot\Model\Entity\FrontendFactory $frontend,
        \Gene\BlueFoot\Model\Attribute\ContentBlockFactory $contentBlockFactory,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        parent::__construct($context, $registry, $resource, $resourceCollection, $data);
        $this->_frontend = $frontend;
        $this->_contentBlock = $contentBlockFactory;
    }

    /**
     * Initialize customer model
     *
     * @return void
     */
    public function _construct()
    {
        $this->_init('Gene\BlueFoot\Model\ResourceModel\Entity');
    }

    /**
     * Return the front-end model
     *
     * @return mixed
     */
    public function getFrontend()
    {
        if ($this->getId()) {
            if (is_null($this->_frontendInstance)) {
                $this->_frontendInstance = $this->_frontend->create();
                $this->_frontendInstance->setEntity($this);
            }
            return $this->_frontendInstance;
        }

        return null;
    }

    /**
     * Get the content block for the entity
     *
     * @return $this|bool
     */
    public function getContentBlock()
    {
        if ($attributeSetId = $this->getAttributeSetId()) {
            $contentBlock = $this->_contentBlock->create()->load($attributeSetId);
            if ($contentBlock->getId()) {
                return $contentBlock;
            }
        }

        return false;
    }
}