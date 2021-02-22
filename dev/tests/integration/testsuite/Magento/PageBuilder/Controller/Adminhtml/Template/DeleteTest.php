<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Controller\Adminhtml\Template;

use Magento\Framework\Api\SearchCriteriaBuilder;
use Magento\Framework\App\Request\Http as HttpRequest;
use Magento\PageBuilder\Api\TemplateRepositoryInterface;
use Magento\TestFramework\Helper\Bootstrap;
use Magento\TestFramework\ObjectManager;

/**
 * Perform tests upon Template delete controller
 *
 * @magentoAppArea adminhtml
 */
class DeleteTest extends \Magento\TestFramework\TestCase\AbstractBackendController
{
    /**
     * @var ObjectManager
     */
    private $objectManager;

    /**
     * @var \Magento\PageBuilder\Controller\Adminhtml\Template\Delete
     */
    private $deleteController;

    /**
     * @var TemplateRepositoryInterface
     */
    private $templateRepository;

    /**
     * @var SearchCriteriaBuilder
     */
    private $searchCriteriaBuilder;

    /**
     * @inheritDoc
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->objectManager = Bootstrap::getObjectManager();
        $this->templateRepository = $this->objectManager->get(TemplateRepositoryInterface::class);
        $this->searchCriteriaBuilder = $this->objectManager->get(SearchCriteriaBuilder::class);

        $this->deleteController = $this->objectManager->create(
            \Magento\PageBuilder\Controller\Adminhtml\Template\Delete::class
        );
    }

    /**
     * Test deleting a content type
     *
     * @magentoDataFixture Magento/PageBuilder/_files/template/template.php
     */
    public function testDeleteAction()
    {
        $findTemplate = $this->templateRepository->getList(
            $this->searchCriteriaBuilder->addFilter('name', 'Test Template')->create()
        );
        $this->assertEquals(1, $findTemplate->getTotalCount());
        $items = $findTemplate->getItems();
        $templateId = reset($items)->getId();

        $this->getRequest()->setPostValue(['template_id' => $templateId])->setMethod(HttpRequest::METHOD_POST);
        $this->deleteController->execute();

        $this->expectExceptionMessage('Template with id "' . $templateId . '" does not exist.');
        $this->templateRepository->get($templateId);
    }
}
