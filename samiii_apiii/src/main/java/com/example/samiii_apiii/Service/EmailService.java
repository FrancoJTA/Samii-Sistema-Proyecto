package com.example.samiii_apiii.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject(subject);

            // HTML content for the email
            String htmlContent = """
                <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #333;">Your OTP Code</h2>
                        <p style="color: #555;">Dear User,</p>
                        <p style="color: #555;">Here is your OTP code for login:</p>
                        <div style="text-align: center; margin: 20px 0;">
                            <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #4CAF50; padding: 10px 20px; background-color: #f2f2f2; border-radius: 5px;">
                                """ + otp + """
                            </span>
                        </div>
                        <p style="color: #555;">Please use this code to complete your login. If you did not request this, please ignore this email.</p>
                        <p style="color: #555;">Thank you,<br>The Samiii Team</p>
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply.</p>
                    </div>
                </body>
                </html>
                """;

            helper.setText(htmlContent, true); // Enable HTML content

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    public void sendWelcomeEmail(String to, String subject, String password) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject(subject);

            // HTML decorado
            String htmlContent = """
                <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f9; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #4CAF50;">Bienvenido a Samiii</h2>
                        <p style="color: #333;">¡Hola!</p>
                        <p style="color: #555;">Gracias por registrarte en nuestra plataforma. Aquí tienes tu contraseña para iniciar sesión:</p>
                        <div style="text-align: center; margin: 20px 0;">
                            <span style="display: inline-block; font-size: 20px; font-weight: bold; color: #ffffff; background-color: #4CAF50; padding: 10px 20px; border-radius: 5px;">
                                """ + password + """
                            </span>
                        </div>
                        <p style="color: #555;">Te recomendamos cambiar tu contraseña una vez que inicies sesión.</p>
                        <p style="color: #555;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
                        <p style="color: #333;">Atentamente,<br>El equipo de Samiii</p>
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        <p style="font-size: 12px; color: #999;">Este es un correo automatizado, por favor no respondas.</p>
                    </div>
                </body>
                </html>
                """;

            helper.setText(htmlContent, true); // Habilitar contenido HTML

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar el correo", e);
        }
    }
}