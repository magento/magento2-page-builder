<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom;

use DOMNode;
use Magento\PageBuilder\Model\Dom\DomDocument;
use Magento\Framework\ObjectManagerInterface;
use Magento\PageBuilder\Model\Dom\Adapter\DocumentFragmentInterface;
use Magento\PageBuilder\Model\Dom\Adapter\DocumentInterface;
use Magento\PageBuilder\Model\Dom\Adapter\ElementInterface;
use Magento\PageBuilder\Model\Dom\Adapter\HtmlCollectionInterface;

/**
 * PhpGt DOM Document wrapper.
 */
class Document implements DocumentInterface
{
    /**
     * @var ObjectManagerInterface
     */
    protected $objectManager;

    /**
     * @var DOMDocument
     */
    protected $document;

    /**
     * Document constructor.
     * @param ObjectManagerInterface $objectManager
     * @param string $characterSet
     * @param string $contentType
     */
    public function __construct(
        ObjectManagerInterface $objectManager,
        string $characterSet,
        string $contentType
    ) {
        $this->objectManager = $objectManager;
        $this->document = $this->objectManager->create(
            DomDocument::class,
            [
                'characterSet' => $characterSet,
                'contentType' => $contentType
            ]
        );
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
    public function createDocumentFragment(): DocumentFragmentInterface
    {
        return $this->objectManager->create(
            DocumentFragmentInterface::class,
            [ 'documentFragment' => $this->document->createDocumentFragment() ]
        );
    }

    /**
     * @inheritDoc
     */
    public function createElement(string $name, string $value = null): ElementInterface
    {
        return $this->objectManager->create(
            ElementInterface::class,
            [ 'element' => $this->document->createElement($name, $value) ]
        );
    }

    /**
     * @inheritDoc
     */
    public function querySelector(string $selector): ElementInterface
    {
        return $this->objectManager->create(
            ElementInterface::class,
            [ 'element' => $this->document->querySelector($selector) ]
        );
    }

    /**
     * @inheritDoc
     */
    public function querySelectorAll(string $selector): HtmlCollectionInterface
    {
        return $this->objectManager->create(
            HtmlCollectionInterface::class,
            [ 'collection' => $this->document->querySelectorAll($selector) ]
        );
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

    /**
     * @inheritDoc
     */
    public function stripHtmlWrapperTags(): string
    {
        preg_match('/<body>(.*)<\/body>/s', $this->saveHTML(), $matches);
        return preg_replace_callback(
            '/=\"(%7B%7B[^"]*%7D%7D)\"/m',
            function ($matches) {
                return urldecode($matches[0]);
            },
            $matches[1]
        );
    }
}
