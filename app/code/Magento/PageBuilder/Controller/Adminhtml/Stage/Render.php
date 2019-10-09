<?php
/**
 *
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Controller\Adminhtml\Stage;

use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\RequireJs\Block\Html\Head\Config;

/**
 * Class Render
 *
 * Iframe to render Page Builder stage in isolation
 */
class Render extends \Magento\Backend\App\Action implements HttpGetActionInterface
{
    const ADMIN_RESOURCE = 'Magento_Backend::content';

    /**
     * Render the RequireJS and Page Builder render blocks without any additional layout
     *
     * @return void
     */
    public function execute()
    {
        $layout = $this->_view->getLayout();
        $requireJs = $layout->createBlock(
            \Magento\Backend\Block\Page\RequireJs::class,
            'require.js'
        );
        $requireJs->setTemplate('Magento_Backend::page/js/require_js.phtml');
        /* @var \Magento\PageBuilder\Block\Adminhtml\Stage\Render $renderBlock */
        $renderBlock = $layout->createBlock(
            \Magento\PageBuilder\Block\Adminhtml\Stage\Render::class,
            'stage_render'
        );
        $renderBlock->setTemplate('Magento_PageBuilder::stage/render.phtml');
        $babelPolyfill = $layout->createBlock(
            \Magento\PageBuilder\Block\Adminhtml\Html\Head\BabelPolyfill::class,
            'pagebuilder.babel.polyfill'
        );
        $babelPolyfill->setTemplate('Magento_PageBuilder::html/head/babel_polyfill.phtml');
        $this->getResponse()->setBody($requireJs->toHtml() . $babelPolyfill->toHtml() . $renderBlock->toHtml());
        $this->getResponse()->sendResponse();
    }
}
