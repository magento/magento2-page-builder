<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Plugin;

use Magento\Catalog\Model\Product;
use Magento\Framework\Message\MessageInterface;

/**
 * Load necessary design files for GraphQL
 */
class DesignLoader
{
    /**
     * @var \Magento\Framework\View\DesignLoader
     */
    private $designLoader;

    /**
     * @var \Magento\Framework\Message\ManagerInterface
     */
    private $messageManager;

    /**
     * @var \Magento\Framework\App\State
     */
    private $appState;

    /**
     * @var \Magento\PageBuilder\Model\Stage\Preview
     */
    private $preview;

    /**
     * @param \Magento\Framework\View\DesignLoader $designLoader
     * @param \Magento\Framework\Message\ManagerInterface $messageManager
     * @param \Magento\Framework\App\State $appState
     * @param \Magento\PageBuilder\Model\Stage\Preview $preview
     */
    public function __construct(
        \Magento\Framework\View\DesignLoader $designLoader,
        \Magento\Framework\Message\ManagerInterface $messageManager,
        \Magento\Framework\App\State $appState,
        \Magento\PageBuilder\Model\Stage\Preview $preview
    ) {
        $this->designLoader = $designLoader;
        $this->messageManager = $messageManager;
        $this->appState = $appState;
        $this->preview = $preview;
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
            $this->designLoader->load();
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
