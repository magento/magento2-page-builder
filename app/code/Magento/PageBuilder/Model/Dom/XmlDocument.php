<?php
/**
 * Copyright 2020 Adobe
 * All Rights Reserved.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom;

use Gt\Dom\XMLDocument as GtDomXMLDocument;
use Magento\Framework\ObjectManagerInterface;
use Magento\PageBuilder\Model\Dom\Adapter\XmlDocumentInterface;

/**
 * PhpGt DOM XmlDocument wrapper.
 */
class XmlDocument extends Document implements XmlDocumentInterface
{
    /**
     * XmlDocument constructor.
     *
     * @param ObjectManagerInterface $objectManager
     * @param string $document
     * @param string $characterSet
     * @param string $contentType
     */
    public function __construct(
        ObjectManagerInterface $objectManager,
        string $document = "",
        string $characterSet = "UTF-8",
        string $contentType = "text/html"
    ) {
        parent::__construct($objectManager, $characterSet, $contentType);
        $this->document = $this->objectManager->create(
            GtDomXmlDocument::class,
            [
                "document" => $document,
                "characterSet" => $characterSet
            ]
        );
    }
}
