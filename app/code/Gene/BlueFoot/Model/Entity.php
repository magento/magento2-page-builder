<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Model;

use Gene\BlueFoot\Api\Data\EntityInterface;
use Magento\Framework\DataObject\IdentityInterface;
use Gene\BlueFoot\Api\ContentBlockRepositoryInterface;

/**
 * Class Entity
 */
class Entity extends \Magento\Framework\Model\AbstractModel implements EntityInterface, IdentityInterface
{
    /**
     * Entity constructor.
     *
     * @param \Magento\Framework\Model\Context $context
     * @param \Magento\Framework\Registry $registry
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null $resourceCollection
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        parent::__construct($context, $registry, $resource, $resourceCollection, $data);
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
}
