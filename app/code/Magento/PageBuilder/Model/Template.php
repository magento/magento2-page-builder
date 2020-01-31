<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model;

use Magento\Framework\Model\AbstractExtensibleModel;
use Magento\PageBuilder\Api\Data\TemplateExtensionInterface;
use Magento\PageBuilder\Api\Data\TemplateInterface;
use Magento\PageBuilder\Model\ResourceModel\Template as ResourceTemplate;

/**
 * Page Builder stored template for usage in Template Manager
 */
class Template extends AbstractExtensibleModel implements TemplateInterface
{
    protected $_eventPrefix = 'pagebuilder_template';

    /**
     * Initialize resource mode
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init(ResourceTemplate::class);
    }

    /**
     * @inheritDoc
     */
    public function getName() : string
    {
        return $this->getData(TemplateInterface::KEY_NAME);
    }

    /**
     * @inheritDoc
     */
    public function setName(string $name) : TemplateInterface
    {
        return $this->setData(TemplateInterface::KEY_NAME, $name);
    }

    /**
     * @inheritDoc
     */
    public function getPreviewImage() : string
    {
        return $this->getData(TemplateInterface::KEY_PREVIEW_IMAGE);
    }

    /**
     * @inheritDoc
     */
    public function setPreviewImage(string $path) : TemplateInterface
    {
        return $this->setData(TemplateInterface::KEY_PREVIEW_IMAGE, $path);
    }

    /**
     * @inheritDoc
     */
    public function getPreviewThumbnailImage() : string
    {
        return str_replace(
            '.jpg',
            '-thumb.jpg',
            $this->getData(TemplateInterface::KEY_PREVIEW_IMAGE)
        );
    }

    /**
     * @inheritDoc
     */
    public function getTemplate() : string
    {
        return $this->getData(TemplateInterface::KEY_TEMPLATE);
    }

    /**
     * @inheritDoc
     */
    public function setTemplate(string $template) : TemplateInterface
    {
        return $this->setData(TemplateInterface::KEY_TEMPLATE, $template);
    }

    /**
     * @inheritDoc
     */
    public function getCreatedFor() : string
    {
        return $this->getData(TemplateInterface::KEY_CREATED_FOR);
    }

    /**
     * @inheritDoc
     */
    public function setCreatedFor(string $createdFor) : TemplateInterface
    {
        return $this->setData(TemplateInterface::KEY_CREATED_FOR, $createdFor);
    }

    /**
     * @inheritDoc
     */
    public function getUpdatedAt() : string
    {
        return $this->getData(TemplateInterface::KEY_UPDATED_AT);
    }

    /**
     * @inheritDoc
     */
    public function setUpdatedAt(string $updatedAt) : TemplateInterface
    {
        return $this->setData(TemplateInterface::KEY_UPDATED_AT, $updatedAt);
    }

    /**
     * @inheritDoc
     */
    public function getCreatedAt() : string
    {
        return $this->getData(TemplateInterface::KEY_UPDATED_AT);
    }

    /**
     * @inheritDoc
     */
    public function setCreatedAt(string $createdAt) : TemplateInterface
    {
        return $this->setData(TemplateInterface::KEY_CREATED_AT, $createdAt);
    }

    /**
     * @inheritdoc
     */
    public function getExtensionAttributes()
    {
        return $this->_getExtensionAttributes();
    }

    /**
     * @inheritdoc
     */
    public function setExtensionAttributes(
        TemplateExtensionInterface $extensionAttributes
    ) {
        return $this->_setExtensionAttributes($extensionAttributes);
    }
}
