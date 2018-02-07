<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Model\Wysiwyg;

/**
 * Page Builder Config for Editor HTML Element
 */
class Config  implements \Magento\Framework\Data\Wysiwyg\ConfigProviderInterface
{
    /**
     * Page builder status configuration path
     */
    const IS_PAGEBUILDER_ENABLED = 'cms/pagebuilder/enabled';

    const PAGEBUILDER_EDITOR = 'pagebuilder';

    /**
     * {@inheritdoc}
     */
    public function getConfig($config)
    {
        $config->addData(['adapterType' => self::PAGEBUILDER_EDITOR]);
        return $config;
    }
}
