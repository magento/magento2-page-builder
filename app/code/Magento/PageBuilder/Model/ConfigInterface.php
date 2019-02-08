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
     * @return array
     */
    public function getMenuSections() : array;

    /**
     * @return array
     */
    public function getContentTypes() : array;

    /**
     * @return bool
     */
    public function isEnabled() : bool;
}
