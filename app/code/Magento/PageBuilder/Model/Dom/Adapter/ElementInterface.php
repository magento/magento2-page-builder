<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom\Adapter;

use Gt\Dom\Element;

/**
 * Interface for Element wrappers
 */
interface ElementInterface
{
    /**
     * returns true if the element would be selected by the specified selector
     * string; otherwise, returns false.
     * @param string $selectors The CSS selector(s) to check against
     * @return bool True if this element is selectable by provided selector
     */
    public function matches(string $selectors):bool;

    /**
     * Returns a live HTMLCollection containing all child elements which have all
     * of the given class names. When called on the document object, the complete
     * document is searched, including the root node.
     * @param string $names a string representing the list of class names to
     *  match; class names are separated by whitespace
     * @return HtmlCollectionInterface
     */
    public function getElementsByClassName(string $names):HtmlCollectionInterface;

    /**
     * Returns the closest ancestor of the current element (or itself)
     * which matches the selectors.
     * @param string $selectors CSS selector(s)
     * @return ElementInterface|null
     */
    public function closest(string $selectors): ?ElementInterface;

    /**
     * Returns the value of the specified attribute
     * @param $name
     * @return string|null
     */
    public function getAttribute($name):?string;
}
