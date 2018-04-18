<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config\ContentTypes\Converter;

use Magento\Framework\View\Element\UiComponent\ContextInterface;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Framework\File\Size;

class UploaderConfig implements \Magento\Framework\Config\ConverterInterface
{
    /**
     * @var ContextInterface
     */
    private $context;

    /**
     * @var StoreManagerInterface
     */
    private $storeManager;

    /**
     * @var Size
     */
    private $fileSize;

    /**
     * @param StoreManagerInterface $storeManager
     * @param Size $fileSize
     */
    public function __construct(
        ContextInterface $context,
        StoreManagerInterface $storeManager,
        Size $fileSize
    ) {
        $this->context = $context;
        $this->storeManager = $storeManager;
        $this->fileSize = $fileSize;
    }

    /**
     * @inheritdoc
     */
    public function convert($source): array
    {
        // dynamically set max filesize to filesize set in php ini if it is lower than that defined in config
        $source['settings']['maxFileSize'] = min(array_filter([
            $source['settings']['maxFileSize'] ?? null,
            $this->fileSize->getMaxFileSize()
        ]));

        $source['settings']['mediaGallery'] = array_merge(
            [
                // dynamically add storeId to mediaGallery config if not defined in config
                'storeId' => $this->storeManager->getStore()->getId(),
            ],
            $source['settings']['mediaGallery']
        );

        // use context to provide absolute mediaGallery openDialogUrl
        $source['settings']['mediaGallery']['openDialogUrl'] = $this->context->getUrl(
            $source['settings']['mediaGallery']['openDialogUrl']
        );

        // use context to provide absolute uploaderConfig url
        $source['settings']['uploaderConfig']['url'] = $this->context->getUrl(
            $source['settings']['uploaderConfig']['url']
        );

        return $source;
    }
}
