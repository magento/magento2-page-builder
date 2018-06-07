<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config\Backend;

class GoogleMapsStyleValidation extends \Magento\Framework\App\Config\Value
{
    /**
     * @var \Magento\Framework\Serialize\JsonValidator
     */
    private $jsonValidator;

    /**
     * @param \Magento\Framework\Model\Context $context
     * @param \Magento\Framework\Registry $registry
     * @param \Magento\Framework\App\Config\ScopeConfigInterface $config
     * @param \Magento\Framework\App\Cache\TypeListInterface $cacheTypeList
     * @param \Magento\Framework\Serialize\JsonValidator $jsonValidator
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb $resourceCollection
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\App\Config\ScopeConfigInterface $config,
        \Magento\Framework\App\Cache\TypeListInterface $cacheTypeList,
        \Magento\Framework\Serialize\JsonValidator $jsonValidator,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        $this->jsonValidator = $jsonValidator;
        parent::__construct($context, $registry, $config, $cacheTypeList, $resource, $resourceCollection, $data);
    }

    /**
     * Validate json string value
     *
     * @return void
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function beforeSave()
    {
        $value = $this->getValue();

        if ($value && is_string($value) && !$this->jsonValidator->isValid($value)) {
            $field = $this->getFieldConfig();
            $label = $field && is_array($field) ? $field['label'] : 'The';
            throw new \Magento\Framework\Exception\LocalizedException(
                __('%1 JSON is invalid. Please paste the valid JSON style.', $label)
            );
        }
    }
}
