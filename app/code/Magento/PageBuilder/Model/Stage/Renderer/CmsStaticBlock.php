<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Stage\Renderer;

/**
 * Renders a CMS Block for the stage
 *
 * @api
 */
class CmsStaticBlock implements \Magento\PageBuilder\Model\Stage\RendererInterface
{
    /**
     * @var \Magento\Cms\Model\ResourceModel\Block\CollectionFactory
     */
    private $blockCollectionFactory;

    /**
     * @var \Magento\Framework\Serialize\Serializer\Json
     */
    private $jsonSerializer;

    /**
     * @var WidgetDirective
     */
    private $widgetDirectiveRenderer;

    /**
     * Constructor
     *
     * @param WidgetDirective $widgetDirectiveRenderer
     * @param \Magento\Cms\Model\ResourceModel\Block\CollectionFactory $blockCollectionFactory
     * @param \Magento\Framework\Serialize\Serializer\Json $jsonSerializer
     */
    public function __construct(
        WidgetDirective $widgetDirectiveRenderer,
        \Magento\Cms\Model\ResourceModel\Block\CollectionFactory $blockCollectionFactory,
        \Magento\Framework\Serialize\Serializer\Json $jsonSerializer
    ) {

        $this->blockCollectionFactory = $blockCollectionFactory;
        $this->jsonSerializer = $jsonSerializer;
        $this->widgetDirectiveRenderer = $widgetDirectiveRenderer;
    }

    /**
     * Render HTML for the specified block
     *
     * @param array $params
     * @return string
     */
    public function render(array $params): string
    {
        // Short-circuit if needed fields aren't present
        if (empty($params['directive']) || empty($params['block_id'])) {
            return '';
        }

        $result = [
            'blockTitle' => null,
            'html' => null,
            'error_message' => null
        ];
        $collection = $this->blockCollectionFactory->create();
        $blocks = $collection
            ->addFieldToSelect(['title', 'is_active'])
            ->addFieldToFilter('block_id', ['eq' => $params['block_id']])
            ->load();

        if ($blocks->count() === 0) {
            $result['error_message'] = sprintf(__('Block with ID: %s doesn\'t exist'), $params['block_id']);

            return $this->jsonSerializer->serialize($result);
        }

        /**
         * @var \Magento\Cms\Model\Block $block
         */
        $block = $blocks->getFirstItem();
        $result['title'] = $block->getTitle();

        if ($block->isActive()) {
            $result['html'] = $this->widgetDirectiveRenderer->render($params);
        } else {
            $result['error_message'] = __('Block disabled');
        }

        return $this->jsonSerializer->serialize($result);
    }
}
