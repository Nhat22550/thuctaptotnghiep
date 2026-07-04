package com.rainbowforest.notificationservice.service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Attachments;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Base64;

@Service
public class EmailService {

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${sendgrid.from.email}")
    private String fromEmail;

    public void sendOrderInvoiceEmail(String toEmail, String customerName, Long orderId, String pdfBase64) throws IOException {
        Email from = new Email(fromEmail);
        String subject = "Xác nhận đơn hàng #" + orderId + " - NHẬT EV";
        if (toEmail == null || !toEmail.contains("@")) {
            toEmail = fromEmail; // Fallback to fromEmail if invalid
        }
        Email to = new Email(toEmail);

        String htmlContent = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;\">"
                + "<h2 style=\"color: #111827;\">Cảm ơn bạn đã mua hàng, " + customerName + "!</h2>"
                + "<p style=\"color: #374151; font-size: 16px;\">Đơn hàng #" + orderId + " của bạn đã được thanh toán thành công.</p>"
                + "<p style=\"color: #374151; font-size: 16px;\">Chúng tôi có đính kèm hóa đơn PDF trong email này. Xin vui lòng kiểm tra.</p>"
                + "<p style=\"color: #6b7280; font-size: 14px; margin-top: 30px;\">Trân trọng,<br>Đội ngũ NHẬT EV</p>"
                + "</div>";

        Content content = new Content("text/html", htmlContent);
        Mail mail = new Mail(from, subject, to, content);

        if (pdfBase64 != null && !pdfBase64.isEmpty()) {
            Attachments attachments = new Attachments();
            attachments.setContent(pdfBase64);
            attachments.setType("application/pdf");
            attachments.setFilename("invoice_" + orderId + ".pdf");
            attachments.setDisposition("attachment");
            mail.addAttachments(attachments);
        }

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();
        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());
        
        Response response = sg.api(request);
        if (response.getStatusCode() >= 400) {
            throw new IOException("SendGrid API Error: " + response.getBody());
        }
    }
}
