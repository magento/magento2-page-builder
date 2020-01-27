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
class HtmlDocument implements HtmlDocumentInterface
{
    /**
     * @var ObjectManagerInterface
     */
    private $objectManager;

    /**
     * @var GtDomHTMLDocument
     */
    private $document;

    /**
     * HtmlDocument constructor.
     * @param ObjectManagerInterface $objectManager
     * @param GtDomHTMLDocument $document
     */
    public function __construct(
        ObjectManagerInterface $objectManager,
        GtDomHTMLDocument $document
    ) {
        $this->objectManager = $objectManager;
        $this->document = $document;
    }

    /**
     * @inheritDoc
     */
    public function getElementsByClassName(string $names): HtmlCollectionInterface
    {
        return $this->objectManager->create(HtmlCollectionInterface::class, [ $this->document->getElementsByClassName($names) ]);
    }
}
