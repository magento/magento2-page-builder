<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Component\Form\Element;

use Magento\Framework\Data\FormFactory;
use Magento\Framework\View\Element\UiComponent\ContextInterface;
use Magento\Ui\Component\Wysiwyg\ConfigInterface;
use Magento\Catalog\Api\CategoryAttributeRepositoryInterface;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\PageBuilder\Model\State as PageBuilderState;
use \Magento\PageBuilder\Model\Stage\Config as Config;

class Wysiwyg extends \Magento\Ui\Component\Form\Element\Wysiwyg
{
    /**
     * @var CategoryAttributeRepositoryInterface
     */
    private $attrRepository;

    /**
     * @var PageBuilderState
     */
    private $pageBuilderState;

    /**
     * @var Config
     */
    private $stageConfig;

    /**
     * Wysiwyg constructor.
     *
     * @param ContextInterface $context
     * @param FormFactory $formFactory
     * @param ConfigInterface $wysiwygConfig
     * @param CategoryAttributeRepositoryInterface $attrRepository
     * @param PageBuilderState $pageBuilderState
     * @param Config $stageConfig
     * @param array $components
     * @param array $data
     * @param array $config
     */
    public function __construct(
        ContextInterface $context,
        FormFactory $formFactory,
        ConfigInterface $wysiwygConfig,
        CategoryAttributeRepositoryInterface $attrRepository,
        PageBuilderState $pageBuilderState,
        Config $stageConfig,
        array $components = [],
        array $data = [],
        array $config = []
    ) {
        parent::__construct($context, $formFactory, $wysiwygConfig, $components, $data, $config);
        $this->attrRepository = $attrRepository;
        $this->pageBuilderState = $pageBuilderState;
        $this->stageConfig = $stageConfig;
    }

    /**
     * {@inheritdoc}
     */
    public function prepare()
    {
        parent::prepare();
        $config = $this->getData('config');
        $wysiwygConfigData = isset($config['wysiwygConfigData']) ? $config['wysiwygConfigData'] : [];
        // If a dataType is present we're dealing with an attribute
        if (isset($config['dataType'])) {
            try {
                $attribute = $this->attrRepository->get($this->getComponentName());
                if ($attribute) {
                    $config['wysiwyg'] = (bool)$attribute->getIsWysiwygEnabled();
                }
            } catch (NoSuchEntityException $e) {
                // This model is used by non product attributes
            }
        }
        $isEnablePageBuilder = isset($wysiwygConfigData['is_pagebuilder_enabled'])
            && !$wysiwygConfigData['is_pagebuilder_enabled']
            || false;
        if (!$this->pageBuilderState->isPageBuilderInUse($isEnablePageBuilder)) {
            // This is not done using definition.xml due to https://github.com/magento/magento2/issues/5647
            $config['component'] = 'Magento_PageBuilder/js/form/element/wysiwyg';

            // Override the templates to include our KnockoutJS code
            $config['template'] = 'Magento_PageBuilder/wysiwyg';
            $config['elementTmpl'] = 'Magento_PageBuilder/wysiwyg';
            $wysiwygConfigData = $this->stageConfig->getConfig();
            $wysiwygConfigData['activeEditorPath'] = 'Magento_PageBuilder/pageBuilderAdapter';
            $config['wysiwygConfigData'] = isset($config['wysiwygConfigData']) ?
                array_replace_recursive($config['wysiwygConfigData'], $wysiwygConfigData) :
                $wysiwygConfigData;
        }
        $this->setData('config', (array)$config);
    }
}
