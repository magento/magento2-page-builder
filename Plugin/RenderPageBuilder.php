<?php
/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Plugin;

use Magento\Framework\App\Response\Http as ResponseHttp;

/**
 * Plugin for processing builtin cache
 */
class RenderPageBuilder
{
    /**
     * @var \Magento\Framework\App\Config\ScopeConfigInterface
     */
    protected $config;

    /**
     * @var \Magento\Framework\App\PageCache\Kernel
     */
    protected $kernel;

    /**
     * @var \Magento\Framework\App\State
     */
    protected $state;

    /**
     * @var \Magento\Framework\Registry
     */
    protected $registry;

    /**
     * RenderPageBuilder constructor.
     *
     * @param \Gene\BlueFoot\Model\Stage\Render $stageRender
     */
    public function __construct(
        \Gene\BlueFoot\Model\Stage\Render $stageRender
    ) {
        $this->stageRender = $stageRender;
    }

    /**
     * Intercept dispatch to render BlueFoot content
     *
     * @param \Magento\Framework\Controller\ResultInterface $subject
     * @param \Closure                                      $proceed
     * @param \Magento\Framework\App\Response\Http          $response
     *
     * @return mixed
     */
    public function aroundRenderResult(
        \Magento\Framework\Controller\ResultInterface $subject,
        \Closure $proceed,
        ResponseHttp $response
    ) {
        /* @var $result \Magento\Framework\View\Result\Page\Interceptor */
        $result = $proceed($response);

        // Retrieve the HTML
        $html = $response->getBody();
        if (!empty($html)) {
            // Do a very quick strpos to see if the html contains page builder mark up
            if (strpos($html, \Gene\BlueFoot\Model\Stage\Save::BLUEFOOT_STRING) !== false) {
                // Render the page
                $renderedPage = $this->stageRender->render($html);
                // Set the body
                if ($renderedPage) {
                    $response->setBody($renderedPage);
                }
            }
        }

        return $result;
    }
}
