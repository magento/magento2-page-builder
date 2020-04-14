<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config\ContentType\AdditionalData\Provider\Uploader;

use Magento\PageBuilder\Model\Config\ContentType\AdditionalData\ProviderInterface;
use Magento\Backend\Model\Url;

/**
 * Provides open dialog URL for media gallery slideout
 */
class OpenDialogUrl implements ProviderInterface
{
    /**
     * @var Url
     */
    private $urlBuilder;

    /**
     * @var string
     */
    private $openDialogPath;

    /**
     * @param Url $urlBuilder
     * @param array $openDialogPath
     */
    public function __construct(
        Url $urlBuilder,
        array $openDialogPath
    ) {
        $this->urlBuilder = $urlBuilder;
        $this->openDialogPath = array_shift($openDialogPath);
    }

    /**
     * @inheritdoc
     */
    public function getData(string $itemName) : array
    {
        return [
            $itemName => $this->urlBuilder->getUrl($this->openDialogPath, ['_secure' => true])
        ];
    }
}
