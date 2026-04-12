package com.example.marmotor.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {
    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadFile(MultipartFile file) throws IOException {
        // Subimos el archivo a Cloudinary en la carpeta "marmotor_coches"
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("folder", "marmotor_coches"));

        // Devolvemos la URL segura (https) que nos genera Cloudinary
        return uploadResult.get("secure_url").toString();
    }

    public void deleteFile(String url) throws IOException {
        // Extraer el public_id de la URL (ej: de http://res.cloudinary.com/.../v1/abcde.jpg extrae abcde)
        String publicId = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}
