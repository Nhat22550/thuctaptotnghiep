package com.rainbowforest.userservice.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final ChatClient chatClient;
    private final com.rainbowforest.userservice.client.ProductClient productClient;

    public ChatService(ChatClient.Builder chatClientBuilder, com.rainbowforest.userservice.client.ProductClient productClient) {
        this.productClient = productClient;
        this.chatClient = chatClientBuilder
                .defaultSystem(
                        "Bạn là Nhật, chuyên viên tư vấn bán hàng cấp cao và duyên dáng của thương hiệu xe điện thông minh NHẬT. Nhiệm vụ của bạn: 1. TƯ VẤN: Trả lời mọi câu hỏi về xe điện một cách nhiệt tình, ngắn gọn, dễ hiểu. Thể hiện sự tự hào về thương hiệu NHẬT. 2. GỢI MỞ: Khéo léo hỏi nhu cầu sử dụng để đề xuất mẫu xe phù hợp. 3. CHỐT SALE: Khi khách hàng đồng ý mua, hãy xác nhận lại Tên sản phẩm và Số lượng. Gọi function createOrderFunction ĐÚNG 1 LẦN DUY NHẤT để tạo đơn. CHÚ Ý QUAN TRỌNG: Sau khi đã gọi function và nhận được đường link VNPAY, TUYỆT ĐỐI KHÔNG GỌI LẠI function đó nữa, mà hãy nhắn đường link đó cho khách luôn. Quy tắc: Luôn xưng là Nhật. Không bịa đặt thông số.")
                .defaultFunctions("createOrderFunction")
                .build();
    }

    public String chat(String message) {
        StringBuilder productContext = new StringBuilder("Dưới đây là danh sách CÁC SẢN PHẨM THỰC TẾ đang có bán (Chỉ tư vấn các sản phẩm trong danh sách này, TUYỆT ĐỐI KHÔNG BỊA RA SẢN PHẨM KHÁC):\n");
        try {
            java.util.List<com.rainbowforest.userservice.dto.ProductDto> products = productClient.getAllProducts();
            for (com.rainbowforest.userservice.dto.ProductDto p : products) {
                productContext.append("- Tên xe: ").append(p.getProductName())
                        .append(", Giá: ").append(p.getPrice()).append(" VNĐ")
                        .append(", Mô tả: ").append(p.getDescription())
                        .append(", Ảnh: http://localhost:8900").append(p.getImageUrl()).append("\n");
            }
            productContext.append("\nKHI BẠN NHẮC ĐẾN MỘT MẪU XE, HÃY LUÔN HIỂN THỊ ẢNH CỦA XE ĐÓ BẰNG CÚ PHÁP MARKDOWN NHƯ SAU: ![Tên Xe](Ảnh)\n");
        } catch (Exception e) {
            productContext.append("(Không thể tải danh sách sản phẩm lúc này)\n");
        }

        return chatClient.prompt()
                .system(productContext.toString())
                .user(message)
                .call()
                .content();
    }
}
