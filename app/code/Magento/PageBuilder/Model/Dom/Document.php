<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom;

use DOMNode;
use Gt\Dom\Document as GtDomDocument;
use Magento\Framework\ObjectManagerInterface;
use Magento\PageBuilder\Model\Dom\Adapter\DocumentInterface;
use RuntimeException;

/**
 * PhpGt DOM Document wrapper.
 */
class Document implements DocumentInterface
{
    /**
     * @var ObjectManagerInterface
     */
    private $objectManager;

    /**
     * @var GtDomDocument
     */
    private $document;

    /**
     * HtmlDocument constructor.
     * @param ObjectManagerInterface $objectManager
     * @param string $document
     */
    public function __construct(
        ObjectManagerInterface $objectManager,
        string $document = ""
    ) {
        $this->objectManager = $objectManager;
        $this->document = $this->objectManager->create(GtDomDocument::class, [ $document ]);
    }

    /**
     * @inheritDoc
     */
    public function __toString(): string
    {
        return $this->document->__toString();
    }

    /**
     * @inheritDoc
     */
    public function saveHTML(DOMNode $node = null): string
    {
        return $this->document->saveHTML($node);
    }

    /**
     * @inheritDoc
     */
    public function close(): void
    {
        $this->document->close();
    }

    /**
     * @inheritDoc
     */
    public function detach()
    {
        return $this->document->detach();
    }

    /**
     * @inheritDoc
     */
    public function getSize(): ?int
    {
        return $this->document->getSize();
    }

    /**
     * @inheritDoc
     */
    public function tell(): int
    {
        return $this->document->tell();
    }

    /**
     * @inheritDoc
     */
    public function eof(): bool
    {
        return $this->document->eof();
    }

    /**
     * @inheritDoc
     */
    public function isSeekable(): bool
    {
        return $this->document->isSeekable();
    }

    /**
     * @inheritDoc
     */
    public function seek($offset, $whence = SEEK_SET): void
    {
        $this->document->see($offset, $whence);
    }

    /**
     * @inheritDoc
     */
    public function rewind(): void
    {
        $this->document->rewind();
    }

    /**
     * @inheritDoc
     */
    public function isWritable(): bool
    {
        return $this->document->isWritable();
    }

    /**
     * @inheritDoc
     */
    public function write($string): int
    {
        return $this->document->write($string);
    }

    /**
     * @inheritDoc
     */
    public function isReadable(): bool
    {
        return $this->document->isReadable();
    }

    /**
     * @inheritDoc
     */
    public function read($length): string
    {
        return $this->document->read($length);
    }

    /**
     * @inheritDoc
     */
    public function getContents(): string
    {
        return $this->document->getContents();
    }

    /**
     * @inheritDoc
     */
    public function getMetadata($key = null)
    {
        return $this->document->getMetadata($key);
    }
}
