<?php

namespace Gene\BlueFoot\Block\Adminhtml\Stage;

/**
 * Class Init
 *
 * @package Gene\BlueFoot\Block\Adminhtml\Stage
 *
 * @author  Dave Macaulay <dave@gene.co.uk>
 */
class Init extends \Magento\Backend\Block\Template
{
    /**
     * @var \Gene\BlueFoot\Model\Stage\Plugin
     */
    protected $plugin;

    /**
     * @var \Magento\Framework\UrlInterface
     */
    protected $urlBuilder;

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
        array $data = []
    )
    {
        parent::__construct($context, $data);
        $this->plugin = $plugin;
        $this->urlBuilder = $context->getUrlBuilder();
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
            'encode_string'                    => \Gene\BlueFoot\Model\Stage\Save::BLUEFOOT_STRING,
            'stage_template'                   => '#gene-bluefoot-stage-template',
            'template_template'                => '#gene-bluefoot-stage-template-controls',
            'template_selection_grid_template' => '#gene-bluefoot-template-selection-grid',
            'panel_template'                   => '#gene-bluefoot-stage-panel-template',
            'row_template'                     => '#gene-bluefoot-row-template',
            'column_template'                  => '#gene-bluefoot-column-template',
            'option_template'                  => '#gene-bluefoot-option-template',
            'entity_template'                  => '#gene-bluefoot-entity',
            'entity_preview_template'          => '#gene-bluefoot-entity-preview',
            'configure_template'               => '#gene-bluefoot-stage-configure-template',
            'alert_template'                   => '#gene-bluefoot-alert',
            'form_key'                         => $this->formKey->getFormKey(),
            'init_button_class'                => '.init-gene-bluefoot',
            'config_url'                       => $this->urlBuilder->getUrl('bluefoot/stage/config'),
            'data_update_url'                  => $this->urlBuilder->getUrl('bluefoot/stage/preview'),
            'template_save_url'                => $this->urlBuilder->getUrl('bluefoot/stage/template_save'),
            'template_delete_url'              => $this->urlBuilder->getUrl('bluefoot/stage/template_delete'),
            'template_pin_url'                 => $this->urlBuilder->getUrl('bluefoot/stage/template_pin'),
            'columns'                          => 6,

            /* Define the different column options to be given in the UI */
            'column_definitions'               => [
                ['label' => 'One Whole', 'breakpoint' => '1', 'className' => 'bluefoot-structure-wrapper-width-whole', 'displayed' => true],
                ['label' => 'One Half', 'breakpoint' => '0.500', 'className' => 'bluefoot-structure-wrapper-width-half', 'displayed' => true],
                ['label' => 'One Third', 'breakpoint' => '0.333', 'className' => 'bluefoot-structure-wrapper-width-third', 'displayed' => true],
                ['label' => 'One Quarter', 'breakpoint' => '0.250', 'className' => 'bluefoot-structure-wrapper-width-quarter', 'displayed' => true],
                ['label' => 'One Sixth', 'breakpoint' => '0.167', 'className' => 'bluefoot-structure-wrapper-width-sixth', 'displayed' => true],

                ['label' => 'Two Thirds', 'breakpoint' => '0.666', 'className' => 'bluefoot-structure-wrapper-width-two-thirds', 'displayed' => false],
                ['label' => 'Three Quarters', 'breakpoint' => '0.750', 'className' => 'bluefoot-structure-wrapper-width-three-quarters', 'displayed' => false],
                ['label' => 'Five Sixths', 'breakpoint' => '0.750', 'className' => 'bluefoot-structure-wrapper-width-five-sixths', 'displayed' => false],
            ],
        ]);

        // Include our plugin information
        $config->setData('plugins', $this->plugin->getJsPlugins());

        // Fire event to allow extra data to be passed to the stage
        $this->_eventManager->dispatch('gene_bluefoot_stage_build_config', ['config' => $config]);

        return $config->toJson();
    }
}
