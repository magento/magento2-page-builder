<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config\ContentType\AdditionalData\Provider\Uploader;

use Magento\PageBuilder\Model\Config\ContentType\AdditionalData\ProviderInterface;
use Magento\Backend\Model\Url;
use Magento\Ui\Component\Form\Element\DataType\Media\OpenDialogUrl as OpenDialogConfig;

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
     * @var OpenDialogConfig
     */
    private $openDialogConfig;

    /**
     * @param Url $urlBuilder
     * @param OpenDialogConfig $openDialogConfig
     */
    public function __construct(
        Url $urlBuilder,
        OpenDialogConfig $openDialogConfig // phpstan:ignore
    ) {
        $this->urlBuilder = $urlBuilder;
        $this->openDialogConfig = $openDialogConfig;
    }

    /**
     * @inheritdoc
     */
    public function getData(string $itemName) : array
    {
        return [
            $itemName => $this->urlBuilder->getUrl($this->openDialogConfig->get(), ['_secure' => true])
        ];
    }
}
