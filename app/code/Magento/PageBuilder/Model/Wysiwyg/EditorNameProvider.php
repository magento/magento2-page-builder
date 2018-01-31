<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Model\Wysiwyg;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Api\StoreResolverInterface;
use Magento\Cms\Model\Wysiwyg\Config as WysiwygConfig;
use Magento\Store\Model\ScopeInterface;

class EditorNameProvider
{
    /**
     * Page builder status configuration path
     */
    const IS_PAGEBUILDER_ENABLED = 'cms/pagebuilder/enabled';

    const WYSIWYG_EDITOR = 'wysiwyg';

    const PAGEBUILDER_EDITOR = 'pagebuilder';


    /**
     * @var ScopeConfigInterface
     */
    private $scopeConfig;

    /**
     * @var StoreResolverInterface
     */
    private $storeResolver;

    /**
     * EditorNameProvider constructor.
     * @param ScopeConfigInterface $scopeConfig
     * @param StoreResolverInterface $storeResolver
     */
    public function __construct(ScopeConfigInterface $scopeConfig, StoreResolverInterface $storeResolver)
    {
        $this->scopeConfig = $scopeConfig;
        $this->storeResolver = $storeResolver;
    }

    /**
     * Returns editor name based on system configuration value
     *
     * @return string
     */
    public function getName()
    {
        $isWysiwygEnabled = $this->scopeConfig->getValue(
            WysiwygConfig::WYSIWYG_STATUS_CONFIG_PATH,
            ScopeInterface::SCOPE_STORE,
            $this->storeResolver->getCurrentStoreId()
        );

        $isBlueFootEnabled = (int)$this->scopeConfig->getValue(
           self::IS_PAGEBUILDER_ENABLED
        );

        if ($isWysiwygEnabled === WysiwygConfig::WYSIWYG_ENABLED && $isBlueFootEnabled == 0) {
            return self::WYSIWYG_EDITOR;
        } else {
            return self::PAGEBUILDER_EDITOR;
        }
    }
}
