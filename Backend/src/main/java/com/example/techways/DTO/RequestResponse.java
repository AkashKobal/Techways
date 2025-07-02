package com.example.techways.DTO;

import java.util.List;

import com.example.techways.Models.NewUsers;
import com.example.techways.Models.Course;
import com.example.techways.Models.Faculty;
import com.example.techways.Models.Student;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RequestResponse {

    private int statusCode;
    private String error;
    private String message;
    private String token;
    private String refreshToken;
    private String expirationTime;

    // Auth / Account fields
    private String name;
    private String email;
    private String password;
    private String newPassword;  // For password reset
    private String otp;
    private boolean verified;
    private String role;

    // ✨ Student specific fields
    private String studentPhone;
    private String gender;
    private String rollNumber;
    private String registerNumber;
    private String uidNumber;
    private String department;
    private String program;
    private String batch;
    private boolean status;

    private String fatherName;
    private String motherName;
    private String parentPhone;
    private String address;
    private String religion;
    private String nationality;
    
    // Entity lists
    private NewUsers users;
    private List<NewUsers> usersList;

    private Faculty faculty;
    private List<Faculty> facultyList;

    private Student student;
    private List<Student> studentList;

    private Course course;
    private List<Course> courseList;
}
