<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Controller\Adminhtml\Form\Element;

use Exception;
use Magento\Backend\App\Action\Context;
use Magento\CatalogWidget\Controller\Adminhtml\Product\Widget;
use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Framework\Controller\Result\JsonFactory;

/**
 * Returns the number of products that match the provided conditions
 */
class ProductTotals extends Widget implements HttpPostActionInterface
{

    /**
     * @var \Magento\PageBuilder\Model\Catalog\ProductTotals
     */
    private $productTotals;

    /**
     * @var JsonFactory
     */
    private $jsonFactory;

    /**
     * @param Context $context
     * @param \Magento\PageBuilder\Model\Catalog\ProductTotals $productTotals
     * @param JsonFactory $jsonFactory
     */
    public function __construct(
        Context $context,
        \Magento\PageBuilder\Model\Catalog\ProductTotals $productTotals,
        JsonFactory $jsonFactory
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
            $response = $this->productTotals->getProductTotals($conditions);
        } catch (Exception $e) {
            $response = [
                'total' => 0,
                'disabled' => 0,
                'notVisible' => 0,
            ];
        }

        return $this->jsonFactory->create()->setData($response);
    }
}
