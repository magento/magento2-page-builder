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
     * @param string $name
     *
     * @return array
     */
    public function getGroup($name);

    /**
     * @return array
     */
    public function getContentTypes();

    /**
     * @param string $name
     *
     * @return array
     */
    public function getContentType($name);
}
