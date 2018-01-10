<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Model\ResourceModel\Attribute;

/**
 * Class Collection
 */
class Collection extends \Magento\Eav\Model\ResourceModel\Entity\Attribute\Collection
{
    /**
     * Default attribute entity type code
     *
     * @var string
     */
    protected $_entityTypeCode = 'gene_bluefoot_entity';

    /**
     * Entity factory
     *
     * @var \Magento\Eav\Model\EntityFactory
     */
    protected $eavEntityFactory;

    /**
     * @param \Magento\Framework\Data\Collection\EntityFactory $entityFactory
     * @param \Psr\Log\LoggerInterface $logger
     * @param \Magento\Framework\Data\Collection\Db\FetchStrategyInterface $fetchStrategy
     * @param \Magento\Framework\Event\ManagerInterface $eventManager
     * @param \Magento\Eav\Model\EntityFactory $eavEntityFactory
     * @param \Magento\Eav\Model\Config $eavConfig
     * @param \Magento\Framework\DB\Adapter\AdapterInterface $connection
     * @param \Magento\Framework\Model\ResourceModel\Db\AbstractDb $resource
     */
    public function __construct(
        \Magento\Framework\Data\Collection\EntityFactory $entityFactory,
        \Psr\Log\LoggerInterface $logger,
        \Magento\Framework\Data\Collection\Db\FetchStrategyInterface $fetchStrategy,
        \Magento\Framework\Event\ManagerInterface $eventManager,
        \Magento\Eav\Model\Config $eavConfig,
        \Magento\Eav\Model\EntityFactory $eavEntityFactory,
        \Magento\Framework\DB\Adapter\AdapterInterface $connection = null,
        \Magento\Framework\Model\ResourceModel\Db\AbstractDb $resource = null
    ) {
        $this->eavEntityFactory = $eavEntityFactory;
        parent::__construct($entityFactory, $logger, $fetchStrategy, $eventManager, $eavConfig, $connection, $resource);
    }

    /**
     * Resource model initialization
     *
     * @return void
     * @codeCoverageIgnore
     */
    protected function _construct()
    {
        $this->_init('Magento\PageBuilder\Model\Attribute', 'Magento\PageBuilder\Model\ResourceModel\Attribute');
    }

    /**
     * Default attribute entity type code
     *
     * @return string
     */
    protected function _getEntityTypeCode()
    {
        return $this->entityTypeCode;
    }

    /**
     * Get EAV website table
     *
     * Get table, where website-dependent attribute parameters are stored
     * If realization doesn't demand this functionality, let this function just return null
     *
     * @return string|null
     */
    protected function _getEavWebsiteTable()
    {
        return null;
    }

    /**
     * Main select object initialization.
     * Joins catalog/eav_attribute table
     *
     * @return $this
     */
    protected function _initSelect()
    {
        $this->getSelect()->from(
            ['main_table' => $this->getResource()->getMainTable()]
        )->where(
            'main_table.entity_type_id=?',
            $this->eavEntityFactory->create()->setType(\Magento\PageBuilder\Model\Entity::ENTITY)->getTypeId()
        )->join(
            ['additional_table' => $this->getTable('gene_bluefoot_eav_attribute')],
            'additional_table.attribute_id = main_table.attribute_id'
        );
        return $this;
    }

    /**
     * Specify attribute entity type filter
     *
     * @param int $typeId
     * @return $this
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function setEntityTypeFilter($typeId)
    {
        return $this;
    }
}
