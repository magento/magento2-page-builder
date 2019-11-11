<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Controller\Adminhtml\Form\Element;

use Magento\Framework\App\Action\HttpPostActionInterface;

/**
 * Returns the number of products that match the provided conditions
 */
class ProductTotals extends \Magento\Backend\App\Action implements HttpPostActionInterface
{
    const ADMIN_RESOURCE = 'Magento_Catalog::products';

    /**
     * @var \Magento\PageBuilder\Model\Catalog\ProductTotals
     */
    private $productTotals;

    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory
     */
    private $jsonFactory;

    /**
     * @param \Magento\Backend\App\Action\Context $context
     * @param \Magento\PageBuilder\Model\Catalog\ProductTotals $productTotals
     * @param \Magento\Framework\Controller\Result\JsonFactory $jsonFactory
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\PageBuilder\Model\Catalog\ProductTotals $productTotals,
        \Magento\Framework\Controller\Result\JsonFactory $jsonFactory
    ) {
        $this->jsonFactory = $jsonFactory;
        $this->productTotals = $productTotals;
        parent::__construct($context);
    }

    /**
     * @inheritdoc
     */
    public function execute()
    {
        $conditions = $this->getRequest()->getParam('conditionValue');

        try {
            $totals = $this->productTotals->getProductTotals($conditions);
            $response = [
                'total' => $totals['total'],
                'disabled' => $totals['disabled'],
                'notVisible' => $totals['notVisible'],
                'outOfStock' => $totals['outOfStock'],
            ];
        } catch (\Exception $e) {
            $response = [
                'total' => 0,
                'disabled' => 0,
                'notVisible' => 0,
                'outOfStock' => 0,
            ];
        }

        return $this->jsonFactory->create()->setData($response);
    }
}
