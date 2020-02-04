<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom;

use Gt\Dom\DocumentFragment as GtDomDocumentFragment;
use Magento\Framework\ObjectManagerInterface;
use Magento\PageBuilder\Model\Dom\Adapter\DocumentFragmentInterface;
use Magento\PageBuilder\Model\Dom\Adapter\ElementInterface;
use Magento\PageBuilder\Model\Dom\Adapter\HtmlCollectionInterface;

/**
 * PhpGt DOM DocumentFragment wrapper.
 */
class DocumentFragment implements DocumentFragmentInterface
{
    /**
     * @var ObjectManagerInterface
     */
    private $objectManager;

    /**
     * @var GtDomDocumentFragment
     */
    private $documentFragment;

    /**
     * DocumentFragment constructor.
     * @param ObjectManagerInterface $objectManager
     * @param GtDomDocumentFragment $documentFragment
     */
    public function __construct(
        ObjectManagerInterface $objectManager,
        GtDomDocumentFragment $documentFragment
    ) {
        $this->objectManager = $objectManager;
        $this->documentFragment = $documentFragment;
    }

    /**
     * @inheritDoc
     */
    public function appendHTML(string $data): bool
    {
        return $this->documentFragment->appendHTML($data);
    }

    /**
     * @inheritDoc
     */
    public function querySelector(string $selector): ElementInterface
    {
        return $this->objectManager->create(
            ElementInterface::class,
            [ 'element' => $this->documentFragment->querySelector($selector) ]
        );
    }

    /**
     * @inheritDoc
     */
    public function querySelectorAll(string $selector): HtmlCollectionInterface
    {
        return $this->objectManager->create(
            HtmlCollectionInterface::class,
            [ 'collection' => $this->documentFragment->querySelectorAll($selector) ]
        );
    }

    /**
     * @inheritDoc
     */
    public function propGetInnerText(): string
    {
        return $this->documentFragment->prop_get_innerText();
    }
}
