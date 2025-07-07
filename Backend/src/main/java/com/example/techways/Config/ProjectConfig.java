package com.example.techways.Config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class ProjectConfig {

    @Bean
    public Cloudinary getCloudinary(){
        Map map = new HashMap();
//        "cloud_name", "my_cloud_name","api_key", "my_api_key","api_secret", "my_api_secret",
        map.put("cloud_name", "deizvfuha");
        map.put("api_key", "689779865932113");
        map.put("api_secret", "bK1KWBn7q3Fr4Du_vY-jYPwLKt8");
        map.put("secure", true);
        return new Cloudinary(map);
    }
}
