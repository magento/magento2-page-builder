<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Stage\Renderer;

use Magento\Store\Model\Store;
use Magento\PageBuilder\Model\Filter\Template;

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
     * @var Template
     */
    private $templateFilter;

    /**
     * @param \Magento\Store\Model\StoreManagerInterface $storeManager
     * @param \Magento\Widget\Model\Template\Filter $directiveFilter
     * @param Template $templateFilter
     */
    public function __construct(
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Widget\Model\Template\Filter $directiveFilter,
        Template $templateFilter = null
    ) {
        $this->storeManager = $storeManager;
        $this->directiveFilter = $directiveFilter;
        $this->templateFilter = $templateFilter ?? \Magento\Framework\App\ObjectManager::getInstance()
                ->get(\Magento\PageBuilder\Model\Filter\Template::class);
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
            $previousStrictMode = $this->directiveFilter->setStrictMode(true);
            $result['content'] = $this->directiveFilter
                ->setStoreId(Store::DEFAULT_STORE_ID)
                ->filter($this->templateFilter->filter($params['directive']));
            $this->directiveFilter->setStrictMode($previousStrictMode);
        } catch (\Exception $e) {
            $result['error'] = __($e->getMessage());
        }

        return $result;
    }
}
