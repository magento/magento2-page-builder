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
     * Returns the specific Node whose ID or, as a fallback,
     * name matches the string specified by $name. Matching by name is only done
     * as a last resort, and only if the referenced element supports the name
     * attribute.
     * @param string $name
     * @return ElementInterface
     */
    public function namedItem(string $name): ?ElementInterface;

    public function item(int $index): ?ElementInterface;

    public function rewind(): void;

    public function key(): int;

    public function valid(): bool;

    public function next(): void;

    public function current(): ?ElementInterface;

    public function offsetExists($offset): bool;

    public function offsetGet($offset): ?ElementInterface;

    public function offsetSet($offset, $value): void;

    public function offsetUnset($offset): void;

    public function count(): int;
}
