<?php

namespace Gene\BlueFoot\Model\Config;

/**
 * Class Reader
 *
 * @package Gene\BlueFoot\Model\Config
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Reader extends \Magento\Framework\Config\Reader\Filesystem
{
    /**
     * List of id attributes for merge
     *
     * @var array
     */
    protected $_idAttributes = [
        '/config/plugins/js/plugin' => 'name',
        '/config/plugins/jquery/plugin' => 'name',
        '/config/plugins/async/plugin' => 'name',
        '/config/widgets/widget' => 'name',
        '/config/content_blocks/templates/template' => 'name',
        '/config/content_blocks/renderers/renderer' => 'name',
        '/config/structurals/structural' => 'code',
        '/config/structurals/structural/fields/field' => 'code',
        '/config/on_build/widgets/widget' => 'name',
        '/config/global_fields/field' => 'code'
    ];

    /**
     * Reader constructor.
     *
     * @param \Magento\Framework\Config\FileResolverInterface    $fileResolver
     * @param \Gene\BlueFoot\Model\Config\Converter              $converter
     * @param \Gene\BlueFoot\Model\Config\SchemaLocator          $schemaLocator
     * @param \Magento\Framework\Config\ValidationStateInterface $validationState
     * @param string                                             $fileName
     * @param array                                              $idAttributes
     * @param string                                             $domDocumentClass
     * @param string                                             $defaultScope
     */
    public function __construct(
        \Magento\Framework\Config\FileResolverInterface $fileResolver,
        \Gene\BlueFoot\Model\Config\Converter $converter,
        \Gene\BlueFoot\Model\Config\SchemaLocator $schemaLocator,
        \Magento\Framework\Config\ValidationStateInterface $validationState,
        $fileName = 'bluefoot/pagebuilder.xml',
        $idAttributes = [],
        $domDocumentClass = 'Magento\Framework\Config\Dom',
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
