<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model;

/**
 * Content Type ConfigInterface
 *
 * @api
 */
interface ConfigInterface
{
    /**
     * Gets all the menu sections
     *
     * @return array
     */
    public function getMenuSections() : array;

    /**
     * Gets all the content types
     *
     * @return array
     */
    public function getContentTypes() : array;

    /**
     * Get if PageBuilder is enabled
     *
     * @return bool
     */
    public function isEnabled() : bool;
}
