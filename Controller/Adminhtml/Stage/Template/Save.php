<?php

namespace Gene\BlueFoot\Controller\Adminhtml\Stage\Template;

use Magento\Framework\App\Filesystem\DirectoryList;

/**
 * Class Save
 *
 * @package Gene\BlueFoot\Controller\Adminhtml\Stage\Widget
 *
 * @author Aidan Threadgold <aidan@gene.co.ul=k>
 */
class Save extends \Magento\Backend\App\Action
{
    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory
     */
    protected $resultJsonFactory;

    /**
     * @var \Gene\BlueFoot\Model\Stage\TemplateFactory
     */
    protected $template;

    /**
     * @var \Magento\Framework\Filesystem
     */
    protected $fileSystem;

    /**
     * @var \Magento\Framework\App\Filesystem\DirectoryList
     */
    protected $directoryList;

    /**
     * Save constructor.
     *
     * @param \Magento\Backend\App\Action\Context              $context
     * @param \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
     * @param \Gene\BlueFoot\Model\Stage\TemplateFactory       $templateFactory
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory,
        \Gene\BlueFoot\Model\Stage\TemplateFactory $templateFactory,
        \Magento\Framework\Filesystem $filesystem,
        DirectoryList $directoryList
    ) {
        parent::__construct($context);

        $this->resultJsonFactory = $resultJsonFactory;
        $this->template = $templateFactory;
        $this->fileSystem = $filesystem;
        $this->directoryList = $directoryList;
    }

    /**
     * Allow users to save templates to be rebuilt on the front-end
     */
    public function execute()
    {
        if ($this->getRequest()->getParam('structure')) {
            $postData = $this->getRequest()->getParams();

            // Write the preview image
            $fileName = "preview_" . time() . ".png";
            $file = $this->fileSystem->getDirectoryWrite(DirectoryList::MEDIA);
            $written = $file->writeFile(
                'bluefoot' . DIRECTORY_SEPARATOR . 'previews' . DIRECTORY_SEPARATOR . $fileName,
                base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $postData['preview']))
            );

            // Stop here if we can't generate a preview image
            if (!$written) {
                return $this->resultJsonFactory->create()->setData(['success' => false]);
            }

            // Strip out entity IDs
            $postData['structure'] = preg_replace(
                "/(['|\"])entity_id(['|\"]):(['|\"])([0-9]{0,100})(['|\"])/",
                "$1entity_id$2:null",
                $postData['structure']
            );

            // Create the modal instance
            $template = $this->template->create();
            $template->addData([
                'name' => $postData['name'],
                'structure' => $postData['structure'],
                'pinned' => (bool) 0, //$postData['pinned'],
                'preview' => $fileName
            ]);

            // Save the template
            $template->getResource()->save($template);

            // Return in JSON format
            if ($template->getId()) {
                // Include the new template data in the response
                $templateData[] = [
                    'id' => $template->getId(),
                    'name' => $template->getData('name'),
                    'preview' => $template->getData('preview'),
                    'structure' => $template->getData('structure'),
                    'pinned' => (bool) $template->getData('pinned')
                ];

                return $this->resultJsonFactory->create()->setData(['success' => true, 'template' => $templateData]);
            }
        }

        return $this->resultJsonFactory->create()->setData(['success' => false]);
    }
}
