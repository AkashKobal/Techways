package com.example.techways.Controller;

import com.example.techways.Service.CloudinaryImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/cloudinary")
public class CloudinaryImageController {
    @Autowired
    private CloudinaryImageService cloudinaryImageService;

    @PostMapping("/upload")
    public ResponseEntity<Map> uploadImage(@RequestParam("image")MultipartFile file){
        Map imageData = cloudinaryImageService.uploadImage(file);
        return new ResponseEntity<>(imageData, HttpStatus.OK);
    }
}
