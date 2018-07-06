<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Plugin\Result;

use Magento\Framework\App\ResponseInterface;
use Magento\Framework\View\Result\Page as ResultPage;

class Page
{
    /**
     * @param ResultPage $subject
     * @param ResponseInterface $response
     * @return array
     */
    public function beforeRenderResult(
        ResultPage $subject,
        ResponseInterface $response
    ) : array {
        // Apply the updated layout handles classes to the body when using our full width variants
        if ($subject->getConfig()->getPageLayout() == 'product-full-width'
            || $subject->getConfig()->getPageLayout() == 'cms-full-width'
        ) {
            $subject->getConfig()->addBodyClass('page-layout-1column');
        }
        if ($subject->getConfig()->getPageLayout() == 'category-full-width') {
            $subject->getConfig()->addBodyClass('page-layout-2columns-left');
        }

        return [$response];
    }
}
