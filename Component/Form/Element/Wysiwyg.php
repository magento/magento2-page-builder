<?php

namespace Gene\BlueFoot\Component\Form\Element;

use Magento\Backend\Block\Widget\Button;
use Magento\Framework\Data\Form;
use Magento\Framework\Data\FormFactory;
use Magento\Framework\DataObject;
use Magento\Framework\View\Element\UiComponent\ContextInterface;
use Magento\Ui\Component\Wysiwyg\ConfigInterface;
use Magento\Catalog\Api\CategoryAttributeRepositoryInterface;
use Magento\Framework\Exception\NoSuchEntityException;


/**
 * Class Wysiwyg
 *
 * @package Gene\BlueFoot\Component\Form\Element
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Wysiwyg extends \Magento\Ui\Component\Form\Element\Wysiwyg
{
    /**
     * Wysiwyg constructor.
     *
     * @param \Magento\Framework\View\Element\UiComponent\ContextInterface $context
     * @param \Magento\Framework\Data\FormFactory                          $formFactory
     * @param \Magento\Ui\Component\Wysiwyg\ConfigInterface                $wysiwygConfig
     * @param \Magento\Catalog\Api\CategoryAttributeRepositoryInterface    $attrRepository
     * @param array                                                        $components
     * @param array                                                        $data
     * @param array                                                        $config
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

        // Override the component for the WYSIWYG
        // This is not done using definition.xml due to https://github.com/magento/magento2/issues/5647
        $data['config']['component'] = 'Gene_BlueFoot/js/form/element/wysiwyg';

        // Override the templates to include our KnockoutJS code
        $data['config']['template'] = 'Gene_BlueFoot/wysiwyg';
        $data['config']['elementTmpl'] = 'Gene_BlueFoot/wysiwyg';

        parent::__construct($context, $formFactory, $wysiwygConfig, $components, $data, $config);
    }
}
