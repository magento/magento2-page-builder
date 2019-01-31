<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config\ContentType\AdditionalData\Provider\Uploader;

use Magento\PageBuilder\Model\Config\ContentType\AdditionalData\ProviderInterface;
use Magento\Framework\File\Size;

/**
 * Provides maximum file size for uploader
 *
 * Will provide the lower of the following two values:
 * - upload_max_filesize from php.ini config
 * - staticFileSize argument passed to constructor
 */
class MaxFileSize implements ProviderInterface
{
    /**
     * @var Size
     */
    private $fileSize;

    /**
     * @var int
     */
    private $staticFileSize;

    /**
     * @param Size $fileSize
     * @param int $staticFileSize
     */
    public function __construct(
        Size $fileSize,
        $staticFileSize = null
    ) {
        $this->fileSize = $fileSize;
        $this->staticFileSize = $staticFileSize;
    }

    /**
     * @inheritdoc
     */
    public function getData(string $itemName) : array
    {
        // dynamically set max file size based on the lower of php ini config and static value (if present)
        $maxFileSize = min(array_filter([
            $this->staticFileSize ?? 0,
            $this->fileSize->getMaxFileSize()
        ]));

        return [
            $itemName => $maxFileSize
        ];
    }
}
