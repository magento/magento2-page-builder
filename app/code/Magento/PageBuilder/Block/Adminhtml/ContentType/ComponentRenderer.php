<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Block\Adminhtml\ContentType;

use Magento\Framework\View\Layout\Data\Structure;
use Magento\Framework\View\Element\Template\Context;
use Magento\Framework\View\Element\BlockFactory;
use Magento\Framework\View\Element\UiComponentFactory;
use Magento\Framework\View\Layout\Data\Structure as DataStructure;
use Magento\Framework\View\Element\UiComponent\ContextFactory as UiComponentContextFactory;
use Magento\Framework\View\Element\UiComponent\ContainerInterface;
use Magento\Framework\View\Element\UiComponentInterface;
use Magento\PageBuilder\Model\Stage\Config\UiComponentConfig;
use Magento\PageBuilder\Block\Adminhtml\ContentType\Edit\ButtonFactory;
use Magento\Framework\View\Layout;

class ComponentRenderer
{
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
     * @var UiComponentConfig
     */
    private $uiComponentConfig;

    /**
     * @var ButtonFactory
     */
    private $buttonFactory;

    /**
     * @var Layout
     */
    private $layout;

    /**
     * Constructor
     *
     * @param DataStructure $structure
     * @param BlockFactory $blockFactory
     * @param UiComponentFactory $uiComponentFactory
     * @param UiComponentContextFactory $contextFactory
     * @param UiComponentConfig $uiComponentConfig
     * @param ButtonFactory $buttonFactory
     * @param Layout $layout
     */
    public function __construct(
        Structure $structure,
        BlockFactory $blockFactory,
        UiComponentFactory $uiComponentFactory,
        UiComponentContextFactory $contextFactory,
        UiComponentConfig $uiComponentConfig,
        ButtonFactory $buttonFactory,
        Layout $layout
    ) {
        $this->structure = $structure;
        $this->blockFactory = $blockFactory;
        $this->uiComponentFactory = $uiComponentFactory;
        $this->contextFactory = $contextFactory;
        $this->uiComponentConfig = $uiComponentConfig;
        $this->buttonFactory = $buttonFactory;
        $this->layout = $layout;
    }

    /**
     * Render a UI component for consumption on the front-end
     *
     * @param $componentName
     * @param $data
     *
     * @return string
     */
    public function renderComponent($componentName, $data = null)
    {
        if ($data === null) {
            $data = [
                'attributes' => [
                    'group' => '',
                    'component' => '',
                    'aclResource' => '',
                    'visibilityConditions' => []
                ]
            ];
        }

        $attributes = $data['attributes'];
        if (!empty($attributes['group'])) {
            $this->structure->addToParentGroup(
                $componentName,
                $attributes['group']
            );
        }

        $context = $this->contextFactory->create(
            [
                'namespace' => $componentName,
                'pageLayout' => $this->layout
            ]
        );

        /**
         * Structure is required for custom component factory like a 'htmlContent'
         */
        $component = $this->uiComponentFactory->create(
            $componentName,
            null,
            ['context' => $context, 'structure' => $this->structure]
        );
        $this->prepareComponent($component);

        /** @var ContainerInterface $blockContainer */
        $blockContainer = $this->blockFactory->createBlock(
            \Magento\Framework\View\Layout\Generator\UiComponent::CONTAINER,
            ['component' => $component]
        );

        return $blockContainer->toHtml() . $this->renderUiComponentButtons($componentName);
    }

    /**
     * Render a UI components buttons
     *
     * @param $componentName
     *
     * @return string
     */
    private function renderUiComponentButtons($componentName)
    {
        /* @var \Magento\Framework\View\Element\Template $buttonContainer */
        $buttonContainer = $this->layout->createBlock(
            \Magento\Framework\View\Element\Template::class,
            $componentName . '-page-actions'
        )->setTemplate('Magento_Backend::pageactions.phtml');

        $buttons = $this->uiComponentConfig->getButtons($componentName);
        foreach ($buttons as $name => $class) {
            $buttonInstance = $this->buttonFactory->create(
                $class,
                ['targetName' => $componentName . '.' . $componentName]
            );
            if ($buttonInstance) {
                $buttonContainer->addChild(
                    $name,
                    \Magento\Ui\Component\Control\Button::class,
                    $buttonInstance->getButtonData()
                );
            }
        }

        return $buttonContainer->toHtml();
    }

    /**
     * Call prepare method in the component UI
     *
     * @param UiComponentInterface $component
     *
     * @return void
     */
    private function prepareComponent(UiComponentInterface $component)
    {
        $childComponents = $component->getChildComponents();
        if (!empty($childComponents)) {
            foreach ($childComponents as $child) {
                $this->prepareComponent($child);
            }
        }
        // Remove any buttons from the main component to stop duplicate rendering
        $component->setData('buttons', []);
        $component->prepare();
    }
}
