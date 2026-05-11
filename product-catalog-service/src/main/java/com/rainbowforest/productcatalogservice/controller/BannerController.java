package com.rainbowforest.productcatalogservice.controller;

import com.rainbowforest.productcatalogservice.entity.Banner;
import com.rainbowforest.productcatalogservice.repository.BannerRepository;
import com.rainbowforest.productcatalogservice.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * ═══════════════════════════════════════════════════════════════════════
 *  Banner Controller — CRUD quản lý Banner cho thương hiệu NHẬT
 *
 *  GET    /banners           → Tất cả banner
 *  GET    /banners/active    → Chỉ banner đang active (cho User frontend)
 *  GET    /banners/{id}      → Chi tiết 1 banner
 *  POST   /banners           → Thêm banner (multipart: file + fields)
 *  PUT    /banners/{id}      → Sửa banner (multipart: file + fields)
 *  DELETE /banners/{id}      → Xóa banner
 * ═══════════════════════════════════════════════════════════════════════
 */
@RestController
public class BannerController {

    @Autowired
    private BannerRepository bannerRepository;

    @Autowired
    private FileStorageService fileStorageService;

    // ─── GET ALL BANNERS (Admin) ──────────────────────────────────────────
    @GetMapping("/banners")
    public ResponseEntity<List<Banner>> getAllBanners() {
        List<Banner> banners = bannerRepository.findAll();
        return ResponseEntity.ok(banners);
    }

    // ─── GET ACTIVE BANNERS (User Frontend) ───────────────────────────────
    @GetMapping("/banners/active")
    public ResponseEntity<List<Banner>> getActiveBanners() {
        List<Banner> banners = bannerRepository.findByActiveTrueOrderByDisplayOrderAsc();
        return ResponseEntity.ok(banners);
    }

    // ─── GET BANNER BY ID ─────────────────────────────────────────────────
    @GetMapping("/banners/{id}")
    public ResponseEntity<Banner> getBannerById(@PathVariable Long id) {
        return bannerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ─── CREATE BANNER (multipart/form-data) ──────────────────────────────
    @PostMapping(value = "/banners", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Banner> createBanner(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "subtitle", required = false) String subtitle,
            @RequestParam(value = "linkUrl", required = false) String linkUrl,
            @RequestParam(value = "displayOrder", required = false, defaultValue = "0") Integer displayOrder,
            @RequestParam(value = "active", required = false, defaultValue = "true") Boolean active
    ) {
        try {
            // Lưu file ảnh
            String imageUrl = fileStorageService.storeFile(file);

            // Tạo Banner entity
            Banner banner = new Banner();
            banner.setTitle(title);
            banner.setSubtitle(subtitle);
            banner.setImageUrl(imageUrl);
            banner.setLinkUrl(linkUrl);
            banner.setDisplayOrder(displayOrder);
            banner.setActive(active);

            Banner saved = bannerRepository.save(banner);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ─── UPDATE BANNER (multipart/form-data) ──────────────────────────────
    @PutMapping(value = "/banners/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Banner> updateBanner(
            @PathVariable Long id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "subtitle", required = false) String subtitle,
            @RequestParam(value = "linkUrl", required = false) String linkUrl,
            @RequestParam(value = "displayOrder", required = false, defaultValue = "0") Integer displayOrder,
            @RequestParam(value = "active", required = false, defaultValue = "true") Boolean active
    ) {
        try {
            Banner existing = bannerRepository.findById(id).orElse(null);
            if (existing == null) {
                return ResponseEntity.notFound().build();
            }

            // Cập nhật fields
            existing.setTitle(title);
            existing.setSubtitle(subtitle);
            existing.setLinkUrl(linkUrl);
            existing.setDisplayOrder(displayOrder);
            existing.setActive(active);

            // Nếu có file mới → lưu file và cập nhật imageUrl
            if (file != null && !file.isEmpty()) {
                String imageUrl = fileStorageService.storeFile(file);
                existing.setImageUrl(imageUrl);
            }

            Banner updated = bannerRepository.save(existing);
            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ─── DELETE BANNER ────────────────────────────────────────────────────
    @DeleteMapping("/banners/{id}")
    public ResponseEntity<Void> deleteBanner(@PathVariable Long id) {
        if (!bannerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bannerRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
