<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom\Adapter;

/**
 * Interface for HtmlDocument wrappers
 *
 * @api
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
}
