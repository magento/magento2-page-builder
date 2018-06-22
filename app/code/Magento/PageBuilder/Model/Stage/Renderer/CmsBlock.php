<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Stage\Renderer;

/**
 * Renders a CMS Block for the stage
 */
class CmsBlock extends WidgetDirective
{
    /**
     * @var \Magento\Cms\Model\ResourceModel\Block\CollectionFactory
     */
    private $blockCollectionFactory;

    /**
     * @var \Magento\Framework\Serialize\Serializer\Json
     */
    private $json;

    /**
     * Constructor
     *
     * @param \Magento\Store\Model\StoreManagerInterface $storeManager
     * @param \Magento\Widget\Model\Template\Filter $directiveFilter
     * @param \Magento\Framework\Controller\ResultFactory $resultFactory
     * @param \Magento\Cms\Model\ResourceModel\Block\CollectionFactory $blockCollectionFactory
     * @param \Magento\Framework\Serialize\Serializer\Json $json
     */
    public function __construct(
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Widget\Model\Template\Filter $directiveFilter,
        \Magento\Framework\Controller\ResultFactory $resultFactory,
        \Magento\Cms\Model\ResourceModel\Block\CollectionFactory $blockCollectionFactory,
        \Magento\Framework\Serialize\Serializer\Json $json
    ) {
        parent::__construct($storeManager, $directiveFilter, $resultFactory);

        $this->blockCollectionFactory = $blockCollectionFactory;
        $this->json = $json;
    }

    /**
     * Render HTML for the specified block
     *
     * @param array $params
     * @return string
     */
    public function render(array $params): string
    {
        if (empty($params['directive']) || empty($params['block_id'])) {
            return '';
        }

        $result = [];
        $collection = $this->blockCollectionFactory->create();
        $blocks = $collection
            ->addFieldToSelect(['title', 'is_active'])
            ->addFieldToFilter('block_id', ['eq' => $params['block_id']])
            ->load();

        if ($blocks->count() === 0) {
            $result['message'] = sprintf(__('Block with ID: %s doesn\'t exist'), $params['block_id']);

            return $this->json->serialize($result);
        }

        $block = $blocks->getFirstItem();
        $result['name'] = $block->getTitle();

        if ($block->isActive()) {
            $result['html'] = parent::render($params);
        } else {
            $result['message'] = __('Block disabled');
        }

        return $this->json->serialize($result);
    }
}
