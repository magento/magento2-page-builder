<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Model\Config;

class Reader extends \Magento\Framework\Config\Reader\Filesystem
{
    const TYPE_PATH = '/config/content_types/type';
    
    /**
     * List of id attributes for merge
     *
     * @var array
     */
    protected $_idAttributes = [
        '/config/groups/group' => 'name',
        self::TYPE_PATH => 'name',
        self::TYPE_PATH . '/allowed_parents/parent' => 'name',
        self::TYPE_PATH . '/appearances/appearance' => 'name',
        self::TYPE_PATH . '/appearances/appearance/data' => 'name',
        self::TYPE_PATH . '/appearances/appearance/data_mapping/elements/element' => 'name',
        self::TYPE_PATH . '/appearances/appearance/data_mapping/elements/element/style_properties/property'
            => 'var',
        self::TYPE_PATH . '/appearances/appearance/data_mapping/elements/element/style_properties/complex_property'
            => 'var',
        self::TYPE_PATH . '/appearances/appearance/data_mapping/elements/element/style_properties/static_property'
            => 'name',
        self::TYPE_PATH . '/appearances/appearance/data_mapping/elements/element/attributes/attribute' => 'var',
        self::TYPE_PATH . '/appearances/appearance/data_mapping/elements/element/attributes/complex_attribute'
            => 'var',
        self::TYPE_PATH . '/appearances/appearance/data_mapping/elements/element/attributes/static_attribute'
            => 'name',
        self::TYPE_PATH . '/appearances/appearance/data_mapping/elements/element/css/filter/class' => 'name',
        self::TYPE_PATH . '/appearances/appearance/data_mapping/converters/converter' => 'name',
        self::TYPE_PATH . '/appearances/appearance/data_mapping/converters/converter/config/item' => 'name',
        self::TYPE_PATH . '/appearances/appearance/readers/reader' => 'name'
    ];

    /**
     * Constructor
     *
     * @param \Magento\Framework\Config\FileResolverInterface $fileResolver
     * @param \Magento\PageBuilder\Model\Config\Converter $converter
     * @param \Magento\PageBuilder\Model\Config\SchemaLocator $schemaLocator
     * @param \Magento\Framework\Config\ValidationStateInterface $validationState
     * @param string $fileName
     * @param array $idAttributes
     * @param string $domDocumentClass
     * @param string $defaultScope
     */
    public function __construct(
        \Magento\Framework\Config\FileResolverInterface $fileResolver,
        \Magento\PageBuilder\Model\Config\Converter $converter,
        \Magento\PageBuilder\Model\Config\SchemaLocator $schemaLocator,
        \Magento\Framework\Config\ValidationStateInterface $validationState,
        $fileName = 'content_types.xml',
        $idAttributes = [],
        $domDocumentClass = \Magento\Framework\Config\Dom::class,
        $defaultScope = 'global'
    ) {
        parent::__construct(
            $fileResolver,
            $converter,
            $schemaLocator,
            $validationState,
            $fileName,
            $idAttributes,
            $domDocumentClass,
            $defaultScope
        );
    }
}
