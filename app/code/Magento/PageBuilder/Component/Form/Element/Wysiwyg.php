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

class Wysiwyg extends \Magento\Ui\Component\Form\Element\Wysiwyg
{
    /**
     * Constructor
     *
     * @param \Magento\Framework\View\Element\UiComponent\ContextInterface $context
     * @param \Magento\Framework\Data\FormFactory $formFactory
     * @param \Magento\Ui\Component\Wysiwyg\ConfigInterface $wysiwygConfig
     * @param \Magento\Catalog\Api\CategoryAttributeRepositoryInterface $attrRepository
     * @param array $components
     * @param array $data
     * @param array $config
     */
    public function __construct(
        ContextInterface $context,
        FormFactory $formFactory,
        ConfigInterface $wysiwygConfig,
        CategoryAttributeRepositoryInterface $attrRepository,
        array $components = [],
        array $data = [],
        array $config = []
    ) {
        // If a dataType is present we're dealing with an attribute
        if (isset($config['dataType'])) {
            try {
                if ($attribute = $attrRepository->get($data['name'])) {
                    $config['wysiwyg'] = (bool)$attribute->getIsWysiwygEnabled();
                }
            } catch (NoSuchEntityException $e) {
                // This model is used by non product attributes
            }
        }

        // This is not done using definition.xml due to https://github.com/magento/magento2/issues/5647
        $data['config']['component'] = 'Magento_PageBuilder/js/form/element/wysiwyg';

        // Override the templates to include our KnockoutJS code
        $data['config']['template'] = 'Magento_PageBuilder/wysiwyg';
        $data['config']['elementTmpl'] = 'Magento_PageBuilder/wysiwyg';

        parent::__construct($context, $formFactory, $wysiwygConfig, $components, $data, $config);
    }
}
