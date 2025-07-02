package com.example.techways.Service.email;


import com.example.techways.DTO.RequestResponse;

public interface EmailUserService {

    RequestResponse register(RequestResponse registerRequest);
    RequestResponse verifyOtp(String email, String otp);

}