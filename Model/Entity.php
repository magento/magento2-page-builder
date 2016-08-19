<?php

namespace Gene\BlueFoot\Model;

use Gene\BlueFoot\Api\Data\EntityInterface;
use Magento\Framework\DataObject\IdentityInterface;
use Gene\BlueFoot\Api\ContentBlockRepositoryInterface;

/**
 * Class Entity
 *
 * @package Gene\BlueFoot\Model
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Entity extends \Magento\Framework\Model\AbstractModel implements EntityInterface, IdentityInterface
{
     /**
     * @var \Gene\BlueFoot\Model\Entity\FrontendFactory
     */
    protected $frontend;

    /**
     * @var \Gene\BlueFoot\Model\Entity\Frontend
     */
    protected $frontendInstance = null;

    /**
     * @var \Gene\BlueFoot\Model\Attribute\ContentBlockFactory
     */
    protected $contentBlock;

    /**
     * @var \Gene\BlueFoot\Api\ContentBlockRepositoryInterface
     */
    protected $contentBlockRepository;

    /**
     * Entity constructor.
     *
     * @param \Magento\Framework\Model\Context                             $context
     * @param \Magento\Framework\Registry                                  $registry
     * @param \Gene\BlueFoot\Model\Entity\FrontendFactory                  $frontend
     * @param \Gene\BlueFoot\Model\Attribute\ContentBlockFactory           $contentBlockFactory
     * @param \Gene\BlueFoot\Api\ContentBlockRepositoryInterface           $contentBlockRepositoryInterface
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null           $resourceCollection
     * @param array                                                        $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Gene\BlueFoot\Model\Entity\FrontendFactory $frontend,
        \Gene\BlueFoot\Model\Attribute\ContentBlockFactory $contentBlockFactory,
        ContentBlockRepositoryInterface $contentBlockRepositoryInterface,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        parent::__construct($context, $registry, $resource, $resourceCollection, $data);
        $this->frontend = $frontend;
        $this->contentBlock = $contentBlockFactory;
        $this->contentBlockRepository = $contentBlockRepositoryInterface;
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
     * Return the identities associated with the model
     *
     * @return array
     */
    public function getIdentities()
    {
        return [self::CACHE_TAG . '_' . $this->getId()];
    }

    /**
     * Return the front-end model
     *
     * @return mixed
     */
    public function getFrontend()
    {
        if ($this->getId()) {
            if ($this->frontendInstance === null) {
                $this->frontendInstance = $this->frontend->create();
                $this->frontendInstance->setEntity($this);
            }
            return $this->frontendInstance;
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
            try {
                $contentBlock = $this->contentBlockRepository->getById($attributeSetId);
                if ($contentBlock->getId()) {
                    return $contentBlock;
                }
            } catch (\Exception $e) {
                return false;
            }
        }

        return false;
    }
}
