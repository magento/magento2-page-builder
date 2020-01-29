<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom\Adapter;

/**
 * Interface for HtmlDocument wrappers
 */
interface HtmlDocumentInterface
{
    /**
     * Returns collection of elements matching the specified class names
     *
     * @param string $names
     * @return HtmlCollectionInterface
     */
    public function getElementsByClassName(string $names): HtmlCollectionInterface;

    /**
     * Returns the first element matching the specified selector.
     *
     * @param string $selector
     * @return HtmlCollectionInterface
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
     * Dumps the internal document into a string using HTML formatting
     *
     * @return string
     */
    public function saveHTML(): string;
}
