<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Block\Adminhtml\Stage;

use Magento\Framework\App\ObjectManager;
use Magento\Framework\View\Asset\Minification;
use Magento\Framework\View\Element\Template;
use Magento\RequireJs\Model\FileManager;
use Magento\PageBuilder\Model\Stage\Config;
use Magento\Framework\Serialize\Serializer\Json;

/**
 * Class Render
 *
 * @api
 */
class Render extends Template
{
    /**
     * @var FileManager
     */
    private $fileManager;

    /**
     * @var Config
     */
    private $pageBuilderConfig;

    /**
     * @var Json
     */
    private $json;

    /**
     * @var Minification
     */
    private $minification;

    /**
     * @param Template\Context $context
     * @param FileManager $fileManager
     * @param Config $config
     * @param Json $json
     * @param array $data
     * @param Minification $minification
     */
    public function __construct(
        Template\Context $context,
        FileManager $fileManager,
        Config $config,
        Json $json,
        array $data = [],
        Minification $minification = null
    ) {
        parent::__construct($context, $data);
        $this->fileManager = $fileManager;
        $this->pageBuilderConfig = $config;
        $this->json = $json;
        $this->minification = $minification ?: ObjectManager::getInstance()->get(Minification::class);
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
     * Generate the URL to the RequireJS min resolver, if minification enabled.
     *
     * @return string|null
     */
    public function getRequireJsMinUrl() : ?string
    {
        if ($this->minification->isEnabled('js')) {
            $minResolverAsset = $this->fileManager->createMinResolverAsset();
            return $minResolverAsset->getUrl();
        }
        return null;
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

    /**
     * Retrieve the Page Builder's config
     *
     * @return array
     */
    public function getPageBuilderConfig() : string
    {
        return $this->json->serialize($this->pageBuilderConfig->getConfig());
    }
}
