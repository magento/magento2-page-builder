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
 * Provides save URL for uploader
 */
class SaveUrl implements ProviderInterface
{
    /**
     * @var Url
     */
    private $urlBuilder;

    /**
     * @param Url $urlBuilder
     */
    public function __construct(Url $urlBuilder)
    {
        $this->urlBuilder = $urlBuilder;
    }

    /**
     * @inheritdoc
     */
    public function getData(string $itemName) : array
    {
        return [
            $itemName => $this->urlBuilder->getUrl(
                'pagebuilder/contenttype/image_upload',
                ['_secure' => true]
            )
        ];
    }
}
