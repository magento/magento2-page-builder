<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom;

use Gt\Dom\StringMap as GtDomStringMap;
use Magento\Framework\ObjectManagerInterface;
use Magento\PageBuilder\Model\Dom\Adapter\StringMapInterface;

/**
 * PhpGt DOM StringMap wrapper.
 */
class StringMap implements StringMapInterface
{
    /**
     * @var ObjectManagerInterface
     */
    private $objectManager;

    /**
     * @var GtDomStringMap
     */
    private $stringMap;

    /**
     * HtmlDocument constructor.
     * @param ObjectManagerInterface $objectManager
     * @param GtDomStringMap $stringMap
     */
    public function __construct(
        ObjectManagerInterface $objectManager,
        string $stringMap
    ) {
        $this->objectManager = $objectManager;
        $this->stringMap = $stringMap;
    }


    public function __isset(string $name): bool
    {
        return $this->stringMap->__isset($name);
    }

    public function __unset(string $name): void
    {
        $this->stringMap->__unset($name);
    }

    public function __get(string $name): ?string
    {
        return $this->stringMap->__get($name);
    }

    public function __set(string $name, string $value): void
    {
        $this->stringMap->__set($name, $value);
    }

    /**
     * @link https://php.net/manual/en/arrayaccess.offsetexists.php
     */
    public function offsetExists($offset): bool
    {
        return $this->stringMap->offsetExists($offset);
    }

    /**
     * @link https://php.net/manual/en/arrayaccess.offsetget.php
     */
    public function offsetGet($offset): ?string
    {
        return $this->stringMap->offsetGet($offset);
    }

    /**
     * @link https://php.net/manual/en/arrayaccess.offsetset.php
     */
    public function offsetSet($offset, $value): void
    {
        $this->stringMap->offsetSet($offset, $value);
    }

    /**
     * @link https://php.net/manual/en/arrayaccess.offsetunset.php
     */
    public function offsetUnset($offset): void
    {
        $this->stringMap->offsetUnset($offset);
    }
}
