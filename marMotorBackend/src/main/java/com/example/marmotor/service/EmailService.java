package com.example.marmotor.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        try {

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // CUIDADO: Pon tu correo de la Fase 1 aquí
            helper.setFrom("${spring.mail.username}");
            helper.setTo(toEmail);
            helper.setSubject("🔑 Restablece tu contraseña - MarMotor");

            // Diseñamos el correo en HTML con estilos en línea (Inline CSS)
            String htmlContent = "<div style=\"font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #081225; padding: 40px 20px; color: #ffffff; text-align: center;\">"
                    + "<div style=\"max-width: 600px; margin: 0 auto; background-color: #13274a; border-radius: 16px; padding: 40px; border: 1px solid #37df8c;\">"
                    + "<h1 style=\"color: #ffffff; margin-bottom: 20px;\">MarMotor</h1>"
                    + "<h2 style=\"color: #37df8c; font-size: 22px; margin-bottom: 20px;\">Solicitud de cambio de contraseña</h2>"
                    + "<p style=\"font-size: 16px; line-height: 1.5; margin-bottom: 30px; color: #a0aec0;\">"
                    + "Hola,<br><br>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. "
                    + "Haz clic en el siguiente botón para crear una nueva. Este enlace caducará en 15 minutos."
                    + "</p>"
                    + "<a href=\"" + resetLink + "\" style=\"display: inline-block; background-color: #37df8c; color: #000000; text-decoration: none; font-size: 16px; font-weight: bold; padding: 15px 30px; border-radius: 30px; margin-bottom: 30px;\">Restablecer mi contraseña</a>"
                    + "<p style=\"font-size: 14px; color: #a0aec0; margin-bottom: 10px;\">Si no has solicitado este cambio, puedes ignorar este correo.</p>"
                    + "<p style=\"font-size: 12px; color: #718096; margin-top: 40px;\">&copy; 2026 MarMotor. Todos los derechos reservados.</p>"
                    + "</div>"
                    + "</div>";

            // El "true" le indica a Spring Boot que el texto es HTML
            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            System.err.println("Error al enviar el correo HTML: " + e.getMessage());
        }
    }
}