<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config\ContentType;

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
        self::TYPE_PATH . '/parents/parent' => 'name',
        self::TYPE_PATH . '/children/child' => 'name',
        self::TYPE_PATH . '/appearances/appearance' => 'name',
        self::TYPE_PATH . '/appearances/appearance/data' => 'name',
        self::TYPE_PATH . '/appearances/appearance/data_mapping/elements/element' => 'name',
        self::TYPE_PATH . '/appearances/appearance/data_mapping/elements/element/style_properties/property'
            => 'name',
        self::TYPE_PATH . '/appearances/appearance/data_mapping/elements/element/style_properties/complex_property'
            => 'name',
        self::TYPE_PATH . '/appearances/appearance/data_mapping/elements/element/style_properties/static_property'
            => 'source',
        self::TYPE_PATH . '/additional_data/item' => 'name',
        self::TYPE_PATH . '/appearances/appearance/data_mapping/elements/element/attributes/attribute' => 'name',
        self::TYPE_PATH . '/appearances/appearance/data_mapping/elements/element/attributes/complex_attribute'
            => 'name',
        self::TYPE_PATH . '/appearances/appearance/data_mapping/elements/element/attributes/static_attribute'
            => 'source',
        self::TYPE_PATH . '/appearances/appearance/data_mapping/elements/element/css/filter/class' => 'source',
        self::TYPE_PATH . '/appearances/appearance/data_mapping/converters/converter' => 'name',
        self::TYPE_PATH . '/appearances/appearance/data_mapping/converters/converter/config/item' => 'name',
        self::TYPE_PATH . '/appearances/appearance/readers/reader' => 'name'
    ];

    /**
     * Constructor
     *
     * @param \Magento\PageBuilder\Model\Config\FileResolver $fileResolver
     * @param \Magento\PageBuilder\Model\Config\ContentType\Converter $converter
     * @param \Magento\PageBuilder\Model\Config\ContentType\SchemaLocator $schemaLocator
     * @param \Magento\Framework\Config\ValidationStateInterface $validationState
     * @param string $fileName
     * @param array $idAttributes
     * @param string $domDocumentClass
     * @param string $defaultScope
     */
    public function __construct(
        \Magento\PageBuilder\Model\Config\FileResolver $fileResolver,
        \Magento\PageBuilder\Model\Config\ContentType\Converter $converter,
        \Magento\PageBuilder\Model\Config\ContentType\SchemaLocator $schemaLocator,
        \Magento\Framework\Config\ValidationStateInterface $validationState,
        string $fileName = 'content_type/*.xml',
        array $idAttributes = [],
        string $domDocumentClass = \Magento\Framework\Config\Dom::class,
        string $defaultScope = 'global'
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
