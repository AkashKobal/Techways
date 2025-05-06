package com.example.techways.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.techways.Models.Course;
import com.example.techways.Service.CourseService;

@RestController
@RequestMapping("/course")
public class CourseController {
    @Autowired
    private CourseService courseService;

    @PostMapping("/add")
    public Course postCourse(@RequestBody Course course) {
        return courseService.addCourse(course);
    }

    @GetMapping("/getAllCourses")
    public List<Course> getAllCoursesController() {
        return courseService.getAllCoursesService();
    }

    @GetMapping("/fetchUsingName")
    public Course fetchUsingNameController() {
        return courseService.fetchUsingName();
    }

    @GetMapping("/fetchUsingCredit/{courseCredits}")
    public Course fetchUsingCreditController(@PathVariable int courseCredits) {
        return courseService.fetchUsingCredit(courseCredits);
    }

}
