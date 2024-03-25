<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom;

use ArrayAccess;
use Countable;
use Gt\Dom\NodeList as GtDomNodeList;
use Iterator;
use Magento\Framework\ObjectManagerInterface;
use Magento\PageBuilder\Model\Dom\Adapter\ElementInterface;
use Magento\PageBuilder\Model\Dom\Adapter\HtmlCollectionInterface;

/**
 * PhpGt DOM HTMLCollection wrapper.
 */
class HtmlCollection implements Iterator, ArrayAccess, Countable, HtmlCollectionInterface
{
    /**
     * @var ObjectManagerInterface
     */
    private $objectManager;

    /**
     * @var GtDomNodeList
     */
    private $collection;

    /**
     * HtmlCollection constructor.
     *
     * @param ObjectManagerInterface $objectManager
     * @param GtDomNodeList $collection
     */
    public function __construct(
        ObjectManagerInterface $objectManager,
        GtDomNodeList $collection
    ) {
        $this->objectManager = $objectManager;
        $this->collection = $collection;
    }

    /**
     * @inheritDoc
     */
    public function namedItem(string $name): ?ElementInterface
    {
        return $this->objectManager->create(
            ElementInterface::class,
            [ 'element' => $this->collection->namedItem($name) ]
        );
    }

    /**
     * @inheritDoc
     */
    public function item(int $index): ?ElementInterface
    {
        return $this->objectManager->create(
            ElementInterface::class,
            [ 'element' =>  $this->collection->item($index) ]
        );
    }

    /**
     * @inheritDoc
     */
    public function rewind(): void
    {
        $this->collection->rewind();
    }

    /**
     * @inheritDoc
     */
    public function key(): int
    {
        return $this->collection->key();
    }

    /**
     * @inheritDoc
     */
    public function valid(): bool
    {
        return $this->collection->valid();
    }

    /**
     * @inheritDoc
     */
    public function next(): void
    {
        $this->collection->next();
    }

    /**
     * @inheritDoc
     */
    public function current(): ?ElementInterface
    {
        return $this->objectManager->create(
            ElementInterface::class,
            [ 'element' =>  $this->collection->current() ]
        );
    }

    /**
     * @inheritDoc
     */
    public function offsetExists($offset): bool
    {
        return $this->collection->offsetExists($offset);
    }

    /**
     * @inheritDoc
     */
    public function offsetGet($offset): ?ElementInterface
    {
        return $this->objectManager->create(
            ElementInterface::class,
            [ 'element' =>  $this->collection->offsetGet($offset) ]
        );
    }

    /**
     * @inheritDoc
     */
    public function offsetSet($offset, $value): void
    {
        $this->collection->offsetSet($offset, $value);
    }

    /**
     * @inheritDoc
     */
    public function offsetUnset($offset): void
    {
        $this->collection->offsetUnset($offset);
    }

    /**
     * @inheritDoc
     */
    public function count(): int
    {
        return $this->collection->count();
    }
}
