<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Api\Data;

use Magento\Framework\Api\ExtensibleDataInterface;

/**
 * Template Manager template interface
 */
interface TemplateInterface extends ExtensibleDataInterface
{
    const KEY_ID = 'template_id';

    const KEY_NAME = 'name';

    const KEY_PREVIEW_IMAGE = 'preview_image';

    const KEY_TEMPLATE = 'template';

    const KEY_CREATED_FOR = 'created_for';

    const KEY_CREATED_AT = 'created_at';

    const KEY_UPDATED_AT = 'updated_at';

    /**
     * Get Template ID
     *
     * @return int|null
     */
    public function getId();

    /**
     * Set the templates ID
     *
     * @param int $templateId
     * @return TemplateInterface
     */
    public function setId($templateId);

    /**
     * Retrieve name of template
     *
     * @return string|null
     */
    public function getName() : string;

    /**
     * Set the name of the template
     *
     * @param string $name
     * @return TemplateInterface
     */
    public function setName(string $name) : TemplateInterface;

    /**
     * Retrieve the preview image
     *
     * @return string
     */
    public function getPreviewImage() : string;

    /**
     * Set the preview image
     *
     * @param string $path
     * @return TemplateInterface
     */
    public function setPreviewImage(string $path) : TemplateInterface;

    /**
     * Retrieve template value
     *
     * @return string
     */
    public function getTemplate() : string;

    /**
     * Set template value
     *
     * @param string $template
     * @return TemplateInterface
     */
    public function setTemplate(string $template) : TemplateInterface;

    /**
     * Retrieve created for value
     *
     * @return string
     */
    public function getCreatedFor() : string;

    /**
     * Set the created for value
     *
     * @param string $createdFor
     * @return TemplateInterface
     */
    public function setCreatedFor(string $createdFor) : TemplateInterface;

    /**
     * Retrieve the updated at date
     *
     * @return mixed
     */
    public function getUpdatedAt() : string;

    /**
     * Set updated at date
     *
     * @param string $updatedAt
     * @return TemplateInterface
     */
    public function setUpdatedAt(string $updatedAt) : TemplateInterface;

    /**
     * Get the created at date
     *
     * @return string
     */
    public function getCreatedAt() : string;

    /**
     * Set the created at date
     *
     * @param string $createdAt
     * @return TemplateInterface
     */
    public function setCreatedAt(string $createdAt) : TemplateInterface;
}
