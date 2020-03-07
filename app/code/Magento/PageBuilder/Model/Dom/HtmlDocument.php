<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom;

use Gt\Dom\HTMLDocument as GtDomHTMLDocument;
use Magento\Framework\ObjectManagerInterface;
use Magento\PageBuilder\Model\Dom\Adapter\HtmlCollectionInterface;
use Magento\PageBuilder\Model\Dom\Adapter\HtmlDocumentInterface;

/**
 * PhpGt DOM HTMLDocument wrapper.
 */
class HtmlDocument extends Document implements HtmlDocumentInterface
{
    /**
     * HtmlDocument constructor.
     * @param ObjectManagerInterface $objectManager
     * @param string $document
     */
    public function __construct(
        ObjectManagerInterface $objectManager,
        string $document = ""
    ) {
        parent::__construct($objectManager, $document);
        $this->document = $this->objectManager->create(GtDomHTMLDocument::class, [ 'document' => $document ]);
    }

    /**
     * @inheritDoc
     */
    public function getElementsByClassName(string $names): HtmlCollectionInterface
    {
        return $this->objectManager->create(
            HtmlCollectionInterface::class,
            [ 'collection' => $this->document->getElementsByClassName($names) ]
        );
    }
}
