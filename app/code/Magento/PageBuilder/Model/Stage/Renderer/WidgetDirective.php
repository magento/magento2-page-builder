<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Stage\Renderer;

/**
 * Renders a widget directive for the stage
 *
 * @api
 */
class WidgetDirective implements \Magento\PageBuilder\Model\Stage\RendererInterface
{
    /**
     * @var \Magento\Store\Model\StoreManagerInterface
     */
    private $storeManager;

    /**
     * @var \Magento\Widget\Model\Template\Filter
     */
    private $directiveFilter;

    /**
     * Constructor
     *
     * @param \Magento\Store\Model\StoreManagerInterface $storeManager
     * @param \Magento\Widget\Model\Template\Filter $directiveFilter
     */
    public function __construct(
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Widget\Model\Template\Filter $directiveFilter
    ) {
        $this->storeManager = $storeManager;
        $this->directiveFilter = $directiveFilter;
    }

    /**
     * Render HTML for specified directive
     *
     * @param array $params
     * @return string
     */
    public function render(array $params): string
    {
        if (empty($params['directive'])) {
            return '';
        }

        try {
            $storeId = $this->storeManager->getStore()->getId();
            $content = $this->directiveFilter
                ->setStoreId($storeId)
                ->filter($params['directive']);
        } catch (\Exception $e) {
            $content = __($e->getMessage());
        }

        return $content;
    }
}
