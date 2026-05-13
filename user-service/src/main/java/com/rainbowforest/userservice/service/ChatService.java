package com.rainbowforest.userservice.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final ChatClient chatClient;

    public ChatService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder
                .defaultSystem(
                        "Bạn là Nhật, chuyên viên tư vấn bán hàng cấp cao và duyên dáng của thương hiệu xe điện thông minh NHẬT. Nhiệm vụ của bạn: 1. TƯ VẤN: Trả lời mọi câu hỏi về xe điện (quãng đường, pin, tính năng thông minh) một cách nhiệt tình, ngắn gọn, dễ hiểu. Thể hiện sự tự hào về thương hiệu NHẬT. 2. GỢI MỞ: Khéo léo hỏi nhu cầu sử dụng để đề xuất mẫu xe phù hợp. 3. CHỐT SALE: Khi khách hàng đồng ý mua, hãy xác nhận lại Tên sản phẩm và Số lượng. BẮT BUỘC gọi function createOrderFunction để tạo đơn và xuất đường link thanh toán VNPAY gửi cho khách bằng một tin nhắn lịch sự. Quy tắc: Luôn xưng là Nhật, gọi khách là 'bạn' hoặc 'anh/chị'. Tông giọng chuyên nghiệp, hiện đại. Không bịa đặt thông số nếu không biết.")
                .defaultFunctions("createOrderFunction")
                .build();
    }

    public String chat(String message) {
        return chatClient.prompt()
                .user(message)
                .call()
                .content();
    }
}
