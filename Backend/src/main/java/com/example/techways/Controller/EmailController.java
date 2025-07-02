package com.example.techways.Controller;


import com.example.techways.DTO.RequestResponse;
import com.example.techways.Service.email.EmailService;
import com.example.techways.Service.email.EmailServiceIMPL;
import com.example.techways.Service.email.EmailUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/auth/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailServiceIMPL emailServiceIMPL;

    @PostMapping("/send-otp")
    public ResponseEntity<RequestResponse> register(@RequestBody RequestResponse registerRequest) {
        RequestResponse response = emailServiceIMPL.sendOtp(registerRequest.getEmail());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/verify")
    public ResponseEntity<RequestResponse> verifyEmail(@RequestBody RequestResponse request) {
        RequestResponse response = new RequestResponse();
        try {
            response = emailServiceIMPL.verifyOtp(request.getEmail(), request.getOtp());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalStateException e) {
            response.setStatusCode(403);
            response.setMessage(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
        } catch (IllegalArgumentException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal server error");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("/reset-password/send-otp")
    public ResponseEntity<RequestResponse> sendResetOtp(@RequestBody RequestResponse request) {
        RequestResponse response = emailServiceIMPL.sendResetPasswordOtp(request.getEmail());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/reset-password/verify-otp")
    public ResponseEntity<RequestResponse> verifyResetOtp(@RequestBody RequestResponse request) {
        RequestResponse response = emailServiceIMPL.verifyResetPasswordOtp(
                request.getEmail(),
                request.getOtp(),
                request.getNewPassword()
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
