<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Block\Entity\PageBuilder;

/**
 * Interface BlockInterface
 */
interface BlockInterface
{
    /**
     * Retrieve the instance of the advanced CMS block
     *
     * @return \Gene\BlueFoot\Model\Stage\Save\Renderer\Block|null
     * @throws \Exception
     */
    public function getAdvancedCms();
}