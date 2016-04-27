<?php

namespace Gene\BlueFoot\Model\Installer;

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
    protected $_installData = null;

    /**
     * @var \Gene\BlueFoot\Model\Installer\Install\Attribute
     */
    protected $_attributeInstall;

    /**
     * @var \Gene\BlueFoot\Model\Installer\Install\ContentBlock
     */
    protected $_contentBlockInstall;

    /**
     * @param \Magento\Framework\Model\Context $context
     * @param \Magento\Framework\Registry $registry
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb $resourceCollection
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        Install\Attribute $attribute,
        Install\ContentBlock $contentBlock,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        parent::__construct($context, $registry, $resource, $resourceCollection, $data);

        $this->_attributeInstall = $attribute;
        $this->_contentBlockInstall = $contentBlock;
    }

    /**
     * Install data from a data set
     *
     * @param $data array
     *
     * @return bool
     * @throws \Exception
     */
    public function install($data)
    {
        if (!is_array($data)) {
            throw new \Exception('Data must be a valid array');
        }

        $this->_installData = $data;

        // Install the attributes first
        if ($this->_hasAttributes()) {
            $this->_attributeInstall->createAttributes($this->_getAttributes(), $data);
        }

        // Then any content blocks
        if ($this->_hasContentBlocks()) {
            $this->_contentBlockInstall->createContentBlocks($this->_getContentBlocks(), $data);
        }

        // Resolve any unmapped additional data
        $this->_attributeInstall->resolveAdditionalData();

        return true;
    }

    /**
     * Does the data contain attributes?
     *
     * @return bool
     */
    protected function _hasAttributes()
    {
        return array_key_exists('attributes', $this->_installData);
    }

    /**
     * Retrieve the attributes
     *
     * @return mixed
     */
    protected function _getAttributes()
    {
        return $this->_installData['attributes'];
    }

    /**
     * Does the data contain content blocks?
     *
     * @return bool
     */
    protected function _hasContentBlocks()
    {
        return array_key_exists('content_blocks', $this->_installData);
    }

    /**
     * Retrieve the content blocks
     *
     * @return mixed
     */
    protected function _getContentBlocks()
    {
        return $this->_installData['content_blocks'];
    }

}