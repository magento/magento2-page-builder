<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Block\Adminhtml\Stage;

use Magento\Framework\View\Element\Template;
use Magento\RequireJs\Model\FileManager;

/**
 * Class Render
 */
class Render extends Template
{
    private $fileManager;

    /**
     * @param Template\Context $context
     * @param FileManager $fileManager
     * @param array $data
     */
    public function __construct(
        Template\Context $context,
        FileManager $fileManager,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->fileManager = $fileManager;
    }


    /**
     * Generate the URL to RequireJS
     *
     * @return string
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function getRequireJsUrl() : string
    {
        $asset = $this->_assetRepo->createAsset('requirejs/require.js');
        return $asset->getUrl();
    }

    /**
     * Retrieve the URL to the RequireJS Config file
     *
     * @return string
     */
    public function getRequireJsConfigUrl() : string
    {
        $requireJsConfig = $this->fileManager->createRequireJsConfigAsset();
        return $requireJsConfig->getUrl();
    }
}
