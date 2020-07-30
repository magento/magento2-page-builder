<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Ui\DataProvider\Product\Form\Modifier\Eav;

use Magento\Framework\App\ObjectManager;
use Magento\PageBuilder\Model\Config;

class WysiwygConfigDataProcessor implements
    \Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\Eav\WysiwygConfigDataProcessorInterface
{
    /**
     * @var Config
     */
    private $config;

    /**
     * @param Config|null $config
     */
    public function __construct(
        Config $config = null
    ) {
        $this->config = $config ?: ObjectManager::getInstance()->get(Config::class);
    }

    /**
     * @inheritdoc
     */
    public function process(\Magento\Catalog\Api\Data\ProductAttributeInterface $attribute)
    {
        $isContentPreviewEnabled = $this->config->isContentPreviewEnabled();
        $wysiwygConfigData = [];

        if ($attribute->getData('is_pagebuilder_enabled')) {
            $wysiwygConfigData['is_pagebuilder_enabled'] = true;
            $wysiwygConfigData['pagebuilder_content_snapshot'] = $isContentPreviewEnabled;
            $wysiwygConfigData['pagebuilder_button'] = true;
        } else {
            $wysiwygConfigData['is_pagebuilder_enabled'] = false;
        }

        return $wysiwygConfigData;
    }
}
