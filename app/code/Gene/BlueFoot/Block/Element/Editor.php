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
        $buttonHtml = '';
        if ($this->getConfig()->getData('pagebuilder_button') !== false) {
            $buttonHtml .= $this->_getButtonHtml(
                [
                    'title' => $this->translate('Enable Advanced CMS'),
                    'class' => 'gene-bluefoot init-gene-bluefoot action-default scalable action action-secondary',
                    'id' => 'gene-bluefoot' . $this->getHtmlId()
                ]
            );
            $buttonHtml .= $this->_getButtonHtml(
                [
                    'title' => $this->translate('Disable Advanced CMS'),
                    'class' => 'gene-bluefoot disable-gene-bluefoot',
                    'style' => 'display: none;',
                    'id' => 'disable-gene-bluefoot' . $this->getHtmlId()
                ]
            );
        }
        return $buttonHtml . parent::_getToggleButtonHtml($visible);
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
