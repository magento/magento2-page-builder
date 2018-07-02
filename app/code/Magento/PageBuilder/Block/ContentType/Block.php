<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Block\ContentType;

/**
 * @api
 */
class Block extends \Magento\Cms\Block\Block
{
    /**
     * @var \Magento\Cms\Model\ResourceModel\Block
     */
    private $blockResource;

    /**
     * Construct
     *
     * @param \Magento\Framework\View\Element\Context $context
     * @param \Magento\Cms\Model\Template\FilterProvider $filterProvider
     * @param \Magento\Store\Model\StoreManagerInterface $storeManager
     * @param \Magento\Cms\Model\BlockFactory $blockFactory
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Context $context,
        \Magento\Cms\Model\Template\FilterProvider $filterProvider,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Cms\Model\BlockFactory $blockFactory,
        \Magento\Cms\Model\ResourceModel\Block $blockResource,
        array $data = []
    ) {
        parent::__construct($context, $filterProvider, $storeManager, $blockFactory, $data);
        $this->blockResource = $blockResource;
    }

    /**
     * {@inheritdoc}
     */
    protected function _toHtml()
    {
        $identifier = $this->getIdentifier();
        $html = '';
        if ($identifier) {
            $storeId = $this->_storeManager->getStore()->getId();
            /** @var \Magento\Cms\Model\Block $block */
            $block = $this->_blockFactory->create();
            $block->setStoreId($storeId);
            $this->blockResource->load($block, $identifier, 'identifier');
            if ($block->isActive()) {
                $html = $this->_filterProvider->getBlockFilter()->setStoreId($storeId)->filter($block->getContent());
            }
        }
        return '<div class="'
            . $this->escapeHtmlAttr($this->getClass())
            . '" style="'
            . $this->escapeHtmlAttr($this->getStyle())
            . '">'
            . $html
            . '</div>';
    }
}
