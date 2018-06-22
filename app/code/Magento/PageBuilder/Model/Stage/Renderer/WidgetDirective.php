<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Stage\Renderer;

use Magento\Framework\Controller\ResultFactory;

/**
 * Renders a widget directive for the stage
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
     * @var ResultFactory
     */
    private $resultFactory;

    /**
     * Constructor
     *
     * @param \Magento\Store\Model\StoreManagerInterface $storeManager
     * @param \Magento\Widget\Model\Template\Filter $directiveFilter
     * @param ResultFactory $resultFactory
     */
    public function __construct(
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Widget\Model\Template\Filter $directiveFilter,
        ResultFactory $resultFactory
    ) {
        $this->storeManager = $storeManager;
        $this->directiveFilter = $directiveFilter;
        $this->resultFactory = $resultFactory;
    }

    /**
     * Render HTML for specified directive
     *
     * @param array $params
     * @return string
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function render(array $params): string
    {
        if (empty($params['directive'])) {
            return '';
        }

        $pageResult = $this->resultFactory->create(ResultFactory::TYPE_PAGE);
        $pageResult->initLayout();
        $storeId = $this->storeManager->getStore()->getId();
        $content = $this->directiveFilter
            ->setStoreId($storeId)
            ->filter($params['directive']);

        return $content;
    }
}
