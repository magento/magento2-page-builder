<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom\Adapter;

use Gt\Dom\Element as GtDomElement;

/**
 * Interface for Element wrappers
 */
interface ElementInterface
{
    /**
     * Return original element.
     *
     * @return GtDomElement
     */
    public function getOriginalElement(): GtDomElement;

    /**
     * Adds new child at the end of the children.
     *
     * @param ElementInterface $element
     * @return ElementInterface
     */
    public function appendChild(ElementInterface $element): ElementInterface;

    /**
     * Returns true if the element would be selected by the specified selector string; otherwise, returns false.
     *
     * @param string $selectors The CSS selector(s) to check against
     * @return bool True if this element is selectable by provided selector
     */
    public function matches(string $selectors): bool;

    /**
     * Returns a live HTMLCollection containing all child elements which have all of the given class names.
     *
     * @param string $names a string representing the list of class names to
     *  match; class names are separated by whitespace
     * @return HtmlCollectionInterface
     */
    public function getElementsByClassName(string $names): HtmlCollectionInterface;

    /**
     * Returns the closest ancestor of the current element (or itself) which matches the selectors.
     *
     * @param string $selectors CSS selector(s)
     * @return ElementInterface|null
     */
    public function closest(string $selectors): ?ElementInterface;

    /**
     * Returns the value of the specified attribute
     *
     * @param string $name
     * @return string|null
     */
    public function getAttribute($name): ?string;

    /**
     * Removes the Specified Attribute
     *
     * @param string $name
     * @return bool|null
     */
    public function removeAttribute($name): ?bool;

    /**
     * Sets the value of the specified attribute
     *
     * @param string $name
     * @param string $value
     * @return AttrInterface|null
     */
    public function setAttribute($name, $value): ?AttrInterface;

    /**
     * Returns the first element matching the specified selector.
     *
     * @param string $selector
     * @return ElementInterface
     */
    public function querySelector(string $selector): ElementInterface;

    /**
     * Returns all elements matching the specified selector.
     *
     * @param string $selector
     * @return HtmlCollectionInterface
     */
    public function querySelectorAll(string $selector): HtmlCollectionInterface;

    /**
     * Removes the specified style property from the style attribute.
     *
     * @param string $styleProperty
     */
    public function removeStyle(string $styleProperty): string;

    /**
     * Adds the specified property & value to the style attribute.
     *
     * @param string $styleProperty
     * @param string $value
     * @return string
     */
    public function addStyle(string $styleProperty, string $value): string;
}
