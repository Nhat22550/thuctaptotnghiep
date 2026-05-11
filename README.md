# Dự án E-commerce Microservices (Example 5.02)

## Mục tiêu dự án
[cite_start]Dự án này nhằm mục đích tạo một ứng dụng thương mại điện tử sử dụng kiến trúc microservices[cite: 446]. [cite_start]Hệ thống được phát triển dựa trên Spring Boot và Spring Cloud, kết hợp với React, Kafka, RabbitMQ, và REST API (REST Web Services)[cite: 446]. [cite_start]Dữ liệu được quản lý thông qua cơ sở dữ liệu MySQL và NoSQL[cite: 447, 453].

## Kiến trúc hệ thống
Hệ thống được thiết kế phân tán với các thành phần và cổng (port) hoạt động độc lập như sau:
* [cite_start]**Client**: Giao diện phía người dùng[cite: 450].
* [cite_start]**Eureka Server**: Máy chủ dùng để khám phá và quản lý các dịch vụ (Service Discovery)[cite: 458, 487].
* [cite_start]**API Gateway (<8900>)**: Cổng giao tiếp chính tiếp nhận mọi yêu cầu từ Client[cite: 449, 451].
* [cite_start]**Product Catalog Service (<8810>)**: Dịch vụ quản lý danh mục sản phẩm, kết nối với Database qua JPA/Hibernate[cite: 461, 462].
* [cite_start]**User Service (<8811>)**: Dịch vụ quản lý thông tin người dùng, kết nối với Database qua JPA/Hibernate[cite: 471, 472, 473].
* [cite_start]**Product Recommendation Service (<8812>)**: Dịch vụ đề xuất sản phẩm, kết nối với Database qua JPA/Hibernate[cite: 466, 467, 468].
* [cite_start]**Order Service (<8813>)**: Dịch vụ xử lý đơn hàng, kết nối với Database qua JPA/Hibernate[cite: 475, 476, 479].
* [cite_start]**NoSQL DB Redis**: Xử lý lưu trữ Spring Session và Giỏ hàng (Shopping Cart)[cite: 452, 453, 454, 455].
* [cite_start]**Giao tiếp nội bộ**: Các dịch vụ giao tiếp với nhau thông qua Feign Client[cite: 456, 464, 469, 474].

## Công cụ và Công nghệ
Dự án sử dụng các nền tảng và thư viện sau:
* [cite_start]**Ngôn ngữ**: Java 11[cite: 481].
* [cite_start]**Framework chính**: Spring Boot, Spring Web[cite: 482, 483].
* [cite_start]**Quản lý cơ sở dữ liệu**: SQL Database engine, NoSQL Database engine, JPA/Hibernate, Spring Data JPA, Spring Data REDIS, Redis Client (JEDIS)[cite: 489, 490, 491, 492, 493, 494].
* [cite_start]**Kiến trúc Cloud/Microservices**: Spring Cloud - Open Feign, Netflix Zuul, Netflix Eureka Client/Server, Netflix Ribbon[cite: 485, 486, 487, 488].
* [cite_start]**Quản lý phiên bản/phiên làm việc**: Spring SESSION[cite: 484].
* [cite_start]**Công cụ Build**: Maven[cite: 495].

## Chức năng hệ thống
Hệ thống được chia làm hai vai trò chính:

**1. Quản trị viên (Administrator)**
* [cite_start]Quản lý người dùng[cite: 502].
* [cite_start]Quản lý sản phẩm[cite: 503].
* [cite_start]Quản lý đặt hàng[cite: 505].
* [cite_start]Quản lý đề xuất[cite: 506].

**2. Người sử dụng (User)**
* [cite_start]Đăng ký tài khoản người dùng[cite: 509].
* [cite_start]Xem danh mục sản phẩm[cite: 515].
* [cite_start]Sử dụng Giỏ hàng (Shopping cart) và thực hiện Đặt hàng[cite: 511].
* [cite_start]Xem các đề xuất sản phẩm[cite: 513].

## Tài liệu tham khảo
* [cite_start]**Mã nguồn tham khảo**: [GitHub - e-commerce-microservices](https://github.com/trannam990099/e-commerce-microservices)[cite: 516].
* [cite_start]**Liên hệ**: trannam@hitu.edu.vn[cite: 500].