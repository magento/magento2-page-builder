<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom\Adapter;

/**
 * Interface for TokenList wrappers
 *
 * @api
 */
interface TokenListInterface
{
    /**
     * Returns an item in the list by its index (or null if the number is >= the length of the list).
     *
     * @param int $index
     * @return string|null
     */
    public function item(int $index): ?string;

    /**
     * Returns true if the underlying string contains $token, otherwise false.
     *
     * @param string $token
     * @return bool
     */
    public function contains(string $token): bool;

    /**
     * Adds $token to the underlying attribute value.
     *
     * @param string $token
     * @return void
     */
    public function add(string $token): void;

    /**
     * Removes $token from the underlying attribute value.
     *
     * @param string $token
     * @return void
     */
    public function remove(string $token): void;

    /**
     * Removes $token and returns false. If $token doesn't exist, it's added and the function returns true.
     *
     * @param string $token
     * @return bool true if token is added, false if token is removed.
     */
    public function toggle(string $token): bool;

    /**
     * Returns a string representation of the list
     *
     * @return string
     */
    public function __toString(): string;
}
