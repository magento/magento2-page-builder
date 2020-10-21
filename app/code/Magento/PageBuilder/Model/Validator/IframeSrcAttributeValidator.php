<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Validator;

use Magento\Framework\Validation\ValidationException;
use Magento\Framework\Validator\HTML\AttributeValidatorInterface;

/**
 * Validates "src" of iframes.
 */
class IframeSrcAttributeValidator implements AttributeValidatorInterface
{
    /**
     * @var string[]
     */
    private $allowedHosts;

    /**
     * IframeSrcAttributeValidator constructor.
     *
     * @param string[] $allowedHosts
     */
    public function __construct(array $allowedHosts)
    {
        $this->allowedHosts = $allowedHosts;
    }

    /**
     * @inheritDoc
     */
    public function validate(string $tag, string $attributeName, string $value): void
    {
        if ($tag !== 'iframe' || $attributeName !== 'src') {
            return;
        }

        if (mb_strpos($value, 'http') !== 0) {
            //Relative link
            return;
        }
        // phpcs:ignore Magento2.Functions.DiscouragedFunction
        $srcHost = parse_url($value, PHP_URL_HOST);
        if (!$srcHost || !$this->allowedHosts) {
            //Either the link is invalid or we do not have the allowed list.
            return;
        }
        $srcHostLength = mb_strlen($srcHost);
        foreach ($this->allowedHosts as $host) {
            $hostLength = mb_strlen($host);
            $foundIndex = mb_strpos($srcHost, $host);
            if ($foundIndex !== false && ($foundIndex + $hostLength) === $srcHostLength) {
                return;
            }
        }

        throw new ValidationException(__('Invalid IFRAME source provided'));
    }
}
