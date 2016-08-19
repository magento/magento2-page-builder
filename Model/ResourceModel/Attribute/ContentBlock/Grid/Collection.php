<?php

namespace Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\Grid;

/**
 * Class Collection
 *
 * @package Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\Grid
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Collection extends \Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\Collection
{
    /**
     * @var \Magento\Framework\Registry
     */
    protected $_registryManager;

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Entity
     */
    protected $_entityModel;

    /**
     * Collection constructor.
     *
     * @param \Magento\Framework\Data\Collection\EntityFactory             $entityFactory
     * @param \Psr\Log\LoggerInterface                                     $logger
     * @param \Magento\Framework\Data\Collection\Db\FetchStrategyInterface $fetchStrategy
     * @param \Magento\Framework\Event\ManagerInterface                    $eventManager
     * @param \Magento\Eav\Model\EntityFactory                             $eavEntityFactory
     * @param \Magento\Framework\Registry                                  $registryManager
     * @param \Gene\BlueFoot\Model\ResourceModel\Entity                    $entityModel
     * @param \Magento\Framework\DB\Adapter\AdapterInterface|null          $connection
     * @param \Magento\Framework\Model\ResourceModel\Db\AbstractDb|null    $resource
     */
    public function __construct(
        \Magento\Framework\Data\Collection\EntityFactory $entityFactory,
        \Psr\Log\LoggerInterface $logger,
        \Magento\Framework\Data\Collection\Db\FetchStrategyInterface $fetchStrategy,
        \Magento\Framework\Event\ManagerInterface $eventManager,
        \Magento\Eav\Model\EntityFactory $eavEntityFactory,
        \Magento\Framework\Registry $registryManager,
        \Gene\BlueFoot\Model\ResourceModel\Entity $entityModel,
        \Magento\Framework\DB\Adapter\AdapterInterface $connection = null,
        \Magento\Framework\Model\ResourceModel\Db\AbstractDb $resource = null
    ) {
        $this->_registryManager = $registryManager;
        $this->_entityModel = $entityModel;
        parent::__construct($entityFactory, $logger, $fetchStrategy, $eventManager, $eavEntityFactory, $connection, $resource);
    }

    /**
     *  Add filter by entity type id to collection
     *
     * @return \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection|$this
     */
    protected function _initSelect()
    {
        parent::_initSelect();

        // Only display content block entity types
        $this->setEntityTypeFilter($this->_registryManager->registry('entityType'));

        // Exclude the default content block from the grid collection
        $entityType = $this->_entityModel->getEntityType();
        if ($entityType->getId() && ($defaultAttributeSetId = $entityType->getDefaultAttributeSetId())) {
            $this->addFieldToFilter('main_table.attribute_set_id', array('neq' => $defaultAttributeSetId));
        }

        return $this;
    }
}
