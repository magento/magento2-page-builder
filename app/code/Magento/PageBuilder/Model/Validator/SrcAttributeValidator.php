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
class SrcAttributeValidator implements AttributeValidatorInterface
{
    /**
     * @var string[]
     */
    private $allowedHosts;

    /**
     * @param string[] $allowedHosts
     */
    public function __construct(array $allowedHosts)
    {
        $this->allowedHosts = $allowedHosts;
    }

    public function validate(string $tag, string $attributeName, string $value): void
    {
        if ($tag !== 'iframe' || $attributeName !== 'src') {
            return;
        }

        if (mb_strpos($value, 'http') !== 0) {
            return;
        }
        $srcHost = parse_url($value, PHP_URL_HOST);
        if ($srcHost && $this->allowedHosts) {
            $srcHostLength = mb_strlen($srcHost);
            $allowed = false;
            foreach ($this->allowedHosts as $host) {
                $hostLength = mb_strlen($host);
                $foundIndex = mb_strpos($srcHost, $host);
                if ($foundIndex !== false && ($foundIndex + $hostLength) === $srcHostLength) {
                    $allowed = true;
                    break;
                }
            }
            if ($allowed) {
                return;
            }
        }

        throw new ValidationException(__('Invalid IFRAME source provided'));
    }
}
