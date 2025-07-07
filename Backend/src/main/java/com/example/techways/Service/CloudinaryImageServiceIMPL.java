package com.example.techways.Service;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryImageServiceIMPL implements CloudinaryImageService {
    @Autowired
    private Cloudinary cloudinary;


    @Override
    public Map uploadImage(MultipartFile file) {
        try {
            Map imageData = this.cloudinary.uploader().upload(file.getBytes(), Map.of());
            return imageData;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image" + e);
        }
    }

}
