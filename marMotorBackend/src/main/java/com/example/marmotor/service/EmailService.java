package com.example.marmotor.service;

import sendinblue.ApiClient;
import sendinblue.Configuration;
import sendinblue.auth.ApiKeyAuth;
import sibApi.TransactionalEmailsApi;
import sibModel.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
public class EmailService {

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Async
    public void sendPasswordResetEmail(String toEmail, String token) {
        // 1. Configuración de la API de Brevo
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        ApiKeyAuth apiKey = (ApiKeyAuth) defaultClient.getAuthentication("api-key");
        apiKey.setApiKey(brevoApiKey);

        TransactionalEmailsApi apiInstance = new TransactionalEmailsApi();

        // 2. Configurar Remitente y Destinatario
        SendSmtpEmailSender sender = new SendSmtpEmailSender();
        sender.setEmail("marmotor26.support@gmail.com");
        sender.setName("MarMotor Support");

        SendSmtpEmailTo to = new SendSmtpEmailTo();
        to.setEmail(toEmail);

        SendSmtpEmailBcc bcc = new SendSmtpEmailBcc();
        bcc.setEmail("marmotor26.support@gmail.com"); // Te lo mandas a ti mismo en oculto
        // ------------------------------------------------


        // 3. Crear el enlace dinámico
        String resetLink = "https://marmotor.vercel.app/auth/reset-password?token=" + token;

        // 4. Tu diseño HTML personalizado
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

        // 5. Montar el correo final
        SendSmtpEmail sendSmtpEmail = new SendSmtpEmail();
        sendSmtpEmail.setSender(sender);
        sendSmtpEmail.setTo(Collections.singletonList(to));
        sendSmtpEmail.setSubject("Recuperación de contraseña - MarMotor");
        sendSmtpEmail.setHtmlContent(htmlContent);
        sendSmtpEmail.setBcc(Collections.singletonList(bcc));

        // 6. Enviar
        try {
            apiInstance.sendTransacEmail(sendSmtpEmail);
            System.out.println("✅ DEBUG: Email enviado con éxito vía Brevo API");
        } catch (sendinblue.ApiException e) {
            // ESTO ES EL CHIVATO: Nos dirá el código exacto y el motivo del rechazo
            System.err.println("❌ ERROR DE BREVO (CÓDIGO HTTP): " + e.getCode());
            System.err.println("❌ ERROR DE BREVO (RESPUESTA): " + e.getResponseBody());
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("❌ ERROR GENERAL DE JAVA: " + e.getMessage());
            e.printStackTrace();
        }
    }
}