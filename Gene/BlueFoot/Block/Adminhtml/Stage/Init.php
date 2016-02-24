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
     * @param \Magento\Backend\Block\Template\Context $context
     * @param \Magento\Framework\Data\Form\FormKey $formKey
     * @param array $data
     */
    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Magento\Framework\Data\Form\FormKey $formKey,
        array $data = []
    ) {
        $this->formKey = $formKey;
        parent::__construct($context, $data);
    }

    /**
     * Return the initial configuration
     *
     * @return string
     */
    public function getConfig()
    {
        $config = new \Magento\Framework\DataObject();
        $config->addData(array(
            'encode_string' => 'GENE_CMS',
            'stage_template' => '#gene-cms-stage-template',
            'panel_template' => '#gene-cms-stage-panel-template',
            'row_template' => '#gene-cms-row-template',
            'column_template' => '#gene-cms-column-template',
            'option_template' => '#gene-cms-option-template',
            'entity_template' => '#gene-cms-entity',
            'entity_preview_template' => '#gene-cms-entity-preview',
            'configure_template' => '#gene-cms-stage-configure-template',
            'alert_template' => '#gene-cms-alert',
            'form_key' => $this->formKey->getFormKey(),
            'init_button_class' => '.init-gene-cms',
            'config_url' => $this->getUrl('bluefoot/stage/config'),
            'data_update_url' => $this->getUrl('bluefoot/stage/dataUpdate'),
            'columns' => 6,

            /* Allowed sizes have to be at 3 decimal places */
            // @todo fix issue with 1/6 columns
            'allowed_sizes' => array(
                '0.167' => '1/6',
                '0.250' => '1/4',
                '0.333' => '1/3',
                '0.500' => '1/2',
                '0.666' => '2/3',
                '0.750' => '3/4',
                '0.825' => '5/6',
                '1.000' => '1'
            )
        ));

        return $config->toJson();
    }
}