<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config\ContentType\AdditionalData\Provider\Uploader;

use Magento\PageBuilder\Model\Config\ContentType\AdditionalData\ProviderInterface;
use Magento\Framework\FlagManager;

/**
 * Provides open dialog URL for media gallery slideout
 */
class OpenDialogUrl implements ProviderInterface
{
    private const MEDIA_GALLERY_OPEN_URL = 'open_dialog_url';
    
    /**
     * @var FlagManager
     */
    private $scopeConfig;

    /**
     * @param Url $urlBuilder
     */
    public function __construct(
        FlagManager $scopeConfig
    ) {
        $this->scopeConfig = $scopeConfig;
    }

    /**
     * @inheritdoc
     */
    public function getData(string $itemName) : array
    {
        return [
            $itemName => $this->scopeConfig->getFlagData(self::MEDIA_GALLERY_OPEN_URL)
        ];
    }
}
