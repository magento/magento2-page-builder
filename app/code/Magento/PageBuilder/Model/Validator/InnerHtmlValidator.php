<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Validator;

use Magento\Framework\Validator\HTML\TagValidatorInterface;
use Magento\Framework\Validator\HTML\WYSIWYGValidatorInterface;

/**
 * Validates HTML elements.
 */
class InnerHtmlValidator implements TagValidatorInterface
{
    private const HTML_TYPE_ATTRIBUTE = 'data-content-type';

    /**
     * @inheritDoc
     */
    public function validate(
        string $tag,
        array $attributes,
        string $value,
        WYSIWYGValidatorInterface $recursiveValidator
    ): void {
        if (!array_key_exists(self::HTML_TYPE_ATTRIBUTE, $attributes)
            || strtolower($attributes[self::HTML_TYPE_ATTRIBUTE]) !== 'html'
        ) {
            return;
        }

        // phpcs:ignore Magento2.Functions.DiscouragedFunction
        $recursiveValidator->validate(html_entity_decode($value));
    }
}
