<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Stage\Renderer;

use Magento\Store\Model\Store;

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
     * @return array
     */
    public function render(array $params): array
    {
        $result = [
            'content' => null,
            'error' => null,
        ];

        if (empty($params['directive'])) {
            return $result;
        }

        try {
            $result['content'] = $this->directiveFilter
                ->setStoreId(Store::DEFAULT_STORE_ID)
                ->filter($params['directive']);
        } catch (\Exception $e) {
            $result['error'] = __($e->getMessage());
        }

        return $result;
    }
}
