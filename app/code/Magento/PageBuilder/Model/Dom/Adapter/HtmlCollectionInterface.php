<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom\Adapter;

/**
 * Interface for HtmlCollection wrappers
 */
interface HtmlCollectionInterface
{
    /**
     * Returns the specific Node whose ID or, as a fallback, name matches the string specified by $name.
     *
     * @param string $name
     * @return ElementInterface
     */
    public function namedItem(string $name): ?ElementInterface;

    /**
     * Gets the nth Element object in the internal DOMNodeList.
     *
     * @param int $index
     * @return ElementInterface|null
     */
    public function item(int $index): ?ElementInterface;

    /**
     * Resets the internal pointer to the beginning of the collection
     *
     * @return void
     */
    public function rewind(): void;

    /**
     * Returns the current index key value
     *
     * @return int
     */
    public function key(): int;

    /**
     * Returns true if the current index key is valid
     *
     * @return bool
     */
    public function valid(): bool;

    /**
     * Advances the iterator one position forward
     *
     * @return void
     */
    public function next(): void;

    /**
     * Returns the element currently being pointed to by the iterator
     *
     * @return ElementInterface|null
     */
    public function current(): ?ElementInterface;

    /**
     * Returns true if the specified offset points to a value in the collection, false otherwise.
     *
     * @param int $offset
     * @return bool
     */
    public function offsetExists($offset): bool;

    /**
     * Returns the item in the $offset position in the collection
     *
     * @param int $offset
     * @return ElementInterface|null
     */
    public function offsetGet($offset): ?ElementInterface;

    /**
     * Attempts to set the specified value in the $offset position of the collection
     *
     * @param int $offset
     * @param string $value
     * @return void
     */
    public function offsetSet($offset, $value): void;

    /**
     * Attempts to unset the item in the specified offset of the collection
     *
     * @param int $offset
     */
    public function offsetUnset($offset): void;

    /**
     * Returns the number of items in the collection
     *
     * @return int
     */
    public function count(): int;
}
