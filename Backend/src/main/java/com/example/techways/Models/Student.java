package com.example.techways.Models;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.Data;

@Entity
@Data
@Table(name = "student")
public class Student {
    // name, email, password, phone, gender, rollNumber, department, program, batch,
    // role

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String email;
    private String student_phone ;
    private String gender;
    private String rollNumber;
    private String department;
    private String program;
    private String batch;
    private String profileImageUrl;

    @Column(name = "role")
    private String role;
    private boolean status;
    private String father_name;
    private String mother_name;
    private String parent_phone;
    private String address;
    private String religion;
    private String nationality;

    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
