<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom\Adapter;

/**
 * Interface for DocumentFragment wrappers
 */
interface DocumentFragmentInterface
{
    /**
     * Appends the specified content to the document fragment
     *
     * @param string $data
     * @return bool
     */
    public function appendHTML(string $data): bool;

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
     * Returns string content of fragment
     */
    public function propGetInnerText(): string;
}
