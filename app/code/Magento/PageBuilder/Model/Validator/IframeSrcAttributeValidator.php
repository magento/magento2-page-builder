<?php
/**
 * Copyright 2020 Adobe
 * All Rights Reserved.
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
     * @var array
     */
    private array $allowedHostsMap;

    /**
     * @var string[]
     */
    private array $allowedHosts;

    /**
     * IframeSrcAttributeValidator constructor.
     *
     * @param string[] $allowedHosts
     */
    public function __construct(array $allowedHosts)
    {
        $normalized = array_map('strtolower', $allowedHosts);
        $this->allowedHosts = $normalized;
        $this->allowedHostsMap = array_fill_keys($normalized, true);
    }

    /**
     * @inheritDoc
     */
    public function validate(string $tag, string $attributeName, string $value): void
    {
        if ($tag !== 'iframe' || $attributeName !== 'src' || !$this->allowedHosts) {
            return;
        }

        // phpcs:ignore Magento2.Functions.DiscouragedFunction
        $srcHost = parse_url($value, PHP_URL_HOST);
        if (!$srcHost) {
            throw new ValidationException(__('Invalid IFRAME source provided'));
        }

        $srcHost = strtolower($srcHost);
        if (isset($this->allowedHostsMap[$srcHost])) {
            return;
        }

        foreach ($this->allowedHosts as $host) {
            if (str_ends_with($srcHost, '.' . $host)) {
                return;
            }
        }

        throw new ValidationException(__('Invalid IFRAME source provided'));
    }
}
