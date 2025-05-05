package com.example.techways.DTO;

import lombok.Data;

@Data
public class CourseDTO {
    private String courseName;
    private String courseCode;
    private String courseDescription;
    private String courseDuration;
    private String courseCredits;
    private String courseSemester;
    private String courseDepartment;

    private FacultyDTO faculty;
}