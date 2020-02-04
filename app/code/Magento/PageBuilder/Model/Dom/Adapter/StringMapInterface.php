<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom\Adapter;

/**
 * Interface for StringMap wrappers
 */
interface StringMapInterface
{
    /**
     * Returns true if specified key is set, false otherwise
     *
     * @param string $name
     * @return bool
     */
    public function __isset(string $name): bool;

    /**
     * Unsets the value for the specified key
     *
     * @param string $name
     */
    public function __unset(string $name): void;

    /**
     * Gets the value of the specified key, or returns null if no value is set for that key
     *
     * @param string $name
     * @return string|null
     */
    public function __get(string $name): ?string;

    /**
     * Sets the specified value for the specified key in the map
     *
     * @param string $name
     * @param string $value
     */
    public function __set(string $name, string $value): void;

    /**
     * Returns whether or not an offset exists
     *
     * @link https://php.net/manual/en/arrayaccess.offsetexists.php
     * @param int $offset
     * @return bool
     */
    public function offsetExists($offset): bool;

    /**
     * Returns the value at the specified offset
     *
     * @link https://php.net/manual/en/arrayaccess.offsetget.php
     * @param int $offset
     * @return string|null
     */
    public function offsetGet($offset): ?string;

    /**
     * Attempts to set the value at the specified offset
     *
     * @link https://php.net/manual/en/arrayaccess.offsetset.php
     * @param int $offset
     * @param string $value
     */
    public function offsetSet($offset, $value): void;

    /**
     * Attempts to unset the value at the specified offset
     *
     * @link https://php.net/manual/en/arrayaccess.offsetunset.php
     * @param int $offset
     */
    public function offsetUnset($offset): void;
}
