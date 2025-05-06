package com.example.techways.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.techways.Models.Course;
import com.example.techways.Repository.CourseRepository;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public Course addCourse(Course course) {
        return courseRepository.save(course);
    }

    public List<Course> getAllCoursesService() {
        return courseRepository.getAllCoursesRepository();
    }

    public Course fetchUsingName() {
        return courseRepository.fetchUsingName("Java","84");
    }

    public Course fetchUsingCredit(int courseCredits) {
        return courseRepository.fetchUsingCredit(courseCredits);
    }
}
