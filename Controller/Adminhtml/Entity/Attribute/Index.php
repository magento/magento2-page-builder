<?php

namespace Gene\BlueFoot\Controller\Adminhtml\Entity\Attribute;

/**
 * Class Attribute
 *
 * @package Gene\BlueFoot\Controller\Adminhtml\Entity\Attribute
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Index extends \Gene\BlueFoot\Controller\Adminhtml\Entity\Attribute
{
    /**
     * Index action
     *
     * @return \Magento\Backend\Model\View\Result\Page
     */
    public function execute()
    {
        $resultPage = $this->createActionPage();
        $resultPage->addContent(
            $resultPage->getLayout()->createBlock('Gene\BlueFoot\Block\Adminhtml\Entity\Attribute')
        );
        return $resultPage;
    }
}