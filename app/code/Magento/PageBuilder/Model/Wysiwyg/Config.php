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
     * @var \Magento\Cms\Model\Wysiwyg\DefaultConfigProvider
     */
    private $defaultWysiwygConfig;

    /**
     * Config constructor.
     * @param \Magento\Cms\Model\Wysiwyg\DefaultConfigProvider $defaultConfigProvider
     */
    public function __construct(
        \Magento\Cms\Model\Wysiwyg\DefaultConfigProvider $defaultConfigProvider
    ) {
        $this->defaultWysiwygConfig = $defaultConfigProvider;
    }

    /**
     * {@inheritdoc}
     */
    public function getConfig($config)
    {
        $config = $this->defaultWysiwygConfig->getConfig($config);
        $config->addData(['adapterType' => \Magento\PageBuilder\Model\Wysiwyg\EditorNameProvider::PAGEBUILDER_EDITOR]);
        return $config;
    }
}
