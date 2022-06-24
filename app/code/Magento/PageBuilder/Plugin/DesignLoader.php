<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Plugin;

use Magento\Catalog\Model\Product;
use Magento\Framework\App\AreaList;
use Magento\Framework\App\State;
use Magento\Framework\Message\ManagerInterface;
use Magento\Framework\Message\MessageInterface;

/**
 * Load necessary design files for GraphQL
 */
class DesignLoader
{
    /**
     * @var ManagerInterface
     */
    private $messageManager;

    /**
     * Application arealist
     *
     * @var AreaList
     */
    private $areaList;

    /**
     * Application State
     *
     * @var State
     */
    private $appState;

    /**
     * @var \Magento\PageBuilder\Model\Stage\Preview
     */
    private $preview;

    /**
     * @param \Magento\Framework\Message\ManagerInterface $messageManager
     * @param \Magento\Framework\App\State $appState
     * @param \Magento\PageBuilder\Model\Stage\Preview $preview
     * @param AreaList $areaList
     */
    public function __construct(
        \Magento\Framework\Message\ManagerInterface $messageManager,
        \Magento\Framework\App\State $appState,
        \Magento\PageBuilder\Model\Stage\Preview $preview,
        AreaList $areaList
    ) {
        $this->messageManager = $messageManager;
        $this->appState = $appState;
        $this->preview = $preview;
        $this->areaList = $areaList;
    }

    /**
     * Before create load the design files
     *
     * @param \Magento\Catalog\Block\Product\ImageFactory $subject
     * @param Product $product
     * @param string $imageId
     * @param array|null $attributes
     * @throws \Exception
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function beforeCreate(
        \Magento\Catalog\Block\Product\ImageFactory $subject,
        Product $product,
        string $imageId,
        array $attributes = null
    ) {
        if ($this->preview->isPreviewMode()) {
            $this->appState->emulateAreaCode(
                $this->preview->getPreviewArea(),
                [$this, 'loadDesignConfig']
            );
        }
    }

    /**
     * Load the design config
     */
    public function loadDesignConfig()
    {
        try {
            $area = $this->areaList->getArea($this->appState->getAreaCode());
            $area->load(\Magento\Framework\App\Area::PART_DESIGN);
        } catch (\Magento\Framework\Exception\LocalizedException $e) {
            if ($e->getPrevious() instanceof \Magento\Framework\Config\Dom\ValidationException) {
                /** @var MessageInterface $message */
                $message = $this->messageManager
                    ->createMessage(MessageInterface::TYPE_ERROR)
                    ->setText($e->getMessage());
                $this->messageManager->addUniqueMessages([$message]);
            }
        }
    }
}
