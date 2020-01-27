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
    public function __isset(string $name):bool;

    public function __unset(string $name):void;

    public function __get(string $name):?string;

    public function __set(string $name, string $value):void;

    /**
     * @link https://php.net/manual/en/arrayaccess.offsetexists.php
     */
    public function offsetExists($offset):bool;

    /**
     * @link https://php.net/manual/en/arrayaccess.offsetget.php
     */
    public function offsetGet($offset):?string;

    /**
     * @link https://php.net/manual/en/arrayaccess.offsetset.php
     */
    public function offsetSet($offset, $value):void;

    /**
     * @link https://php.net/manual/en/arrayaccess.offsetunset.php
     */
    public function offsetUnset($offset):void;
}
