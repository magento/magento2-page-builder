<?php

namespace Gene\BlueFoot\Block\Adminhtml\Entity\ContentBlock\Renderer;

/**
 * Class Icon
 *
 * @package Gene\BlueFoot\Block\Adminhtml\Entity\ContentBlock\Renderer
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Icon extends \Magento\Backend\Block\Widget\Grid\Column\Renderer\AbstractRenderer
{
    /**
     * Render the icon in the grid
     *
     * @param \Magento\Framework\DataObject $row
     *
     * @return string
     */
    public function render(\Magento\Framework\DataObject $row)
    {
        $icon =  'fa fa-' . $row->getData($this->getColumn()->getIndex());
        return '<i style="color:#444; font-size:24px;" class = "' . $icon . '">'.'</i>';
    }
}
