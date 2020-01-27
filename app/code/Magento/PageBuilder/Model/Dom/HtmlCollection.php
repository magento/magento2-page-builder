<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom;

use Gt\Dom\HTMLCollection as GtDomHTMLCollection;
use Magento\Framework\ObjectManagerInterface;
use Magento\PageBuilder\Model\Dom\Adapter\ElementInterface;
use Magento\PageBuilder\Model\Dom\Adapter\HtmlCollectionInterface;

/**
 * PhpGt DOM HTMLCollection wrapper.
 */
class HtmlCollection implements HtmlCollectionInterface
{
    /**
     * @var ObjectManagerInterface
     */
    private $objectManager;

    /**
     * @var GtDomHTMLCollection
     */
    private $collection;

    /**
     * HtmlCollection constructor.
     * @param ObjectManagerInterface $objectManager
     * @param GtDomHTMLCollection $collection
     */
    public function __construct(
        ObjectManagerInterface $objectManager,
        GtDomHTMLCollection $collection
    ) {
        $this->objectManager = $objectManager;
        $this->collection = $collection;
    }

    /**
     * Wrapper function for HTMLCollection::namedItem
     * @param string $name
     * @return Element|null
     */
    public function namedItem(string $name): ?ElementInterface
    {
        return $this->objectManager->create(ElementInterface::class, [ $this->collection->namedItem($name) ]);
    }

    public function item(int $index): ?ElementInterface
    {
        return $this->objectManager->create(ElementInterface::class, [ $this->collection->item($index) ]);
    }

    public function rewind(): void
    {
        $this->collection->rewind();
    }

    public function key(): int
    {
        return $this->collection->key();
    }

    public function valid(): bool
    {
        return $this->collection->valid();
    }

    public function next(): void
    {
        $this->collection->next();
    }

    public function current(): ?ElementInterface
    {
        return $this->objectManager->create(ElementInterface::class, [ $this->collection->current() ]);
    }

    public function offsetExists($offset): bool
    {
        return $this->collection->offsetExists($offset);
    }

    public function offsetGet($offset): ?ElementInterface
    {
        return $this->objectManager->create(ElementInterface::class, [ $this->collection->offsetGet($offset) ]);
    }

    public function offsetSet($offset, $value): void
    {
        $this->collection->offsetSet($offset, $value);
    }

    public function offsetUnset($offset): void
    {
        $this->collection->offsetUnset($offset);
    }

    public function count(): int
    {
        return $this->collection->count();
    }
}
