<?php
/**
 * Copyright 2026 Adobe
 * All Rights Reserved.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Test\Unit\Component\Form\Element;

use Magento\Catalog\Api\CategoryAttributeRepositoryInterface;
use Magento\Framework\AuthorizationInterface;
use Magento\Framework\Data\Form;
use Magento\Framework\Data\Form\Element\Editor;
use Magento\Framework\Data\FormFactory;
use Magento\Framework\View\Asset\Repository;
use Magento\Framework\View\Element\UiComponent\ContextInterface;
use Magento\PageBuilder\Component\Form\Element\Wysiwyg;
use Magento\PageBuilder\Model\Stage\Config as StageConfig;
use Magento\PageBuilder\Model\State as PageBuilderState;
use Magento\Ui\Component\Wysiwyg\ConfigInterface;
use Magento\Ui\Model\Validation\WysiwygValidationConfigResolver;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

/**
 * @covers \Magento\PageBuilder\Component\Form\Element\Wysiwyg
 */
class WysiwygTest extends TestCase
{
    /**
     * @var ContextInterface|MockObject
     */
    private ContextInterface|MockObject $context;

    /**
     * @var FormFactory|MockObject
     */
    private FormFactory|MockObject $formFactory;

    /**
     * @var ConfigInterface|MockObject
     */
    private ConfigInterface|MockObject $wysiwygConfig;

    /**
     * @var CategoryAttributeRepositoryInterface|MockObject
     */
    private CategoryAttributeRepositoryInterface|MockObject $attrRepository;

    /**
     * @var PageBuilderState|MockObject
     */
    private PageBuilderState|MockObject $pageBuilderState;

    /**
     * @var StageConfig|MockObject
     */
    private StageConfig|MockObject $stageConfig;

    /**
     * @var AuthorizationInterface|MockObject
     */
    private AuthorizationInterface|MockObject $authorization;

    /**
     * @var Repository|MockObject
     */
    private Repository|MockObject $assetRepo;

    /**
     * @var WysiwygValidationConfigResolver|MockObject
     */
    private WysiwygValidationConfigResolver|MockObject $validationConfigResolver;

    /**
     * @inheritDoc
     */
    protected function setUp(): void
    {
        parent::setUp();

        $editor = $this->createMock(Editor::class);
        $editor->method('getElementHtml')->willReturn('');

        $form = $this->createMock(Form::class);
        $form->method('addField')->willReturn($editor);

        $this->context = $this->createMock(ContextInterface::class);
        $this->context->method('getNamespace')->willReturn('test_ns');

        $this->formFactory = $this->createMock(FormFactory::class);
        $this->formFactory->method('create')->willReturn($form);

        $this->wysiwygConfig = $this->createMock(ConfigInterface::class);
        $this->wysiwygConfig->method('getConfig')->willReturn(null);

        $this->attrRepository = $this->createMock(CategoryAttributeRepositoryInterface::class);
        $this->pageBuilderState = $this->createMock(PageBuilderState::class);
        $this->stageConfig = $this->createMock(StageConfig::class);
        $this->authorization = $this->createMock(AuthorizationInterface::class);
        $this->assetRepo = $this->createMock(Repository::class);
        $this->validationConfigResolver = $this->createMock(WysiwygValidationConfigResolver::class);
    }

    /**
     * When Page Builder is initialised for the field, allowUtf8mb4 must be resolved and written
     * into wysiwygConfigData so the PB stage JS config can pick it up.
     */
    public function testAllowUtf8mb4IsResolvedIntoWysiwygConfigDataWhenPageBuilderIsActive(): void
    {
        $this->pageBuilderState->method('isPageBuilderInUse')->willReturn(false);
        $this->authorization->method('isAllowed')->willReturn(true);
        $this->stageConfig->method('getConfig')->willReturn([]);

        // Called once by PB branch + once by parent constructor
        $this->validationConfigResolver->expects(self::exactly(2))
            ->method('resolveAllowUtf8mb4')
            ->willReturn(true);

        $wysiwyg = $this->createWysiwyg();

        $configData = $wysiwyg->getData('config');
        self::assertTrue($configData['wysiwygConfigData']['allowUtf8mb4']);
    }

    /**
     * When Page Builder is already in use (nested context), the PB branch is skipped and
     * allowUtf8mb4 is only resolved by the parent constructor for form validation params.
     */
    public function testAllowUtf8mb4IsNotAddedToWysiwygConfigDataWhenPageBuilderBranchIsSkipped(): void
    {
        $this->pageBuilderState->method('isPageBuilderInUse')->willReturn(true);
        $this->authorization->method('isAllowed')->willReturn(true);

        // Called once only by parent constructor; PB branch is skipped
        $this->validationConfigResolver->expects(self::once())
            ->method('resolveAllowUtf8mb4')
            ->willReturn(false);

        $wysiwyg = $this->createWysiwyg();

        $configData = $wysiwyg->getData('config');
        self::assertArrayNotHasKey('allowUtf8mb4', $configData['wysiwygConfigData'] ?? []);
    }

    /**
     * @return Wysiwyg
     */
    private function createWysiwyg(): Wysiwyg
    {
        return new Wysiwyg(
            $this->context,
            $this->formFactory,
            $this->wysiwygConfig,
            $this->attrRepository,
            $this->pageBuilderState,
            $this->stageConfig,
            [],
            ['name' => 'content'],
            [],
            null,
            false,
            $this->assetRepo,
            $this->authorization,
            $this->validationConfigResolver
        );
    }
}
