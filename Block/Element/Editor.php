<?php

namespace Gene\BlueFoot\Block\Element;

/**
 * Class Editor
 *
 * @package Gene\BlueFoot\Block\Element
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Editor extends \Magento\Framework\Data\Form\Element\Editor
{
    /**
     * Return HTML button to toggling WYSIWYG
     *
     * @param bool $visible
     * @return string
     */
    protected function _getToggleButtonHtml($visible = true)
    {
        $html = $this->_getButtonHtml(
            [
                'title' => '<i class="fa fa-rocket"></i> ' . $this->translate('Activate BlueFoot'),
                'class' => 'gene-bluefoot init-gene-bluefoot',
                'id' => 'gene-bluefoot' . $this->getHtmlId()
            ]
        );
        $html .= $this->_getButtonHtml(
            [
                'title' => $this->translate('Disable BlueFoot'),
                'class' => 'gene-bluefoot disable-gene-bluefoot',
                'style' => 'display: none;',
                'id' => 'disable-gene-bluefoot' . $this->getHtmlId()
            ]
        );
        $html .= parent::_getToggleButtonHtml($visible);
        return $html;
    }

    /**
     * Include the stage container div before the text area
     *
     * @return string
     */
    protected function _getButtonsHtml()
    {
        $html = parent::_getButtonsHtml();
        $html .= '<script type="text/javascript">buildBlueFoot();</script>';
        $html .= '<div class="gene-bluefoot-stage-container" id="' . $this->getStageHtmlId() . '" style="display: none;"></div>';
        return $html;
    }

    /**
     * Return the HTML ID for the Gene CMS stage
     *
     * @return string
     */
    public function getStageHtmlId()
    {
        return 'gene-bluefoot-stage' . $this->getHtmlId();
    }

    /**
     * Is the stage aspect of the system enabled
     *
     * @return bool
     */
    protected function isStageEnabled()
    {
        return true;
    }

}