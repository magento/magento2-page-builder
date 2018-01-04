<?php

namespace Magento\PageBuilder\Setup\DataConverter\Model\ResourceModel\Attribute\ContentBlock;

/**
 * Class Collection
 *
 * @package Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Collection extends \Magento\Eav\Model\ResourceModel\Entity\Attribute\Set\Collection
{
    /**
     * @var \Magento\Eav\Model\EntityFactory
     */
    protected $eavEntityFactory;

    /**
     * Collection constructor.
     *
     * @param \Magento\Framework\Data\Collection\EntityFactoryInterface    $entityFactory
     * @param \Psr\Log\LoggerInterface                                     $logger
     * @param \Magento\Framework\Data\Collection\Db\FetchStrategyInterface $fetchStrategy
     * @param \Magento\Framework\Event\ManagerInterface                    $eventManager
     * @param \Magento\Eav\Model\EntityFactory                             $eavEntityFactory
     * @param \Magento\Framework\DB\Adapter\AdapterInterface|null          $connection
     * @param \Magento\Framework\Model\ResourceModel\Db\AbstractDb|null    $resource
     */
    public function __construct(
        \Magento\Framework\Data\Collection\EntityFactoryInterface $entityFactory,
        \Psr\Log\LoggerInterface $logger,
        \Magento\Framework\Data\Collection\Db\FetchStrategyInterface $fetchStrategy,
        \Magento\Framework\Event\ManagerInterface $eventManager,
        \Magento\Eav\Model\EntityFactory $eavEntityFactory,
        \Magento\Framework\DB\Adapter\AdapterInterface $connection = null,
        \Magento\Framework\Model\ResourceModel\Db\AbstractDb $resource = null
    ) {
        parent::__construct($entityFactory, $logger, $fetchStrategy, $eventManager, $connection, $resource);
        $this->eavEntityFactory = $eavEntityFactory;

        // Set the entity type filter to only show content blocks
        $this->setEntityTypeFilter(
            $eavEntityFactory->create()->setType(\Gene\BlueFoot\Model\Entity::ENTITY)->getTypeId()
        );
    }

    /**
     * Resource initialization
     *
     * @return void
     * @codeCoverageIgnore
     */
    protected function _construct()
    {
        $this->_init(
            'Magento\PageBuilder\Setup\DataConverter\Model\Attribute\ContentBlock',
            'Magento\PageBuilder\Setup\DataConverter\Model\ResourceModel\Attribute\ContentBlock'
        );
    }

    /**
     * Join the entity type data onto the attribute
     *
     * @return $this
     */
    protected function _beforeLoad()
    {
        parent::_beforeLoad();

        $this->getSelect()->joinLeft(
            ['entity_type' => $this->getTable('gene_bluefoot_entity_type')],
            'main_table.attribute_set_id = entity_type.attribute_set_id',
            '*'
        );

        return $this;
    }
}
