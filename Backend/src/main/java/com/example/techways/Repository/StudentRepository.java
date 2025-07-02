package com.example.techways.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.techways.Models.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
    Optional<Student> findByEmail(String email);

    @Query("SELECT s FROM Student s WHERE s.role = 'STUDENT'")
    List<Student> findAllStudentsOnly();


    @Query("SELECT s from Student s WHERE " +
            "LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(s.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Student> searchStudents(String keyword);

}
