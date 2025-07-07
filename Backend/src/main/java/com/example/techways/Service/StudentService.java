package com.example.techways.Service;

import com.example.techways.DTO.StudentDTO;
import com.example.techways.Models.NewUsers;
import com.example.techways.Models.Student;
import com.example.techways.Repository.StudentRepository;
import com.example.techways.DTO.RequestResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

import org.springframework.security.core.AuthenticationException;

@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;

    public RequestResponse registerStudent(RequestResponse createRequest) {
        RequestResponse response = new RequestResponse();
        try {
            if (studentRepository.findByEmail(createRequest.getEmail()).isPresent()) {
                response.setStatusCode(409);
                response.setMessage("Student already exists");
                return response;
            }
            Student student = new Student();
            student.setName(createRequest.getName());
            student.setEmail(createRequest.getEmail());
            student.setRole(createRequest.getRole());
            student.setActive(true);

            Student savedStudent = studentRepository.save(student);
            response.setStudent(savedStudent);
            response.setStatusCode(201); // Created
            response.setMessage("Student created successfully");

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal Server Error");
            response.setError(e.getMessage());
        }
        return response;
    }

    public RequestResponse updateStudent(Integer userId, Student updateStudent) {
        RequestResponse response = new RequestResponse();
        try {
            Optional<Student> studentOptional = studentRepository.findById(userId);
            if (studentOptional.isPresent()) {
                Student existingStudent = studentOptional.get();
                existingStudent.setStudent_phone(updateStudent.getStudent_phone());
                existingStudent.setGender(updateStudent.getGender());
                existingStudent.setRollNumber(updateStudent.getRollNumber());
                existingStudent.setDepartment(updateStudent.getDepartment());
                existingStudent.setProgram(updateStudent.getProgram());
                existingStudent.setBatch(updateStudent.getBatch());
                existingStudent.setStatus(updateStudent.isStatus());
                existingStudent.setFather_name(updateStudent.getFather_name());
                existingStudent.setMother_name(updateStudent.getMother_name());
                existingStudent.setParent_phone(updateStudent.getParent_phone());
                existingStudent.setAddress(updateStudent.getAddress());
                existingStudent.setReligion(updateStudent.getReligion());
                existingStudent.setNationality(updateStudent.getNationality());
                existingStudent.setUpdatedAt(LocalDateTime.now());
                if (updateStudent.getProfileImageUrl() != null && !updateStudent.getProfileImageUrl().isEmpty()) {
                    existingStudent.setProfileImageUrl(updateStudent.getProfileImageUrl());
                }
                Student savedStudent = studentRepository.save(existingStudent);
                response.setStudent(savedStudent);
                response.setStatusCode(200);
                response.setMessage("Student updated successfully");
            } else {
                response.setStatusCode(404);
                response.setMessage("Student not found");
            }

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal Server Error");
            response.setError(e.getMessage());
        }
        return response;
    }


    public RequestResponse getAllStudents() {
        RequestResponse response = new RequestResponse();
        try {
            List<Student> studentsList = studentRepository.findAllStudentsOnly();
            if (!studentsList.isEmpty()) {
                response.setStudentList(studentsList);
                response.setStatusCode(200);
                response.setMessage("Students fetched successfully");
            } else {
                response.setStatusCode(404);
                response.setMessage("No students found");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal Server Error");
            response.setError(e.getMessage());
        }
        return response;
    }

    // Get student info by email
    public RequestResponse getStudentInfo(String email) {
        RequestResponse response = new RequestResponse();
        try {
            Optional<Student> studentOpt = studentRepository.findByEmail(email);
            if (studentOpt.isPresent()) {
                response.setStudent(studentOpt.get());
                response.setStatusCode(200);
                response.setMessage("Student info fetched");
            } else {
                response.setStatusCode(404);
                response.setMessage("Student not found");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error: " + e.getMessage());
        }
        return response;
    }

    public RequestResponse deleteStudent(Integer userId) {
        RequestResponse response = new RequestResponse();
        try {
            Optional<Student> userOptional = studentRepository.findById(userId);
            if (userOptional.isPresent()) {
                studentRepository.deleteById(userId);
                response.setStatusCode(204); // No Content
                response.setMessage("Student deleted successfully");
            } else {
                response.setStatusCode(404);
                response.setMessage("Student not found");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Internal Server Error");
        }
        return response;
    }

    public List<Student> searchStudents(String keyword) {
        return studentRepository.searchStudents(keyword);
    }

    public RequestResponse getStudentById(Integer id) {
        RequestResponse response = new RequestResponse();
        try {
            Student student = studentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User Not found"));
            response.setStudent(student);
            response.setStatusCode(200);
            response.setMessage("User found");
        } catch (Exception e) {
            response.setStatusCode(404);
            response.setMessage("User not found");
        }
        return response;
    }

}