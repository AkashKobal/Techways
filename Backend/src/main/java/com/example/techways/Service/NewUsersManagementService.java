package com.example.techways.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import com.example.techways.Models.Student;
import com.example.techways.Repository.StudentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.techways.DTO.RequestResponse;
import com.example.techways.Models.NewUsers;
import com.example.techways.Repository.NewUsersRepository;

@Service
public class NewUsersManagementService {

    @Autowired
    private NewUsersRepository newUsersRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public RequestResponse registerUser(RequestResponse createRequest) {
        RequestResponse response = new RequestResponse();

        try {
            // 1. Check if user already exists in NewUsers
            if (newUsersRepository.findByEmail(createRequest.getEmail()).isPresent()) {
                response.setStatusCode(409);
                response.setMessage("User already exists in NewUsers table");
                return response;
            }

            // 2. Check role and validate existing entries
            String role = createRequest.getRole();

            if ("STUDENT".equalsIgnoreCase(role)) {
                if (studentRepository.findByEmail(createRequest.getEmail()).isPresent()) {
                    response.setStatusCode(409);
                    response.setMessage("Student already exists");
                    return response;
                }
            }

            // 3. Create user entry in NewUsers table
            NewUsers user = new NewUsers();
            user.setName(createRequest.getName());
            user.setEmail(createRequest.getEmail());
            user.setPassword(passwordEncoder.encode(createRequest.getPassword()));
            user.setRole(role);
            user.setActive(true);

            NewUsers savedUser = newUsersRepository.save(user);

            response.setUsers(savedUser);

            // 4. Save in respective role table
            if ("STUDENT".equalsIgnoreCase(role)) {
                Student student = new Student();
                student.setName(createRequest.getName());
                student.setEmail(createRequest.getEmail());
                student.setRole(role);
                student.setActive(true);
                student.setCreatedAt(LocalDateTime.now());

                Student savedStudent = studentRepository.save(student);
                response.setStudent(savedStudent);
                response.setMessage("Student registered successfully");
            } else if ("ADMIN".equalsIgnoreCase(role)) {
                response.setMessage("Admin user created successfully");
            } else {
                response.setMessage("User with unknown role created");
            }

            response.setStatusCode(201);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal Server Error");
            response.setError(e.getMessage());
        }

        return response;
    }


    public RequestResponse login(RequestResponse loginRequest) {
        RequestResponse response = new RequestResponse();

        try {
            // Step 1: Check if user exists
            Optional<NewUsers> optionalUser = newUsersRepository.findByEmail(loginRequest.getEmail());
            if (optionalUser.isEmpty()) {
                response.setStatusCode(404); // Not Found
                response.setMessage("User not found");
                return response;
            }

            NewUsers user = optionalUser.get();

            // Step 2: Authenticate credentials
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            // Step 4: Generate tokens
            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);

            // Step 5: Return success response
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRefreshToken(refreshToken);
            response.setRole(user.getRole());
            response.setExpirationTime("24Hrs");
            response.setMessage("Successfully Logged In");

        } catch (AuthenticationException e) {
            response.setStatusCode(401); // Unauthorized
            response.setMessage("Invalid email or password");
        } catch (Exception e) {
            response.setStatusCode(500); // Internal Server Error
            response.setMessage("Internal Server Error: " + e.getMessage());
        }

        return response;
    }


    public RequestResponse refreshToken(RequestResponse refreshTokenRequest) {
        RequestResponse response = new RequestResponse();
        try {
            String ourEmail = jwtUtils.extractUsername(refreshTokenRequest.getToken());
            NewUsers users = newUsersRepository.findByEmail(ourEmail).orElseThrow();
            if (jwtUtils.isTokenValid(refreshTokenRequest.getToken(), users)) {
                var jwt = jwtUtils.generateToken(users);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenRequest.getToken());
                response.setExpirationTime("24Hr");
                response.setMessage("Token refreshed");
            } else {
                response.setStatusCode(401); // Unauthorized
                response.setMessage("Invalid refresh token");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal Server Error");
        }
        return response;
    }

    public RequestResponse getAllUsers() {
        RequestResponse response = new RequestResponse();
        try {
            List<NewUsers> result = newUsersRepository.findAll();
            if (!result.isEmpty()) {
                response.setUsersList(result);
                response.setStatusCode(200);
                response.setMessage("Users fetched successfully");
            } else {
                response.setStatusCode(204); // No Content
                response.setMessage("No users found");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal Server Error");
        }
        return response;
    }

    public RequestResponse getUsersById(Integer id) {
        RequestResponse response = new RequestResponse();
        try {
            NewUsers user = newUsersRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User Not found"));
            response.setUsers(user);
            response.setStatusCode(200);
            response.setMessage("User found");
        } catch (Exception e) {
            response.setStatusCode(404);
            response.setMessage("User not found");
        }
        return response;
    }

    public RequestResponse deleteUser(Integer userId) {
        RequestResponse response = new RequestResponse();
        try {
            Optional<NewUsers> userOptional = newUsersRepository.findById(userId);
            if (userOptional.isPresent()) {
                newUsersRepository.deleteById(userId);
                response.setStatusCode(204); // No Content
                response.setMessage("User deleted successfully");
            } else {
                response.setStatusCode(404);
                response.setMessage("User not found");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal Server Error");
        }
        return response;
    }

    public RequestResponse updateUser(Integer userId, NewUsers updatedUser) {
        RequestResponse response = new RequestResponse();
        try {
            Optional<NewUsers> userOptional = newUsersRepository.findById(userId);
            if (userOptional.isPresent()) {
                NewUsers existingUser = userOptional.get();
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setName(updatedUser.getName());
                existingUser.setRole(updatedUser.getRole());
                existingUser.setUpdatedAt(LocalDateTime.now());
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }
                NewUsers savedUser = newUsersRepository.save(existingUser);
                response.setUsers(savedUser);
                response.setStatusCode(200);
                response.setMessage("User updated successfully");
            } else {
                response.setStatusCode(404);
                response.setMessage("User not found");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal Server Error");
        }
        return response;
    }

    public RequestResponse getMyInfo(String email) {
        RequestResponse response = new RequestResponse();
        try {
            Optional<NewUsers> userOptional = newUsersRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                response.setUsers(userOptional.get());
                response.setStatusCode(200);
                response.setMessage("User info fetched");
            } else {
                response.setStatusCode(404);
                response.setMessage("User not found");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal Server Error");
        }
        return response;
    }

    public List<NewUsers> searchUsers(String keyword) {
        return newUsersRepository.searchUsers(keyword);
    }
}
