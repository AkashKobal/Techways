package com.example.techways.Controller;

import com.example.techways.DTO.RequestResponse;
import com.example.techways.DTO.StudentDTO;
import com.example.techways.Models.NewUsers;
import com.example.techways.Models.Student;
import com.example.techways.Service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    // Register Student
    @PostMapping("/register")
    public ResponseEntity<RequestResponse> registerStudent(@RequestBody RequestResponse requestResponse) {
        return ResponseEntity.ok(studentService.registerStudent(requestResponse));
    }

    // Update Student
    @PutMapping("/update/{userId}")
    public ResponseEntity<RequestResponse> updateStudent(
            @PathVariable("userId") Integer userId,
            @RequestBody Student updatedStudent) {
        return ResponseEntity.ok(studentService.updateStudent(userId, updatedStudent));
    }

    // Get Student All Student Details
    @GetMapping("/get-all")
    public ResponseEntity<RequestResponse> getAllStudents(){
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    // Get My Info (authenticated student)
    @GetMapping("/get-my-info")
    public ResponseEntity<RequestResponse> getMyInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(studentService.getStudentInfo(email));
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<RequestResponse> deleteUSer(@PathVariable Integer userId) {
        return ResponseEntity.ok(studentService.deleteStudent(userId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Student>> searchProducts(@RequestParam String keyword) {
        List<Student> products = studentService.searchStudents(keyword);
        System.out.println("searching with :" + keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/get/{userId}")
    public ResponseEntity<RequestResponse> getUSerByID(@PathVariable Integer userId) {
        return ResponseEntity.ok(studentService.getStudentById(userId));

    }
}