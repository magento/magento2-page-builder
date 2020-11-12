<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Session;

use Magento\Framework\Math\Random;
use Magento\Framework\Session\SessionManagerInterface;

/**
 * Generate random key and save it in current session
 *
 * @SuppressWarnings(PHPMD.CookieAndSessionMisuse)
 */
class RandomKey
{
    /**
     * Default key length to generate
     */
    private const DEFAULT_KEY_LENGTH = 16;

    /**
     * Default key name
     */
    private const DEFAULT_NAME = '_pb_config_cache_key_suffix';

    /**
     * @var Random
     */
    private $random;

    /**
     * @var SessionManagerInterface
     */
    private $session;

    /**
     * @var string
     */
    private $keyName;

    /**
     * @var int
     */
    private $keyLength;

    /**
     * @param Random $random
     * @param SessionManagerInterface $session
     * @param string $keyName
     * @param int $keyLength
     */
    public function __construct(
        Random $random,
        SessionManagerInterface $session,
        string $keyName = self::DEFAULT_NAME,
        int $keyLength = self::DEFAULT_KEY_LENGTH
    ) {
        $this->random = $random;
        $this->session = $session;
        $this->keyName = $keyName;
        $this->keyLength = $keyLength;
    }

    /**
     * Retrieve generated random key from session
     *
     * @return string
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function getValue(): string
    {
        $randomKey = $this->session->getData($this->keyName);
        if (!$randomKey) {
            $randomKey = $this->random->getRandomString($this->keyLength);
            $this->session->setData($this->keyName, $randomKey);
        }
        return $randomKey;
    }
}
