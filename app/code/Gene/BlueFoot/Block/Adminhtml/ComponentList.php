<?php
/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Gene\BlueFoot\Block\Adminhtml;

use Magento\Framework\View\Element\Template\Context;
use Magento\Framework\View\Element\BlockFactory;
use Magento\Framework\View\Element\UiComponentFactory;
use Magento\Framework\View\Layout\Data\Structure as DataStructure;
use Magento\Framework\View\Element\UiComponent\ContextFactory as UiComponentContextFactory;
use Magento\Framework\View\Element\UiComponent\ContainerInterface;
use Magento\Framework\View\Element\UiComponentInterface;

/**
 * Class ComponentList
 *
 * @package Gene\BlueFoot\Block\Adminhtml
 */
class ComponentList extends \Magento\Framework\View\Element\Template
{
    /**
     * @var \Gene\BlueFoot\Model\Config\ConfigInterface
     */
    private $configInterface;

    /**
     * @var DataStructure
     */
    private $structure;

    /**
     * @var BlockFactory
     */
    private $blockFactory;

    /**
     * @var UiComponentFactory
     */
    private $uiComponentFactory;

    /**
     * @var UiComponentContextFactory
     */
    private $contextFactory;

    /**
     * ComponentList constructor.
     * @todo move into abstracted generator class
     *
     * @param \Gene\BlueFoot\Model\Config\ConfigInterface $configInterface
     * @param Context                                     $context
     * @param array                                       $data
     */
    public function __construct(
        \Gene\BlueFoot\Model\Config\ConfigInterface $configInterface,
        \Magento\Framework\View\Layout\Data\Structure $structure,
        BlockFactory $blockFactory,
        UiComponentFactory $uiComponentFactory,
        UiComponentContextFactory $contextFactory,
        Context $context,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->configInterface = $configInterface;
        $this->structure = $structure;
        $this->blockFactory = $blockFactory;
        $this->uiComponentFactory = $uiComponentFactory;
        $this->contextFactory = $contextFactory;
    }

    /**
     * @param $elementName
     * @param $data
     *
     * @return ContainerInterface
     */
    protected function generateComponent($elementName, $data)
    {
        $attributes = $data['attributes'];
        if (!empty($attributes['group'])) {
            $this->structure->addToParentGroup(
                $elementName, $attributes['group']
            );
        }

        $context = $this->contextFactory->create(
            [
                'namespace'  => $elementName,
                'pageLayout' => $this->_layout
            ]
        );

        /**
         * Structure is required for custom component factory like a 'htmlContent'
         *
         * @todo error handling required in factory, missing component throws Uncaught TypeError
         */
        $component = $this->uiComponentFactory->create(
            $elementName,
            null,
            ['context' => $context, 'structure' => $this->structure]
        );
        $this->prepareComponent($component);

        /** @var ContainerInterface $blockContainer */
        $blockContainer = $this->blockFactory->createBlock(
            \Magento\Framework\View\Layout\Generator\UiComponent::CONTAINER,
            ['component' => $component]
        );

        return $blockContainer;
    }

    /**
     * Call prepare method in the component UI
     *
     * @param UiComponentInterface $component
     *
     * @return void
     */
    protected function prepareComponent(UiComponentInterface $component)
    {
        $childComponents = $component->getChildComponents();
        if (!empty($childComponents)) {
            foreach ($childComponents as $child) {
                $this->prepareComponent($child);
            }
        }
        $component->prepare();
    }

    /**
     * Generate the buttons for each form
     * @todo requires drastic refactoring
     *
     * @param string $name
     *
     * @return void
     */
    public function generateButtons($name)
    {
        $targetName = $name . '.' . $name;
        $saveAction = json_encode(
            [
                'buttonAdapter' => [
                    'actions' => [
                        [
                            'targetName' => $targetName,
                            'actionName' => 'save',
                            'params'     => [
                                false,
                            ]
                        ]
                    ]
                ]
            ]
        );
        $resetAction = json_encode(
            [
                'buttonAdapter' => [
                    'actions' => [
                        [
                            'targetName' => $targetName,
                            'actionName' => 'reset',
                            'params'     => [
                                false,
                            ]
                        ]
                    ]
                ]
            ]
        );
        $closeAction = json_encode(
            [
                'buttonAdapter' => [
                    'actions' => [
                        [
                            'targetName' => 'bluefoot_modal_form.bluefoot_modal_form.modal',
                            'actionName' => 'closeModal',
                            'params'     => [
                                false,
                            ]
                        ]
                    ]
                ]
            ]
        );

        // @todo generate these buttons using templates correctly
        return <<<EOF
        <div data-mage-init='{"floatingHeader": {}}' class="page-actions" data-ui-id="page-actions-toolbar-content-header">
            <button id="save" title="Save" type="button" class="action- scalable save primary" data-mage-init='{$saveAction}' data-form-role="save" data-ui-id="save-button" > <span>Save</span> </button>
            <button id="reset" title="Reset" type="button" class="action- scalable reset" data-ui-id="reset-button" data-mage-init='{$resetAction}'> <span>Reset</span> </button>
            <button id="cancel" title="Cancel" type="button" class="action- scalable back" data-ui-id="cancel-button" data-role="closeBtn" data-mage-init='{$closeAction}'><span>Cancel</span></button>
        </div>
EOF;
    }

    /**
     * Get components [component_name => instance]
     *
     * @return array
     */
    public function getComponents()
    {
        $result = [];

        foreach (
            $this->configInterface->getContentTypes() as $key => $contentType
        ) {
            $result[$contentType['form']] = $this->generateComponent(
                    $contentType['form'],
                    [
                        'attributes' => [
                            'group'                => '',
                            'component'            => '',
                            'aclResource'          => '',
                            'visibilityConditions' => []
                        ]
                    ]
                )->toHtml() . $this->generateButtons($contentType['form']);
        }
        return $result;
    }
}
