<?php

namespace Gene\BlueFoot\Controller\Index;

/**
 * Class Index
 *
 * @package Gene\BlueFoot\Controller\Index
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 * @todo remove this, it's just a testing controller
 */
class Index extends \Magento\Framework\App\Action\Action
{
    /** @var \Magento\Framework\View\Result\Page */
    protected $resultPageFactory;

    /** @var \Gene\BlueFoot\Model\Entity  */
    protected $entityFactory;

    /**      * @param \Magento\Framework\App\Action\Context $context */
    public function __construct(\Magento\Framework\App\Action\Context $context,
                                \Magento\Framework\View\Result\PageFactory $resultPageFactory,
                                \Gene\BlueFoot\Model\EntityFactory $entityFactory)
    {
        $this->resultPageFactory = $resultPageFactory;
        $this->entityFactory = $entityFactory;
        parent::__construct($context);
    }

    /**
     * Blog Index, shows a list of recent blog posts.
     *
     * @return \Magento\Framework\View\Result\PageFactory
     */
    public function execute()
    {
        $resultPage = $this->resultPageFactory->create();
        $resultPage->getConfig()->getTitle()->prepend(__('Gene BlueFoot'));

        $entity = $this->entityFactory->create();
        $entity->load(1);
        var_dump($entity->debug());
        exit;

        return $resultPage;
    }
}