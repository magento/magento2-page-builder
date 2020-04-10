<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Plugin;

use Magento\Ui\Component\Form\Element\DataType\Media\Image;
use Magento\Framework\FlagManager;

/**
 * Plugin to set open media gallery dialog URL
 */
class SetOpenDialogUrl
{
    private const MEDIA_GALLERY_OPEN_URL = 'open_dialog_url';

    /**
     * @var FlagManager
     */
    private $config;

    /**
     * @param FlagManager $config
     */
    public function __construct(FlagManager $config)
    {
        $this->config = $config;
    }

    /**
     * Set open media gallery dialog URL for image-uploader component
     *
     * @param Image $component
     */
    public function afterPrepare(Image $component): void
    {
        $data = $component->getData();

        $this->config->saveFlag(self::MEDIA_GALLERY_OPEN_URL, $data['config']['mediaGallery']['openDialogUrl']);
    }
}
