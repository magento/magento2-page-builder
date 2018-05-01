<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config\ContentTypes\AdditionalData\Provider\Uploader;

use Magento\PageBuilder\Model\Config\ContentTypes\AdditionalData\ProviderInterface;
use Magento\Framework\File\Size;

/**
 * Provides maximum filesize allowed for upload based on php ini settings
 */
class MaxFileSize implements ProviderInterface
{
    /**
     * @var Size
     */
    private $fileSize;

    /**
     * @param Size $fileSize
     */
    public function __construct(Size $fileSize)
    {
        $this->fileSize = $fileSize;
    }

    /**
     * @inheritdoc
     */
    public function getData(string $itemName) : array
    {
        return [$itemName => $this->fileSize->getMaxFileSize()];
    }
}
