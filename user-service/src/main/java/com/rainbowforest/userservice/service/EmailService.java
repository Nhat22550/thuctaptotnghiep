package com.rainbowforest.userservice.service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EmailService {

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${sendgrid.from.email}")
    private String fromEmail;

    public void sendPasswordResetEmail(String toEmail, String token) {
        Email from = new Email(fromEmail);
        String subject = "Password Reset Request - NHẬT EV";
        Email to = new Email(toEmail);
        
        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        
        String htmlContent = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;\">"
                + "<h2 style=\"color: #111827; text-align: center;\">Khôi phục mật khẩu của bạn</h2>"
                + "<p style=\"color: #374151; font-size: 16px;\">Chào bạn,</p>"
                + "<p style=\"color: #374151; font-size: 16px;\">Chúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản của bạn tại NHẬT EV. Vui lòng click vào nút bên dưới để đặt lại mật khẩu. Link này sẽ hết hạn sau 15 phút.</p>"
                + "<div style=\"text-align: center; margin: 30px 0;\">"
                + "<a href=\"" + resetLink + "\" style=\"background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;\">Đặt Lại Mật Khẩu</a>"
                + "</div>"
                + "<p style=\"color: #6b7280; font-size: 14px;\">Nếu bạn không yêu cầu điều này, xin vui lòng bỏ qua email này.</p>"
                + "</div>";
                
        Content content = new Content("text/html", htmlContent);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            System.out.println(response.getStatusCode());
            System.out.println(response.getBody());
            System.out.println(response.getHeaders());
        } catch (IOException ex) {
            System.err.println("Failed to send email: " + ex.getMessage());
        }
    }

    public void sendOtpEmail(String toEmail, String otp) {
        Email from = new Email(fromEmail);
        String subject = "Mã OTP Đăng Nhập - NHẬT EV";
        Email to = new Email(toEmail);
        
        String htmlContent = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;\">"
                + "<h2 style=\"color: #111827; text-align: center;\">Mã OTP Đăng Nhập</h2>"
                + "<p style=\"color: #374151; font-size: 16px;\">Chào bạn,</p>"
                + "<p style=\"color: #374151; font-size: 16px;\">Mã OTP đăng nhập của bạn là: <strong style=\"font-size: 24px; color: #10b981;\">" + otp + "</strong></p>"
                + "<p style=\"color: #374151; font-size: 16px;\">Mã có hiệu lực trong 3 phút.</p>"
                + "<p style=\"color: #6b7280; font-size: 14px; margin-top: 30px;\">Nếu bạn không yêu cầu mã này, xin vui lòng bỏ qua email.</p>"
                + "</div>";
                
        Content content = new Content("text/html", htmlContent);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            System.out.println(response.getStatusCode());
        } catch (IOException ex) {
            System.err.println("Failed to send OTP email: " + ex.getMessage());
        }
    }
}
