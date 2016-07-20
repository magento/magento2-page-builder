<?php

namespace Gene\BlueFoot\Model\Config;

/**
 * Class SchemaLocator
 *
 * @package Gene\BlueFoot\Model\Config
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class SchemaLocator implements \Magento\Framework\Config\SchemaLocatorInterface
{
    /**
     * Path to corresponding XSD file with validation rules for merged config *
     *
     * @var string
     */
    protected $_schema = null;

    /**
     * Path to corresponding XSD file with validation rules for separate config * files
     *
     * @var string
     */
    protected $_perFileSchema = null;

    /**
     * @param \Magento\Framework\Module\Dir\Reader $moduleReader
     */
    public function __construct(\Magento\Framework\Module\Dir\Reader $moduleReader)
    {
        $etcDir = $moduleReader->getModuleDir('etc', 'Gene_BlueFoot');
        $this->_schema = $etcDir . '/bluefoot/pagebuilder.xsd';
        $this->_perFileSchema = $etcDir . '/bluefoot/pagebuilder.xsd';
    }

    /**
     * Get path to merged config schema
     *
     * @return string|null
     */
    public function getSchema()
    {
        return $this->_schema;
    }

    /**
     * Get path to pre file validation schema
     *
     * @return string|null
     */
    public function getPerFileSchema()
    {
        return $this->_perFileSchema;
    }
}