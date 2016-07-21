<?php

namespace Gene\BlueFoot\Component\Form\Element;

use Magento\Framework\Data\Form;
use Magento\Framework\Data\FormFactory;
use Magento\Framework\DataObject;
use Magento\Framework\View\Element\UiComponent\ContextInterface;
use Magento\Ui\Component\Wysiwyg\ConfigInterface;

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
     * @param ContextInterface $context
     * @param FormFactory $formFactory
     * @param ConfigInterface $wysiwygConfig
     * @param array $components
     * @param array $data
     * @param array $config
     */
    public function __construct(
        ContextInterface $context,
        FormFactory $formFactory,
        ConfigInterface $wysiwygConfig,
        array $components = [],
        array $data = [],
        array $config = []
    ) {
        // Override the component for the WYSIWYG
        // This is not done using definition.xml due to https://github.com/magento/magento2/issues/5647
        $data['config']['component'] = 'Gene_BlueFoot/js/form/element/wysiwyg';

        // Override the templates to include our KnockoutJS code
        $data['config']['template'] = 'Gene_BlueFoot/wysiwyg';
        $data['config']['elementTmpl'] = 'Gene_BlueFoot/wysiwyg';

        parent::__construct($context, $formFactory, $wysiwygConfig, $components, $data, $config);
    }
}