<?php

namespace Gene\BlueFoot\Model\Attribute;

use Magento\Framework\Api\AttributeValueFactory;

/**
 * Class ContentBlock
 *
 * @package Gene\BlueFoot\Model\Attribute
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class ContentBlock extends \Magento\Eav\Model\Entity\Attribute\Set
{
    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\EntityFactory
     */
    protected $entityFactory;

    /**
     * @var \Gene\BlueFoot\Model\Config\ConfigInterface
     */
    protected $configInterface;

    /**
     * @var null|array
     */
    protected $config = null;

    const AREA_FRONTEND = 'frontend';
    const AREA_ADMINHTML = 'adminhtml';

    /**
     * ContentBlock constructor.
     *
     * @param \Magento\Framework\Model\Context                             $context
     * @param \Magento\Framework\Registry                                  $registry
     * @param \Magento\Framework\Api\ExtensionAttributesFactory            $extensionFactory
     * @param \Magento\Framework\Api\AttributeValueFactory                 $customAttributeFactory
     * @param \Magento\Eav\Model\Config                                    $eavConfig
     * @param \Magento\Eav\Model\Entity\Attribute\GroupFactory             $attrGroupFactory
     * @param \Magento\Eav\Model\Entity\AttributeFactory                   $attributeFactory
     * @param \Magento\Eav\Model\ResourceModel\Entity\Attribute            $resourceAttribute
     * @param \Gene\BlueFoot\Model\ResourceModel\EntityFactory             $entityFactory
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null           $resourceCollection
     * @param array                                                        $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\Api\ExtensionAttributesFactory $extensionFactory,
        AttributeValueFactory $customAttributeFactory,
        \Magento\Eav\Model\Config $eavConfig,
        \Magento\Eav\Model\Entity\Attribute\GroupFactory $attrGroupFactory,
        \Magento\Eav\Model\Entity\AttributeFactory $attributeFactory,
        \Magento\Eav\Model\ResourceModel\Entity\Attribute $resourceAttribute,
        \Gene\BlueFoot\Model\ResourceModel\EntityFactory $entityFactory,
        \Gene\BlueFoot\Model\Config\ConfigInterface $configInterface,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        parent::__construct(
            $context,
            $registry,
            $extensionFactory,
            $customAttributeFactory,
            $eavConfig,
            $attrGroupFactory,
            $attributeFactory,
            $resourceAttribute,
            $resource,
            $resourceCollection,
            $data
        );

        $this->entityFactory = $entityFactory;
        $this->configInterface = $configInterface;
    }

    /**
     * Initialize resource model
     *
     * @return void
     * @codeCoverageIgnore
     */
    protected function _construct()
    {
        $this->_init('Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock');
    }

    /**
     * Return all the attributes associated with this content block
     *
     * @return array|null
     */
    public function getAllAttributes()
    {
        if ($this->getId()) {
            $entityResource = $this->entityFactory->create();
            return $entityResource->loadAllAttributes()
                ->getSortedAttributes($this->getId());
        }

        return null;
    }

    /**
     * Retrieve the content blocks configuration
     *
     * @param $area
     * @param $key
     *
     * @return array|mixed|null
     */
    public function getAreaConfig($area, $key)
    {
        if ($this->config === null) {
            $this->config = $this->configInterface->getContentBlock($this->getIdentifier());
        }

        // Validate we're accessing a valid area
        if ($area != self::AREA_ADMINHTML && $area != self::AREA_FRONTEND) {
            throw new \InvalidArgumentException('Invalid area specified for content block area config.');
        }

        if (isset($this->config[$area])) {
            $area = $this->config[$area];
            if ($key && isset($area[$key])) {
                return $area[$key];
            } elseif (!$key) {
                return $area;
            }
        }

        return null;
    }
}
