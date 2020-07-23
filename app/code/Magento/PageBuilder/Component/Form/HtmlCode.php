<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Component\Form;

use Magento\Backend\Model\UrlInterface as BackendUrlInterface;
use Magento\Cms\Helper\Wysiwyg\Images;
use Magento\Framework\App\ObjectManager;
use Magento\Framework\View\Element\UiComponentFactory;
use Magento\Framework\View\Element\UiComponent\ContextInterface;
use Magento\Ui\Component\Form\Element\DataType\Media\OpenDialogUrl;
use Magento\Variable\Model\Variable\Config as VariableConfig;

/**
 * Updates field element with HTML Code specific config
 */
class HtmlCode extends \Magento\Ui\Component\Form\Field
{
    const HTML_ID_PLACEHOLDER = 'HTML_ID_PLACEHOLDER';

    /**
     * @var BackendUrlInterface
     */
    private $backendUrl;

    /**
     * @var Images
     */
    private $imagesHelper;

    /**
     * @var VariableConfig
     */
    private $variableConfig;

    /**
     * @var string
     */
    private $currentTreePath;

    /**
     * @var OpenDialogUrl
     */
    private $openDialogUrl;

    /**
     * @param ContextInterface $context
     * @param UiComponentFactory $uiComponentFactory
     * @param BackendUrlInterface $backendUrl
     * @param Images $imagesHelper
     * @param VariableConfig $variableConfig
     * @param OpenDialogUrl|null $openDialogUrl
     * @param string $currentTreePath
     * @param array $components
     * @param array $data
     */
    public function __construct(
        ContextInterface $context,
        UiComponentFactory $uiComponentFactory,
        BackendUrlInterface $backendUrl,
        Images $imagesHelper,
        VariableConfig $variableConfig,
        OpenDialogUrl $openDialogUrl = null,
        $currentTreePath = 'wysiwyg',
        $components = [],
        array $data = []
    ) {
        $this->backendUrl = $backendUrl;
        $this->imagesHelper = $imagesHelper;
        $this->variableConfig = $variableConfig;
        $this->currentTreePath = $currentTreePath;
        $this->openDialogUrl = $openDialogUrl ?: ObjectManager::getInstance()->get(OpenDialogUrl::class);
        parent::__construct($context, $uiComponentFactory, $components, $data);
    }

    /**
     * Prepare component configuration
     *
     * @return void
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function prepare()
    {
        $config = $this->getData('config');
        $config['widgetUrl'] = $this->backendUrl->getUrl(
            'adminhtml/widget/index',
            [
                'widget_target_id' => self::HTML_ID_PLACEHOLDER
            ]
        );
        $config['imageUrl'] = $this->backendUrl->getUrl(
            $this->openDialogUrl->get(),
            [
                'current_tree_path' => $this->imagesHelper->idEncode($this->currentTreePath),
                'target_element_id' => self::HTML_ID_PLACEHOLDER
            ]
        );
        $config['variableUrl'] = $this->variableConfig->getVariablesWysiwygActionUrl();
        $this->setData('config', $config);
        parent::prepare();
    }
}
