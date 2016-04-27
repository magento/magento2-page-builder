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
    protected $_idAttributes = []; //['/config/option' => 'name', '/config/option/inputType' => 'name'];

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
            $defaultScope);
    }
}