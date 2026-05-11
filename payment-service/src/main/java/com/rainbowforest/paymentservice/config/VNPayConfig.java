package com.rainbowforest.paymentservice.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Random;

/**
 * ═══════════════════════════════════════════════════════════════════════
 *  VNPay Configuration & Utility
 *  Đọc cấu hình từ application.yml, cung cấp hàm tiện ích cho VNPAY
 * ═══════════════════════════════════════════════════════════════════════
 */
@Configuration
public class VNPayConfig {

    @Value("${vnpay.tmn-code}")
    private String tmnCode;

    @Value("${vnpay.hash-secret}")
    private String hashSecret;

    @Value("${vnpay.url}")
    private String vnpUrl;

    @Value("${vnpay.return-url}")
    private String returnUrl;

    @Value("${vnpay.api-url}")
    private String apiUrl;

    // ─── GETTERS ──────────────────────────────────────────────────────────
    public String getTmnCode()    { return tmnCode; }
    public String getHashSecret() { return hashSecret; }
    public String getVnpUrl()     { return vnpUrl; }
    public String getReturnUrl()  { return returnUrl; }
    public String getApiUrl()     { return apiUrl; }

    // ═══════════════════════════════════════════════════════════════════════
    //  HMAC SHA-512  –  Hàm tạo chữ ký bảo mật theo chuẩn VNPAY
    // ═══════════════════════════════════════════════════════════════════════
    public static String hmacSHA512(String key, String data) {
        try {
            if (key == null || data == null) {
                throw new IllegalArgumentException("Key and data must not be null");
            }
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);

            byte[] result = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder sb = new StringBuilder(result.length * 2);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (Exception ex) {
            throw new RuntimeException("Error generating HMAC SHA512", ex);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  Lấy địa chỉ IP thật của client (hỗ trợ cả proxy / load balancer)
    // ═══════════════════════════════════════════════════════════════════════
    public static String getIpAddress(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-FORWARDED-FOR");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getHeader("X-Real-IP");
        }
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr();
        }
        // Nếu có nhiều IP (qua proxy), lấy IP đầu tiên
        if (ipAddress != null && ipAddress.contains(",")) {
            ipAddress = ipAddress.split(",")[0].trim();
        }
        // Chuyển IPv6 localhost sang IPv4
        if ("0:0:0:0:0:0:0:1".equals(ipAddress)) {
            ipAddress = "127.0.0.1";
        }
        return ipAddress;
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  Tạo mã giao dịch ngẫu nhiên (TxnRef) – 8 chữ số
    // ═══════════════════════════════════════════════════════════════════════
    public static String generateTxnRef() {
        Random rnd = new Random();
        int number = 10000000 + rnd.nextInt(90000000); // 8 chữ số
        return String.valueOf(number);
    }
}
