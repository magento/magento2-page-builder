<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Component\Form\Element;

use Magento\Framework\Data\FormFactory;
use Magento\Framework\View\Element\UiComponent\ContextInterface;
use Magento\Ui\Component\Wysiwyg\ConfigInterface;
use Magento\Catalog\Api\CategoryAttributeRepositoryInterface;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\PageBuilder\Model\State as PageBuilderState;
use Magento\PageBuilder\Model\Stage\Config as Config;
use Psr\Log\LoggerInterface;

/**
 * Updates wysiwyg element with Page Builder specific config
 *
 * @api
 */
class Wysiwyg extends \Magento\Ui\Component\Form\Element\Wysiwyg
{
    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * Wysiwyg constructor.
     *
     * @param LoggerInterface $logger
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
        LoggerInterface $logger,
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
        $wysiwygConfigData = isset($config['wysiwygConfigData']) ? $config['wysiwygConfigData'] : [];
        // If a dataType is present we're dealing with an attribute
        if (isset($config['dataType'])) {
            try {
                $attribute = $attrRepository->get($data['name']);
                if ($attribute) {
                    $config['wysiwyg'] = (bool)$attribute->getIsWysiwygEnabled();
                }
            } catch (NoSuchEntityException $e) {
                $logger->warning(
                    __('This model is used by non product attributes: %1', $e->getMessage())
                );
            }
        }
        $isEnablePageBuilder = isset($wysiwygConfigData['is_pagebuilder_enabled'])
            && !$wysiwygConfigData['is_pagebuilder_enabled']
            || false;
        if (!$pageBuilderState->isPageBuilderInUse($isEnablePageBuilder)) {
            // This is not done using definition.xml due to https://github.com/magento/magento2/issues/5647
            $data['config']['component'] = 'Magento_PageBuilder/js/form/element/wysiwyg';

            // Override the templates to include our KnockoutJS code
            $data['config']['template'] = 'ui/form/field';
            $data['config']['elementTmpl'] = 'Magento_PageBuilder/form/element/wysiwyg';
            $wysiwygConfigData = $stageConfig->getConfig();
            $data['config']['wysiwygConfigData'] = isset($config['wysiwygConfigData']) ?
                array_replace_recursive($config['wysiwygConfigData'], $wysiwygConfigData) :
                $wysiwygConfigData;
            $wysiwygConfigData['activeEditorPath'] = 'Magento_PageBuilder/pageBuilderAdapter';
            $config['wysiwygConfigData'] = $wysiwygConfigData;
            $wysiwygConfigData['activeEditorPath'] = 'Magento_PageBuilder/pageBuilderAdapter';
        }

        parent::__construct($context, $formFactory, $wysiwygConfig, $components, $data, $config);
        $this->logger = $logger;
    }
}
