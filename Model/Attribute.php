<?php

namespace Gene\BlueFoot\Model;

use Magento\Framework\Api\AttributeValueFactory;
use Magento\Catalog\Api\Data\EavAttributeInterface;
use Magento\Framework\Stdlib\DateTime\DateTimeFormatterInterface;

/**
 * Class Attribute
 *
 * @package Gene\BlueFoot\Model
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Attribute extends \Magento\Eav\Model\Attribute
{
    /**
     * Name of the module
     */
    const MODULE_NAME = 'Gene_BlueFoot';

    /**
     * Prefix of model events names
     *
     * @var string
     */
    protected $_eventPrefix = 'gene_bluefoot_entity_attribute';

    /**
     * Prefix of model events object
     *
     * @var string
     */
    protected $_eventObject = 'attribute';

    /**
     * @var \Magento\Framework\ObjectManagerInterface
     */
    protected $_objectManager;

    /**
     * @var \Magento\Framework\Indexer\IndexerRegistry
     */
    protected $indexerRegistry;

    /**
     * Attribute constructor.
     *
     * @param \Magento\Framework\Model\Context                              $context
     * @param \Magento\Framework\Registry                                   $registry
     * @param \Magento\Framework\Api\ExtensionAttributesFactory             $extensionFactory
     * @param \Magento\Framework\Api\AttributeValueFactory                  $customAttributeFactory
     * @param \Magento\Eav\Model\Config                                     $eavConfig
     * @param \Magento\Eav\Model\Entity\TypeFactory                         $eavTypeFactory
     * @param \Magento\Store\Model\StoreManagerInterface                    $storeManager
     * @param \Magento\Eav\Model\ResourceModel\Helper                       $resourceHelper
     * @param \Magento\Framework\Validator\UniversalFactory                 $universalFactory
     * @param \Magento\Eav\Api\Data\AttributeOptionInterfaceFactory         $optionDataFactory
     * @param \Magento\Framework\Reflection\DataObjectProcessor             $dataObjectProcessor
     * @param \Magento\Framework\Api\DataObjectHelper                       $dataObjectHelper
     * @param \Magento\Framework\Stdlib\DateTime\TimezoneInterface          $localeDate
     * @param \Magento\Catalog\Model\Product\ReservedAttributeList          $reservedAttributeList
     * @param \Magento\Framework\Locale\ResolverInterface                   $localeResolver
     * @param \Magento\Framework\Stdlib\DateTime\DateTimeFormatterInterface $dateTimeFormatter
     * @param \Magento\Framework\Indexer\IndexerRegistry                    $indexerRegistry
     * @param \Magento\Framework\ObjectManagerInterface                     $objectManager
     * @param \Gene\BlueFoot\Model\Entity\ReservedAttributeList             $entityReservedAttributeList
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null  $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null            $resourceCollection
     * @param array                                                         $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\Api\ExtensionAttributesFactory $extensionFactory,
        AttributeValueFactory $customAttributeFactory,
        \Magento\Eav\Model\Config $eavConfig,
        \Magento\Eav\Model\Entity\TypeFactory $eavTypeFactory,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Eav\Model\ResourceModel\Helper $resourceHelper,
        \Magento\Framework\Validator\UniversalFactory $universalFactory,
        \Magento\Eav\Api\Data\AttributeOptionInterfaceFactory $optionDataFactory,
        \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor,
        \Magento\Framework\Api\DataObjectHelper $dataObjectHelper,
        \Magento\Framework\Stdlib\DateTime\TimezoneInterface $localeDate,
        \Magento\Catalog\Model\Product\ReservedAttributeList $reservedAttributeList,
        \Magento\Framework\Locale\ResolverInterface $localeResolver,
        DateTimeFormatterInterface $dateTimeFormatter,
        \Magento\Framework\Indexer\IndexerRegistry $indexerRegistry,
        \Magento\Framework\ObjectManagerInterface $objectManager,
        \Gene\BlueFoot\Model\Entity\ReservedAttributeList $entityReservedAttributeList,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        $this->indexerRegistry = $indexerRegistry;
        parent::__construct(
            $context,
            $registry,
            $extensionFactory,
            $customAttributeFactory,
            $eavConfig,
            $eavTypeFactory,
            $storeManager,
            $resourceHelper,
            $universalFactory,
            $optionDataFactory,
            $dataObjectProcessor,
            $dataObjectHelper,
            $localeDate,
            $reservedAttributeList,
            $localeResolver,
            $dateTimeFormatter,
            $resource,
            $resourceCollection,
            $data
        );
        $this->reservedAttributeList = $entityReservedAttributeList;
        $this->_objectManager = $objectManager;
    }

    /**
     * Init resource model
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init('Gene\BlueFoot\Model\ResourceModel\Attribute');
    }

    /**
     * Get the data model for an entity
     *
     * @param \Gene\BlueFoot\Model\Entity $entity
     *
     * @return bool|mixed
     */
    public function getDataModel(\Gene\BlueFoot\Model\Entity $entity)
    {
        $model = $this->getData('data_model');
        if ($model) {
            try {
                $modelInstance = $this->_objectManager->get($model);
                if ($modelInstance) {
                    $modelInstance->setEntity($entity);
                    $modelInstance->setAttribute($this);
                    return $modelInstance;
                }
            } catch (\Exception $e) {
                return false;
            }
        }

        return false;
    }

    /**
     * Return additional data
     *
     * @return mixed|null
     */
    public function getAdditional()
    {
        if ($additional = $this->getAdditionalData()) {
            return json_decode($this->getAdditionalData(), true);
        }

        return null;
    }

    /**
     * Check whether attribute is searchable in admin grid and it is allowed
     *
     * @return bool
     */
    public function canBeSearchableInGrid()
    {
        return $this->getData('is_searchable_in_grid') && in_array($this->getFrontendInput(), ['text', 'textarea']);
    }

    /**
     * Check whether attribute is filterable in admin grid and it is allowed
     *
     * @return bool
     */
    public function canBeFilterableInGrid()
    {
        return $this->getData('is_filterable_in_grid')
        && in_array($this->getFrontendInput(), ['text', 'date', 'select', 'boolean']);
    }

    /**
     * Don't serialize the class variables
     *
     * @return array
     */
    public function __sleep()
    {
        // Don't store the entity type in the cache
        unset($this->_data['entity_type']);

        return array_diff(
            parent::__sleep(),
            ['_objectManager', 'indexerRegistry']
        );
    }

    /**
     * Restore the entity_type
     */
    public function __wakeup()
    {
        parent::__wakeup();

        // Restore the entity type into the data
        $this->_data['entity_type'] = $this->getEntityType();
    }
}
