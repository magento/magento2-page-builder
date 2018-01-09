<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Controller\Adminhtml\Stage\Render;

use Magento\Framework\View\Element\Template;
use Magento\Ui\Component\Control\ActionPool;
use Magento\Ui\Component\Wrapper\UiComponent;
use Magento\Ui\Controller\Adminhtml\AbstractAction;
use Magento\Backend\App\Action\Context;
use Magento\Framework\View\Element\UiComponentFactory;

/**
 * Class Edit
 */
class Edit extends AbstractAction
{
    const BLUEFOOT_CACHE_FORM_PREFIX = 'bluefoot_form_cache_';

    /**
     * Edit constructor.
     *
     * @param \Magento\Backend\App\Action\Context                $context
     * @param \Magento\Framework\View\Element\UiComponentFactory $factory
     * @param \Magento\Framework\App\CacheInterface              $cacheManager
     * @param \Magento\Framework\App\Cache\StateInterface        $cacheState
     * @param \Magento\Framework\Registry                        $registry
     */
    public function __construct(
        Context $context,
        UiComponentFactory $factory,
        \Magento\Framework\App\CacheInterface $cacheManager,
        \Magento\Framework\App\Cache\StateInterface $cacheState,
        \Magento\Framework\Registry $registry
    ) {
        parent::__construct($context, $factory);

        $this->cacheManager = $cacheManager;
        $this->cacheState = $cacheState;
        $this->registry = $registry;
    }

    /**
     * Render UI component by namespace in handle context
     *
     * @return void
     */
    public function execute()
    {
        // Retrieve the identifier from the request
        $identifier = $this->_request->getParam('identifier');
        $namespace = $this->_request->getParam('namespace');
        $buttons = $this->_request->getParam('buttons', false);
        $editFormPath = $this->_request->getParam(
            'edit_form_path',
            'bluefoot_edit.bluefoot_edit.bluefoot_edit_form'
        );

        $response = false;

        // Use the cache to load and save the data
        if ($this->cacheState->isEnabled(\Gene\BlueFoot\Model\Cache\Forms::TYPE_IDENTIFIER)) {
            $loadCache = $this->cacheManager->load(self::BLUEFOOT_CACHE_FORM_PREFIX . $identifier);
            if ($loadCache) {
                $response = $loadCache;
            }
        }

        // If the response is not available in the cache build it
        if ($response === false) {
            // Pass the identifier through the registry
            $this->registry->register('bluefoot_edit_identifier', $identifier);
            $this->_view->loadLayout(['default', 'bluefoot_entity_edit'], true, true, false);

            $uiComponent = $this->_view->getLayout()->getBlock('contentblock_entity_form');
            $response = $uiComponent instanceof UiComponent ? $uiComponent->toHtml() : '';

            if ($buttons) {
                $actionsToolbar = $this->_view->getLayout()->getBlock(ActionPool::ACTIONS_PAGE_TOOLBAR);
                $response .= $actionsToolbar instanceof Template ? $actionsToolbar->toHtml() : '';
            }

            if ($this->cacheState->isEnabled(\Gene\BlueFoot\Model\Cache\Forms::TYPE_IDENTIFIER)) {
                // Store the configuration in the cache for 7 days
                $this->cacheManager->save(
                    $response,
                    self::BLUEFOOT_CACHE_FORM_PREFIX . $identifier,
                    [\Gene\BlueFoot\Model\Cache\Forms::CACHE_TAG],
                    (60 * 60 * 24 * 7) // Store in cache for 7 days
                );
            }
        }

        // Replace the contentblock_entity_form tag with our custom namespace
        $response = str_replace(
            [
                'contentblock_entity_form',
                \Gene\BlueFoot\Block\Adminhtml\Entity\Edit\Button\Generic::BLUEFOOT_TARGET_NAME_PLACEHOLDER
            ],
            [
                $namespace . '_form',
                $editFormPath
            ],
            $response
        );

        $this->_response->appendBody($response);
    }
}
