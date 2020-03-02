<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom\Adapter;

/**
 * Interface for Attr wrappers
 */
interface AttrInterface
{
    /**
     * Removes attribute
     *
     * @return $this
     */
    public function remove(): self;
}
