<?php
/**
 * Copyright 2020 Adobe
 * All Rights Reserved.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Dom\Adapter;

/**
 * Interface for Attr wrappers
 *
 * @api
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
