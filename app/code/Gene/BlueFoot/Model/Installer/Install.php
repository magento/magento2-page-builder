<?php

namespace Gene\BlueFoot\Model\Installer;

use Gene\BlueFoot\Setup\EntitySetupFactory;

/**
 * Class Install
 *
 * @package Gene\BlueFoot\Model\Installer
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Install extends \Magento\Framework\Model\AbstractModel
{
    /**
     * @var null|array
     */
    protected $installData = null;

    /**
     * @var \Gene\BlueFoot\Model\Installer\Install\Attribute
     */
    protected $attributeInstall;

    /**
     * @var \Gene\BlueFoot\Model\Installer\Install\ContentBlock
     */
    protected $contentBlockInstall;

    /**
     * @var \Gene\BlueFoot\Setup\EntitySetupFactory
     */
    protected $entitySetupFactory;

    /**
     * Install constructor.
     *
     * @param \Magento\Framework\Model\Context                             $context
     * @param \Magento\Framework\Registry                                  $registry
     * @param \Gene\BlueFoot\Model\Installer\Install\Attribute             $attribute
     * @param \Gene\BlueFoot\Model\Installer\Install\ContentBlock          $contentBlock
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null           $resourceCollection
     * @param array                                                        $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        Install\Attribute $attribute,
        Install\ContentBlock $contentBlock,
        EntitySetupFactory $entitySetupFactory,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        parent::__construct($context, $registry, $resource, $resourceCollection, $data);

        $this->attributeInstall = $attribute;
        $this->contentBlockInstall = $contentBlock;
        $this->entitySetupFactory = $entitySetupFactory;
    }

    /**
     * Install data from a data set
     *
     * @param $data array
     *
     * @return bool
     * @throws \Exception
     */
    public function install($data, $setup)
    {
        if (!is_array($data)) {
            throw new \Exception('Data must be a valid array');
        }

        $this->installData = $data;
        $eavSetup = $this->entitySetupFactory->create(['setup' => $setup]);

        // Install the attributes first
        if ($this->hasAttributes()) {
            $this->attributeInstall->createAttributes($this->getAttributes(), $data, $eavSetup);
        }

        // Then any content blocks
        if ($this->hasContentBlocks()) {
            $this->contentBlockInstall->createContentBlocks($this->getContentBlocks(), $data, $eavSetup);
        }

        // Resolve any unmapped additional data
        $this->attributeInstall->resolveAdditionalData($eavSetup);

        return true;
    }

    /**
     * Does the data contain attributes?
     *
     * @return bool
     */
    protected function hasAttributes()
    {
        return array_key_exists('attributes', $this->installData);
    }

    /**
     * Retrieve the attributes
     *
     * @return mixed
     */
    protected function getAttributes()
    {
        return $this->installData['attributes'];
    }

    /**
     * Does the data contain content blocks?
     *
     * @return bool
     */
    protected function hasContentBlocks()
    {
        return array_key_exists('content_blocks', $this->installData);
    }

    /**
     * Retrieve the content blocks
     *
     * @return mixed
     */
    protected function getContentBlocks()
    {
        return $this->installData['content_blocks'];
    }
}
