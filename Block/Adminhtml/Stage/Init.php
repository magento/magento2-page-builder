<?php

namespace Gene\BlueFoot\Block\Adminhtml\Stage;

/**
 * Class Init
 *
 * @package Gene\BlueFoot\Block\Adminhtml\Stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Init extends \Magento\Backend\Block\Template
{
    /**
     * @var \Magento\Framework\Data\Form\FormKey
     */
    protected $formKey;

    /**
     * @var \Gene\BlueFoot\Model\Stage\Plugin
     */
    protected $plugin;

    /**
     * @var \Magento\Framework\UrlInterface
     */
    protected $_urlBuilder;

    /**
     * Init constructor.
     *
     * @param \Magento\Backend\Block\Template\Context $context
     * @param \Gene\BlueFoot\Model\Stage\Plugin       $plugin
     * @param array                                   $data
     */
    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Gene\BlueFoot\Model\Stage\Plugin $plugin,
        \Magento\Framework\UrlInterface $urlInterface,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->plugin = $plugin;
        $this->_urlBuilder = $urlInterface;
    }

    /**
     * Return the initial configuration
     *
     * @return string
     */
    public function getConfig()
    {
        $config = new \Magento\Framework\DataObject();
        $config->addData([
            'encode_string' => \Gene\BlueFoot\Model\Stage\Save::BLUEFOOT_STRING,
            'stage_template' => '#gene-bluefoot-stage-template',
            'template_template' => '#gene-bluefoot-stage-template-controls',
            'template_selection_grid_template' => '#gene-bluefoot-template-selection-grid',
            'panel_template' => '#gene-bluefoot-stage-panel-template',
            'row_template' => '#gene-bluefoot-row-template',
            'column_template' => '#gene-bluefoot-column-template',
            'option_template' => '#gene-bluefoot-option-template',
            'entity_template' => '#gene-bluefoot-entity',
            'entity_preview_template' => '#gene-bluefoot-entity-preview',
            'configure_template' => '#gene-bluefoot-stage-configure-template',
            'alert_template' => '#gene-bluefoot-alert',
            'form_key' => $this->formKey->getFormKey(),
            'init_button_class' => '.init-gene-bluefoot',
            'config_url' => $this->_urlBuilder->getUrl('bluefoot/stage/config'),
            'data_update_url' => $this->_urlBuilder->getUrl('bluefoot/stage/preview'),
            'template_save_url' => $this->_urlBuilder->getUrl('bluefoot/stage/template_save'),
            'template_delete_url' => $this->_urlBuilder->getUrl('bluefoot/stage/template_delete'),
            'template_pin_url' => $this->_urlBuilder->getUrl('bluefoot/stage/template_pin'),
            'columns' => 6,

            /* Define the different column options to be given in the UI */
            'column_options' => [
                1 => 'One',
                2 => 'Two',
                3 => 'Three',
                4 => 'Four',
                6 => 'Six'
            ],

            /* Allowed sizes have to be at 3 decimal places */
            'allowed_sizes' => [
                '0.167' => '1/6',
                '0.250' => '1/4',
                '0.333' => '1/3',
                '0.500' => '1/2',
                '0.666' => '2/3',
                '0.750' => '3/4',
                '0.825' => '5/6',
                '1.000' => '1'
            ],

            /* Some sizes do not map correctly, so manually specify them */
            'actual_css_size' => [
                '0.167' => '16.666666667'
            ]
        ]);

        // Include our plugin information
        $config->setData('plugins', $this->plugin->getJsPlugins());

        // Fire event to allow extra data to be passed to the stage
        $this->_eventManager->dispatch('gene_bluefoot_stage_build_config', ['config' => $config]);

        return $config->toJson();
    }

}