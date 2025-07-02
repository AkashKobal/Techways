package com.example.techways.Service.email;


import com.example.techways.DTO.RequestResponse;
import com.example.techways.Models.NewUsers;
import com.example.techways.Repository.EmailRepository;
import com.example.techways.Repository.NewUsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
@Service
@RequiredArgsConstructor
public class EmailServiceIMPL implements EmailUserService {

    private final NewUsersRepository newUsersRepository;
    private final EmailRepository emailRepository;
    private final EmailService emailService;
    @Autowired
    private PasswordEncoder passwordEncoder;


    @Override
    public RequestResponse register(RequestResponse registerRequest) {
        NewUsers existingUser = emailRepository.findByEmail(registerRequest.getEmail());
        if (existingUser != null && existingUser.isVerified()) {
            return RequestResponse.builder()
                    .statusCode(409) // Conflict
                    .message("User already registered")
                    .build();
        }

        NewUsers users = NewUsers.builder()
                .email(registerRequest.getEmail())
                .verified(false)
                .active(true)
                .build();

        String otp = generateOTP();
        users.setOtp(otp);

        newUsersRepository.save(users);
        sendVerificationEmail(users.getEmail(), otp);

        return RequestResponse.builder()
                .email(users.getEmail())
                .statusCode(201)
                .message("OTP sent")
                .build();
    }

    public RequestResponse sendOtp(String email) {
        RequestResponse response = new RequestResponse();
        NewUsers user = emailRepository.findByEmail(email);

        if (user == null) {
            response.setStatusCode(404);
            response.setError("User not found");
        } else if (user.isVerified()) {
            response.setStatusCode(400);
            response.setMessage("User already verified");
            response.setVerified(true);
        } else {
            String otp = generateOTP();
            user.setOtp(otp);
            newUsersRepository.save(user);
            sendVerificationEmail(email, otp);
            response.setStatusCode(200);
            response.setMessage("OTP sent successfully");
        }

        return response;
    }

    @Override
    public RequestResponse verifyOtp(String email, String otp) {
        RequestResponse response = new RequestResponse();
        NewUsers user = emailRepository.findByEmail(email);

        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        if (user.isVerified()) {
            throw new IllegalStateException("User already verified");
        }

        if (!otp.equals(user.getOtp())) {
            throw new IllegalArgumentException("Invalid OTP");
        }

        user.setVerified(true);
        user.setUpdatedAt(LocalDateTime.now());
        user.setOtp(null);
        newUsersRepository.save(user);

        response.setStatusCode(200);
        response.setMessage("Email verified successfully");
        return response;
    }

    public RequestResponse sendResetPasswordOtp(String email) {
        RequestResponse response = new RequestResponse();
        NewUsers user = emailRepository.findByEmail(email);

        if (user == null) {
            response.setStatusCode(404);
            response.setError("User not found");
        } else {
            String otp = generateOTP();
            user.setOtp(otp);
            newUsersRepository.save(user);
            sendVerificationEmail(email, otp);
            response.setStatusCode(200);
            response.setMessage("Reset password OTP sent");
        }
        return response;
    }

    public RequestResponse verifyResetPasswordOtp(String email, String otp, String newPassword) {
        RequestResponse response = new RequestResponse();
        NewUsers user = emailRepository.findByEmail(email);

        if (user == null) {
            response.setStatusCode(404);
            response.setError("User not found");
        } else if (!otp.equals(user.getOtp())) {
            response.setStatusCode(400);
            response.setError("Invalid OTP");
        } else {
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setUpdatedAt(LocalDateTime.now());
            user.setOtp(null);
            newUsersRepository.save(user);
            response.setStatusCode(200);
            response.setMessage("Password updated successfully");
        }

        return response;
    }

    private String generateOTP() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }

    private void sendVerificationEmail(String email, String otp) {
        emailService.sendEmail(email, "Verification OTP", "Your OTP is: " + otp);
    }
}
