package com.rainbowforest.userservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    private static final String OTP_PREFIX = "OTP:";
    private static final long OTP_TTL_MINUTES = 3;
    private final SecureRandom secureRandom = new SecureRandom();

    public String generateAndSaveOtp(String email) {
        // Generate a 6-digit OTP
        int otpNumber = 100000 + secureRandom.nextInt(900000);
        String otpCode = String.valueOf(otpNumber);

        // Save to Redis with 3 minutes TTL
        redisTemplate.opsForValue().set(OTP_PREFIX + email, otpCode, OTP_TTL_MINUTES, TimeUnit.MINUTES);

        return otpCode;
    }

    public boolean verifyAndDeleteOtp(String email, String otpCode) {
        String key = OTP_PREFIX + email;
        String storedOtp = redisTemplate.opsForValue().get(key);

        if (storedOtp != null && storedOtp.equals(otpCode)) {
            // Valid OTP -> delete it to prevent reuse
            redisTemplate.delete(key);
            return true;
        }
        return false;
    }
}
