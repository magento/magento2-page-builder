<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom;

use Gt\Dom\NodeList as GtDomNodeList;
use Magento\Framework\ObjectManagerInterface;
use Magento\PageBuilder\Model\Dom\Adapter\ElementInterface;
use Magento\PageBuilder\Model\Dom\Adapter\NodeInterface;
use Magento\PageBuilder\Model\Dom\Adapter\NodeListInterface;

/**
 * PhpGt DOM NodeList wrapper.
 */
class NodeList implements NodeListInterface
{
    /**
     * @var ObjectManagerInterface
     */
    private $objectManager;

    /**
     * @var GtDomNodeList
     */
    private $nodeList;

    /**
     * HtmlDocument constructor.
     * @param ObjectManagerInterface $objectManager
     * @param GtDomNodeList $nodeList
     */
    public function __construct(
        ObjectManagerInterface $objectManager,
        GtDomNodeList $nodeList
    ) {
        $this->objectManager = $objectManager;
        $this->nodeList = $nodeList;
    }

    /**
     * @inheritDoc
     */
    public function item(int $index): ?ElementInterface
    {
        return $this->objectManager->create(ElementInterface::class, [ 'element' => $this->nodeList->item($index) ]);
    }

    /**
     * @inheritDoc
     */
    public function rewind(): void
    {
        $this->nodeList->rewind();
    }

    /**
     * @inheritDoc
     */
    public function key(): int
    {
        return $this->nodeList->key();
    }

    /**
     * @inheritDoc
     */
    public function valid(): bool
    {
        return $this->nodeList->valid();
    }

    /**
     * @inheritDoc
     */
    public function next(): void
    {
        $this->nodeList->next();
    }

    /**
     * @inheritDoc
     */
    public function current(): NodeInterface
    {
        return $this->objectManager->create(
            NodeInterface::class,
            [ $this->nodeList->current() ]
        );
    }

    /**
     * @inheritDoc
     */
    public function offsetExists($offset): bool
    {
        return $this->nodeList->offsetExists($offset);
    }

    /**
     * @inheritDoc
     */
    public function offsetGet($offset): ?ElementInterface
    {
        return $this->objectManager->create(
            ElementInterface::class,
            [ 'element' => $this->nodeList->offsetGet($offset) ]
        );
    }

    /**
     * @inheritDoc
     */
    public function offsetSet($offset, $value): void
    {
        $this->nodeList->offsetSet($offset, $value);
    }

    /**
     * @inheritDoc
     */
    public function offsetUnset($offset): void
    {
        $this->nodeList->offsetUnset($offset);
    }

    /**
     * @inheritDoc
     */
    public function count(): int
    {
        return $this->nodeList->count();
    }
}
