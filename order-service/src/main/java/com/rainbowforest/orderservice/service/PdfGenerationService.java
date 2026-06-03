package com.rainbowforest.orderservice.service;

import com.rainbowforest.orderservice.domain.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;
import com.itextpdf.text.pdf.BaseFont;

import java.io.ByteArrayOutputStream;
import java.io.File;

@Service
public class PdfGenerationService {

    @Autowired
    private TemplateEngine templateEngine;

    public byte[] generateInvoicePdf(Order order) throws Exception {
        Context context = new Context();
        context.setVariable("order", order);

        String htmlContent = templateEngine.process("invoice-template", context);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ITextRenderer renderer = new ITextRenderer();

        // Add font supporting Vietnamese
        File fontFile = new ClassPathResource("fonts/Roboto-Regular.ttf").getFile();
        renderer.getFontResolver().addFont(fontFile.getAbsolutePath(), BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        
        File boldFontFile = new ClassPathResource("fonts/Roboto-Bold.ttf").getFile();
        renderer.getFontResolver().addFont(boldFontFile.getAbsolutePath(), BaseFont.IDENTITY_H, BaseFont.EMBEDDED);

        renderer.setDocumentFromString(htmlContent);
        renderer.layout();
        renderer.createPDF(outputStream);

        return outputStream.toByteArray();
    }
}
