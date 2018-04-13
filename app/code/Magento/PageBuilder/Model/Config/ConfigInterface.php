<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Model\Config;

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
     * @return int
     */
    public function isEnabled();
}
