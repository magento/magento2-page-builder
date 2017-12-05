<?php

namespace Gene\BlueFoot\Model\Attribute;

use Magento\Framework\Exception\InputException;
use Magento\Framework\Exception\NoSuchEntityException;

/**
 * Class Repository
 *
 * @package Gene\BlueFoot\Model\Attribute
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Repository implements \Gene\BlueFoot\Api\AttributeRepositoryInterface
{
    /**
     * @var \Magento\Catalog\Model\ResourceModel\Attribute
     */
    protected $attributeResource;

    /**
     * @var \Magento\Eav\Model\AttributeRepository
     */
    protected $eavAttributeRepository;

    /**
     * @var \Magento\Eav\Model\Config
     */
    protected $eavConfig;

    /**
     * @var \Magento\Eav\Model\Adminhtml\System\Config\Source\Inputtype\ValidatorFactory
     */
    protected $inputtypeValidatorFactory;

    /**
     * @var \Magento\Catalog\Helper\Product
     */
    protected $productHelper;

    /**
     * @var \Magento\Framework\Filter\FilterManager
     */
    protected $filterManager;

    /**
     * @var \Magento\Framework\Api\SearchCriteriaBuilder
     */
    protected $searchCriteriaBuilder;

    /**
     * @var \Magento\Catalog\Api\ProductAttributeOptionManagementInterface
     */
    private $optionManagement;

    /**
     * Repository constructor.
     *
     * @param \Gene\BlueFoot\Model\ResourceModel\Attribute                                 $attributeResource
     * @param \Magento\Catalog\Helper\Product                                              $productHelper
     * @param \Magento\Framework\Filter\FilterManager                                      $filterManager
     * @param \Magento\Eav\Api\AttributeRepositoryInterface                                $eavAttributeRepository
     * @param \Magento\Eav\Model\Config                                                    $eavConfig
     * @param \Magento\Eav\Model\Adminhtml\System\Config\Source\Inputtype\ValidatorFactory $validatorFactory
     * @param \Magento\Framework\Api\SearchCriteriaBuilder                                 $searchCriteriaBuilder
     */
    public function __construct(
        \Gene\BlueFoot\Model\ResourceModel\Attribute $attributeResource,
        \Magento\Catalog\Helper\Product $productHelper,
        \Magento\Framework\Filter\FilterManager $filterManager,
        \Magento\Eav\Api\AttributeRepositoryInterface $eavAttributeRepository,
        \Magento\Eav\Model\Config $eavConfig,
        \Magento\Eav\Model\Adminhtml\System\Config\Source\Inputtype\ValidatorFactory $validatorFactory,
        \Magento\Framework\Api\SearchCriteriaBuilder $searchCriteriaBuilder
    ) {
        $this->attributeResource = $attributeResource;
        $this->productHelper = $productHelper;
        $this->filterManager = $filterManager;
        $this->eavAttributeRepository = $eavAttributeRepository;
        $this->eavConfig = $eavConfig;
        $this->inputtypeValidatorFactory = $validatorFactory;
        $this->searchCriteriaBuilder = $searchCriteriaBuilder;
    }

    /**
     * {@inheritdoc}
     */
    public function get($attributeCode)
    {
        return $this->eavAttributeRepository->get(
            \Gene\BlueFoot\Api\Data\EntityInterface::ENTITY,
            $attributeCode
        );
    }

    /**
     * {@inheritdoc}
     */
    public function getList(\Magento\Framework\Api\SearchCriteriaInterface $searchCriteria)
    {
        return $this->eavAttributeRepository->getList(
            \Gene\BlueFoot\Api\Data\EntityInterface::ENTITY,
            $searchCriteria
        );
    }

    /**
     * {@inheritdoc}
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     * @SuppressWarnings(PHPMD.NPathComplexity)
     */
    public function save(\Magento\Catalog\Api\Data\ProductAttributeInterface $attribute)
    {
        if ($attribute->getAttributeId()) {
            $existingModel = $this->get($attribute->getAttributeCode());

            if (!$existingModel->getAttributeId()) {
                throw NoSuchEntityException::singleField('attribute_code', $existingModel->getAttributeCode());
            }

            $attribute->setAttributeId($existingModel->getAttributeId());
            $attribute->setIsUserDefined($existingModel->getIsUserDefined());
            $attribute->setFrontendInput($existingModel->getFrontendInput());

            if (is_array($attribute->getFrontendLabels())) {
                $frontendLabel[0] = $existingModel->getDefaultFrontendLabel();
                foreach ($attribute->getFrontendLabels() as $item) {
                    $frontendLabel[$item->getStoreId()] = $item->getLabel();
                }
                $attribute->setDefaultFrontendLabel($frontendLabel);
            }
            if (!$attribute->getIsUserDefined()) {
                // Unset attribute field for system attributes
                $attribute->setApplyTo(null);
            }
        } else {
            $attribute->setAttributeId(null);

            if (!$attribute->getFrontendLabels() && !$attribute->getDefaultFrontendLabel()) {
                throw InputException::requiredField('frontend_label');
            }

            $frontendLabels = [];
            if ($attribute->getDefaultFrontendLabel()) {
                $frontendLabels[0] = $attribute->getDefaultFrontendLabel();
            }
            if ($attribute->getFrontendLabels() && is_array($attribute->getFrontendLabels())) {
                foreach ($attribute->getFrontendLabels() as $label) {
                    $frontendLabels[$label->getStoreId()] = $label->getLabel();
                }
                if (!isset($frontendLabels[0]) || !$frontendLabels[0]) {
                    throw InputException::invalidFieldValue('frontend_label', null);
                }

                $attribute->setDefaultFrontendLabel($frontendLabels);
            }
            $attribute->setAttributeCode(
                $attribute->getAttributeCode() ?: $this->generateCode($frontendLabels[0])
            );
            $this->validateCode($attribute->getAttributeCode());
            $this->validateFrontendInput($attribute->getFrontendInput());

            $attribute->setBackendType(
                $attribute->getBackendTypeByInput($attribute->getFrontendInput())
            );
            $attribute->setSourceModel(
                $this->productHelper->getAttributeSourceModelByInputType($attribute->getFrontendInput())
            );
            $attribute->setBackendModel(
                $this->productHelper->getAttributeBackendModelByInputType($attribute->getFrontendInput())
            );
            $attribute->setEntityTypeId(
                $this->eavConfig
                    ->getEntityType(\Gene\BlueFoot\Api\Data\EntityInterface::ENTITY)
                    ->getId()
            );
            $attribute->setIsUserDefined(1);
        }
        $this->attributeResource->save($attribute);
        foreach ($attribute->getOptions() as $option) {
            $this->getOptionManagement()->add($attribute->getAttributeCode(), $option);
        }
        return $this->get($attribute->getAttributeCode());
    }

    /**
     * {@inheritdoc}
     */
    public function delete(\Magento\Catalog\Api\Data\ProductAttributeInterface $attribute)
    {
        $this->attributeResource->delete($attribute);
        return true;
    }

    /**
     * {@inheritdoc}
     */
    public function deleteById($attributeCode)
    {
        $this->delete(
            $this->get($attributeCode)
        );
        return true;
    }

    /**
     * {@inheritdoc}
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function getCustomAttributesMetadata($dataObjectClassName = null)
    {
        return $this->getList($this->searchCriteriaBuilder->create())->getItems();
    }

    /**
     * Generate code from label
     *
     * @param string $label
     * @return string
     */
    protected function generateCode($label)
    {
        $code = substr(preg_replace('/[^a-z_0-9]/', '_', $this->filterManager->translitUrl($label)), 0, 30);
        $validatorAttrCode = new \Zend_Validate_Regex(['pattern' => '/^[a-z][a-z_0-9]{0,29}[a-z0-9]$/']);
        if (!$validatorAttrCode->isValid($code)) {
            $code = 'attr_' . ($code ?: substr(md5(time()), 0, 8));
        }
        return $code;
    }

    /**
     * Validate attribute code
     *
     * @param string $code
     * @return void
     * @throws \Magento\Framework\Exception\InputException
     */
    protected function validateCode($code)
    {
        $validatorAttrCode = new \Zend_Validate_Regex(['pattern' => '/^[a-z][a-z_0-9]{0,30}$/']);
        if (!$validatorAttrCode->isValid($code)) {
            throw InputException::invalidFieldValue('attribute_code', $code);
        }
    }

    /**
     * Validate Frontend Input Type
     *
     * @param  string $frontendInput
     * @return void
     * @throws \Magento\Framework\Exception\InputException
     */
    protected function validateFrontendInput($frontendInput)
    {
        /** @var \Magento\Eav\Model\Adminhtml\System\Config\Source\Inputtype\Validator $validator */
        $validator = $this->inputtypeValidatorFactory->create();
        if (!$validator->isValid($frontendInput)) {
            throw InputException::invalidFieldValue('frontend_input', $frontendInput);
        }
    }

    /**
     * @return \Magento\Catalog\Api\ProductAttributeOptionManagementInterface
     */
    private function getOptionManagement()
    {
        if (null === $this->optionManagement) {
            $this->optionManagement = \Magento\Framework\App\ObjectManager::getInstance()
                ->get('Magento\Catalog\Api\ProductAttributeOptionManagementInterface');
        }
        return $this->optionManagement;
    }
}
