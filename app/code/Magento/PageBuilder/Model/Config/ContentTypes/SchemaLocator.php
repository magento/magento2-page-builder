<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Model\Config\ContentTypes;

class SchemaLocator implements \Magento\Framework\Config\SchemaLocatorInterface
{
    /**
     * Path to corresponding XSD file with validation rules for merged config *
     *
     * @var string
     */
    private $schema = null;

    /**
     * Path to corresponding XSD file with validation rules for separate config * files
     *
     * @var string
     */
    private $perFileSchema = null;

    /**
     * @param \Magento\Framework\Module\Dir\Reader $moduleReader
     */
    public function __construct(
        \Magento\Framework\Module\Dir\Reader $moduleReader
    ) {
        $etcDir = $moduleReader->getModuleDir('etc', 'Magento_PageBuilder');
        $this->schema = $etcDir . DIRECTORY_SEPARATOR . 'content_types.xsd';
        $this->perFileSchema = $etcDir . DIRECTORY_SEPARATOR . 'content_types.xsd';
    }

    /**
     * Get path to merged config schema
     *
     * @return string|null
     */
    public function getSchema()
    {
        return $this->schema;
    }

    /**
     * Get path to pre file validation schema
     *
     * @return string|null
     */
    public function getPerFileSchema()
    {
        return $this->perFileSchema;
    }
}
