<?php

namespace Gene\BlueFoot\Model\ResourceModel\Entity;

/**
 * Class Collection
 *
 * @package Gene\BlueFoot\Model\ResourceModel\Entity
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Collection extends \Magento\Eav\Model\Entity\Collection\VersionControl\AbstractCollection
{
    /**
     * Name of collection model
     */
    const ENTITY_MODEL_NAME = 'Gene\BlueFoot\Model\Entity';

    /**
     * @var \Magento\Framework\DataObject\Copy\Config
     */
    protected $fieldsetConfig;

    /**
     * @var string
     */
    protected $modelName;

    /**
     * Collection constructor.
     *
     * @param \Magento\Framework\Data\Collection\EntityFactory                  $entityFactory
     * @param \Psr\Log\LoggerInterface                                          $logger
     * @param \Magento\Framework\Data\Collection\Db\FetchStrategyInterface      $fetchStrategy
     * @param \Magento\Framework\Event\ManagerInterface                         $eventManager
     * @param \Magento\Eav\Model\Config                                         $eavConfig
     * @param \Magento\Framework\App\ResourceConnection                         $resource
     * @param \Magento\Eav\Model\EntityFactory                                  $eavEntityFactory
     * @param \Magento\Eav\Model\ResourceModel\Helper                           $resourceHelper
     * @param \Magento\Framework\Validator\UniversalFactory                     $universalFactory
     * @param \Magento\Framework\Model\ResourceModel\Db\VersionControl\Snapshot $entitySnapshot
     * @param \Magento\Framework\DataObject\Copy\Config                         $fieldsetConfig
     * @param \Magento\Framework\DB\Adapter\AdapterInterface|null               $connection
     * @param string                                                            $modelName
     */
    public function __construct(
        \Magento\Framework\Data\Collection\EntityFactory $entityFactory,
        \Psr\Log\LoggerInterface $logger,
        \Magento\Framework\Data\Collection\Db\FetchStrategyInterface $fetchStrategy,
        \Magento\Framework\Event\ManagerInterface $eventManager,
        \Magento\Eav\Model\Config $eavConfig,
        \Magento\Framework\App\ResourceConnection $resource,
        \Magento\Eav\Model\EntityFactory $eavEntityFactory,
        \Magento\Eav\Model\ResourceModel\Helper $resourceHelper,
        \Magento\Framework\Validator\UniversalFactory $universalFactory,
        \Magento\Framework\Model\ResourceModel\Db\VersionControl\Snapshot $entitySnapshot,
        \Magento\Framework\DataObject\Copy\Config $fieldsetConfig,
        \Magento\Framework\DB\Adapter\AdapterInterface $connection = null,
        $modelName = self::ENTITY_MODEL_NAME
    ) {
        $this->fieldsetConfig = $fieldsetConfig;
        $this->modelName = $modelName;
        parent::__construct(
            $entityFactory,
            $logger,
            $fetchStrategy,
            $eventManager,
            $eavConfig,
            $resource,
            $eavEntityFactory,
            $resourceHelper,
            $universalFactory,
            $entitySnapshot,
            $connection
        );
    }

    /**
     * Resource initialization
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init('Gene\BlueFoot\Model\Entity', 'Gene\BlueFoot\Model\ResourceModel\Entity');
    }
}
