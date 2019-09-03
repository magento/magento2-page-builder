<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Stage;

/**
 * PreviewRegistry to determine if Page Builder is in preview mode
 */
class PreviewRegistry
{
    /**
     * @var bool
     */
    private $isPreview;

    /**
     * Retrieve the area in which the preview needs to be ran in
     *
     * @return string
     */
    public function getPreviewArea()
    {
        return \Magento\Framework\App\Area::AREA_FRONTEND;
    }

    /**
     * Set if the system is in Page Builder preview mode
     *
     * @param bool $isPreview
     */
    public function setIsPreview(bool $isPreview)
    {
        $this->isPreview = $isPreview;
    }

    /**
     * Determine if the system is in preview mode
     *
     * @return bool
     */
    public function getIsPreview()
    {
        return $this->isPreview;
    }
}
