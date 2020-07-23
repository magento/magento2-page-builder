<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
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
     */
    public function __construct(
        ObjectManagerInterface $objectManager,
        string $document = ""
    ) {
        parent::__construct($objectManager, $document);
        $this->document = $this->objectManager->create(GtDomXmlDocument::class, [ 'document' => $document ]);
    }
}
