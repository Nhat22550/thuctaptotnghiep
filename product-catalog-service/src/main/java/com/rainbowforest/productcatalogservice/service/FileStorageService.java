package com.rainbowforest.productcatalogservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

/**
 * ═══════════════════════════════════════════════════════════════════════
 *  File Storage Service
 *  Lưu file ảnh vào thư mục vật lý trên ổ cứng (ngoài src).
 *  Thư mục mặc định: uploads/banners (ngang hàng với pom.xml)
 * ═══════════════════════════════════════════════════════════════════════
 */
@Service
public class FileStorageService {

    @Value("${upload.path:uploads/banners}")
    private String uploadPath;

    /**
     * Lưu file vào thư mục uploads/banners.
     * Tự động tạo thư mục nếu chưa tồn tại.
     * Đổi tên file bằng cách thêm timestamp để tránh trùng lặp.
     *
     * @param file MultipartFile từ request
     * @return đường dẫn tương đối (VD: /uploads/banners/1713168000000_banner.jpg)
     * @throws IOException nếu lỗi I/O
     */
    public String storeFile(MultipartFile file) throws IOException {
        // 1. Tạo thư mục nếu chưa tồn tại
        Path uploadDir = Paths.get(uploadPath);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
            System.out.println("=== Đã tạo thư mục upload: " + uploadDir.toAbsolutePath());
        }

        // 2. Đổi tên file: timestamp + tên gốc (thay dấu cách bằng _)
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.isBlank()) {
            originalFileName = "unknown.jpg";
        }
        String sanitizedName = originalFileName.replaceAll("\\s+", "_");
        String newFileName = System.currentTimeMillis() + "_" + sanitizedName;

        // 3. Lưu file vào thư mục
        Path targetPath = uploadDir.resolve(newFileName);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        System.out.println("=== File saved: " + targetPath.toAbsolutePath());

        // 4. Trả về đường dẫn tương đối để lưu vào DB
        return "/" + uploadPath + "/" + newFileName;
    }
}
