package com.rainbowforest.userservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.mindrot.jbcrypt.BCrypt;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.Date;

import com.rainbowforest.userservice.entity.User;
import com.rainbowforest.userservice.entity.PasswordResetToken;
import com.rainbowforest.userservice.repository.UserRepository;
import com.rainbowforest.userservice.repository.PasswordResetTokenRepository;
import com.rainbowforest.userservice.service.EmailService;
import com.rainbowforest.userservice.security.JwtTokenProvider;
import com.rainbowforest.userservice.entity.UserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import com.rainbowforest.userservice.service.OtpService;
import com.rainbowforest.userservice.repository.UserRoleRepository;
import com.rainbowforest.userservice.entity.UserRole;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private OtpService otpService;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        Map<String, String> response = new HashMap<>();

        if (email == null || email.isEmpty()) {
            response.put("message", "Email là bắt buộc");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        String otpCode = otpService.generateAndSaveOtp(email);
        emailService.sendOtpEmail(email, otpCode);

        response.put("message", "Đã gửi mã OTP qua email");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String otp = payload.get("otp");
        Map<String, Object> response = new HashMap<>();

        if (email == null || otp == null || email.isEmpty() || otp.isEmpty()) {
            response.put("message", "Email và mã OTP là bắt buộc");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        boolean isValid = otpService.verifyAndDeleteOtp(email, otp);
        if (!isValid) {
            response.put("message", "Mã OTP không hợp lệ hoặc đã hết hạn");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        // OTP is valid. Check if user exists.
        User user = userRepository.findByUserDetailsEmail(email);
        if (user == null) {
            user = userRepository.findByUserName(email);
        }

        if (user == null) {
            // Create new user
            user = new User();
            user.setUserName(email);
            // Generate a random strong password
            String randomRawPassword = UUID.randomUUID().toString() + "A1!";
            String hashedPassword = BCrypt.hashpw(randomRawPassword, BCrypt.gensalt());
            user.setUserPassword(hashedPassword);
            user.setActive(1);

            UserDetails userDetails = new UserDetails();
            userDetails.setEmail(email);
            // FirstName and LastName are NOT NULL in the database
            userDetails.setFirstName("User");
            userDetails.setLastName("New");
            user.setUserDetails(userDetails);

            UserRole role = userRoleRepository.findUserRoleByRoleName("USER");
            if (role != null) {
                user.setRole(role);
            }
            userRepository.save(user);
        }

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user);
        String roleName = user.getRole() != null ? user.getRole().getRoleName() : "USER";
        
        response.put("token", token);
        response.put("role", roleName.toUpperCase());
        response.put("username", user.getUserName());
        response.put("message", "Đăng nhập thành công");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> payload) {
        Map<String, Object> response = new HashMap<>();
        
        // 1. Hứng dữ liệu từ Frontend
        String emailOrUsername = payload.get("email");
        if (emailOrUsername == null) emailOrUsername = payload.get("userName");
        if (emailOrUsername == null) emailOrUsername = payload.get("username");

        String password = payload.get("password");
        if (password == null) password = payload.get("userPassword");

        if (emailOrUsername == null || password == null) {
            response.put("message", "Vui lòng nhập đầy đủ email và mật khẩu.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        // 2. Tìm User
        User user = userRepository.findByUserDetailsEmail(emailOrUsername);
        if (user == null) {
            user = userRepository.findByUserName(emailOrUsername);
        }
        
        if (user == null) {
            response.put("message", "Tài khoản không tồn tại trong hệ thống.");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }

        // 3. Kiểm tra mật khẩu
        boolean isPasswordMatch = false;
        try {
            isPasswordMatch = BCrypt.checkpw(password, user.getUserPassword());
        } catch (IllegalArgumentException e) {
            isPasswordMatch = password.equals(user.getUserPassword());
        }

        // 4. Trả kết quả
        if (isPasswordMatch) {
            String token = jwtTokenProvider.generateToken(user);
            String roleName = user.getRole() != null ? user.getRole().getRoleName() : "USER";
            
            response.put("token", token);
            response.put("role", roleName.toUpperCase());
            response.put("username", user.getUserName());
            response.put("message", "Đăng nhập thành công");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Sai mật khẩu. Vui lòng thử lại.");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        Map<String, String> response = new HashMap<>();

        if (email == null || email.isEmpty()) {
            response.put("message", "Email là bắt buộc");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        User user = userRepository.findByUserDetailsEmail(email);
        if (user == null) {
            response.put("message", "Không tìm thấy người dùng với email này");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }

        String tokenStr = UUID.randomUUID().toString();
        // Hết hạn sau 15 phút
        Date expiryDate = new Date(System.currentTimeMillis() + 15 * 60 * 1000);

        PasswordResetToken token = new PasswordResetToken(tokenStr, user, expiryDate);
        tokenRepository.save(token);

        emailService.sendPasswordResetEmail(email, tokenStr);

        response.put("message", "Đã gửi email khôi phục mật khẩu");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> payload) {
        Map<String, String> response = new HashMap<>();
        try {
            // 1. Lấy token từ body
            String tokenStr = payload.get("token");
            
            // 2. Hứng mật khẩu đa năng (phòng hờ Frontend gửi sai tên key)
            String newPassword = payload.get("newPassword");
            if (newPassword == null) newPassword = payload.get("password");
            if (newPassword == null) newPassword = payload.get("userPassword");

            if (tokenStr == null || newPassword == null) {
                response.put("message", "Token và mật khẩu mới là bắt buộc");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            // 3. Kiểm tra tính hợp lệ của Token
            PasswordResetToken resetToken = tokenRepository.findByToken(tokenStr);
            if (resetToken == null) {
                response.put("message", "Token không hợp lệ hoặc không tồn tại");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            if (resetToken.getExpiryDate().before(new Date())) {
                response.put("message", "Token đã hết hạn (quá 15 phút)");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            // 4. Mã hóa và Lưu DB
            User user = resetToken.getUser();
            if (user == null) {
                response.put("message", "Lỗi dữ liệu: Token không gắn với tài khoản nào");
                return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            String hashedPassword = BCrypt.hashpw(newPassword, BCrypt.gensalt());
            user.setUserPassword(hashedPassword); 
            
            // 🚨 NẾU LỖI TRÀN CỘT DB (DATA TOO LONG), NÓ SẼ VĂNG Ở DÒNG NÀY:
            userRepository.save(user);

            // 5. Xóa token cũ cho sạch rác
            tokenRepository.delete(resetToken);

            response.put("message", "Đặt lại mật khẩu thành công");
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            // Bắt trọn ổ lỗi và in đỏ ra Terminal
            System.err.println("❌ LỖI CRASH KHI RESET PASSWORD: " + e.getMessage());
            e.printStackTrace();
            
            response.put("message", "Lỗi Server nội bộ: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // Nếu không có token, Spring Security gán mặc định là anonymousUser
        if (username == null || "anonymousUser".equals(username)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Chưa đăng nhập");
        }
        
        User user = userRepository.findByUserName(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("id", user.getId());
        result.put("userName", user.getUserName());
        if (user.getUserDetails() != null) {
            result.put("firstName", user.getUserDetails().getFirstName());
            result.put("lastName", user.getUserDetails().getLastName());
            result.put("fullName", user.getUserDetails().getFirstName() + " " + user.getUserDetails().getLastName());
            result.put("email", user.getUserDetails().getEmail());
            result.put("phone", user.getUserDetails().getPhoneNumber());
            result.put("address", user.getUserDetails().getStreet());
        }
        return ResponseEntity.ok(result);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> payload) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        if (username == null || "anonymousUser".equals(username)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Chưa đăng nhập");
        }
        
        User user = userRepository.findByUserName(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        if (user.getUserDetails() == null) {
            user.setUserDetails(new UserDetails());
        }

        String fullName = payload.get("fullName");
        if (fullName != null && fullName.contains(" ")) {
            String[] parts = fullName.split(" ", 2);
            user.getUserDetails().setFirstName(parts[0]);
            user.getUserDetails().setLastName(parts[1]);
        } else if (fullName != null) {
            user.getUserDetails().setFirstName(fullName);
            user.getUserDetails().setLastName("");
        }

        if (payload.containsKey("phone")) user.getUserDetails().setPhoneNumber(payload.get("phone"));
        if (payload.containsKey("address")) user.getUserDetails().setStreet(payload.get("address"));
        
        userRepository.save(user);
        return ResponseEntity.ok("Profile updated successfully");
    }
}
