<?php

namespace Gene\BlueFoot\Block\Entity\PageBuilder\Structural;

/**
 * Class Column
 *
 * @package Gene\BlueFoot\Block\Entity\PageBuilder\Structural
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Row extends AbstractStructural
{
    /**
     * Base path of templates
     * @var string
     */
    protected $path = 'Gene_BlueFoot::pagebuilder/structural/core/row/';

    /**
     * Render block HTML
     *
     * @return string
     */
    protected function _toHtml()
    {
        if (($template = $this->getFormData('template')) && $template != 'default.phtml') {
            $this->setTemplate($this->path . $template);
        }

        return parent::_toHtml();
    }
}
