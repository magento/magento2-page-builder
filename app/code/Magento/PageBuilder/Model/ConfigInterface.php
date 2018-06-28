<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
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
    public function getGroups();

    /**
     * @return array
     */
    public function getContentTypes();

    /**
     * @return bool
     */
    public function isEnabled();
}
