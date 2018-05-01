<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config\ContentTypes;

class Reader extends \Magento\Framework\Config\Reader\Filesystem
{
    const TYPE_PATH = '/config/content_types/type';
    
    /**
     * List of id attributes for merge
     *
     * @var array
     */
    protected $_idAttributes = [
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
        self::TYPE_PATH . '/additional_data/arguments' => 'name',
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
     * @param \Magento\PageBuilder\Model\Config\ContentTypes\FileResolver $fileResolver
     * @param \Magento\PageBuilder\Model\Config\ContentTypes\Converter $converter
     * @param \Magento\PageBuilder\Model\Config\ContentTypes\SchemaLocator $schemaLocator
     * @param \Magento\Framework\Config\ValidationStateInterface $validationState
     * @param string $fileName
     * @param array $idAttributes
     * @param string $domDocumentClass
     * @param string $defaultScope
     */
    public function __construct(
        \Magento\PageBuilder\Model\Config\ContentTypes\FileResolver $fileResolver,
        \Magento\PageBuilder\Model\Config\ContentTypes\Converter $converter,
        \Magento\PageBuilder\Model\Config\ContentTypes\SchemaLocator $schemaLocator,
        \Magento\Framework\Config\ValidationStateInterface $validationState,
        string $fileName = '*.xml',
        array $idAttributes = [],
        string $domDocumentClass = \Magento\Framework\Config\Dom::class,
        string $defaultScope = 'content_types'
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
