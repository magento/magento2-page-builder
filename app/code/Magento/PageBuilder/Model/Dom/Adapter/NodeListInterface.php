<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom\Adapter;

use Magento\PageBuilder\Model\Dom\Node;

/**
 * Interface for NodeList wrappers
 */
interface NodeListInterface
{
    public function item($index):?ElementInterface;

    public function rewind():void;

    public function key():int;

    public function valid():bool;

    public function next():void;

    /**
     * @return Node|null
     */
    public function current();

    public function offsetExists($offset):bool;

    public function offsetGet($offset):?ElementInterface;

    public function offsetSet($offset, $value):void;

    public function offsetUnset($offset):void;

    // Countable -------------------------------------------------------------------
    public function count():int;
}
