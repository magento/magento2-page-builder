<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Plugin\Framework\App;

/**
 * Plugin for front controller interface.
 */
class FrontController
{
    /**
     * @var \Magento\Backend\Model\Auth
     */
    private $auth;

    /**
     * @param \Magento\Backend\Model\Auth $auth
     */
    public function __construct(
        \Magento\Backend\Model\Auth $auth
    ) {
        $this->auth = $auth;
    }

    /**
     * Check if user logged in
     *
     * @param \Magento\Framework\App\FrontControllerInterface $subject
     * @param \Magento\Framework\App\RequestInterface $request
     *
     * @return void
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function beforeDispatch(
        \Magento\Framework\App\FrontControllerInterface $subject,
        \Magento\Framework\App\RequestInterface $request
    ) {
        if (strpos($request->getPathInfo(), 'pagebuilder/contenttype/preview')) {
            if ($this->auth->getUser()) {
                $this->auth->getUser()->reload();

                $isLoggedIn = $this->auth->isLoggedIn();

                if (!$isLoggedIn) {
                    $this->forwardRequest($request);
                }
            } else {
                $this->forwardRequest($request);
            }
        }
    }

    /**
     * Forwards request to the 404 page.
     *
     * @param \Magento\Framework\App\RequestInterface $request
     *
     * @return void
     */
    private function forwardRequest(
        \Magento\Framework\App\RequestInterface $request
    ) {
        $request->initForward();
        $request->setActionName('noroute');
    }
}
