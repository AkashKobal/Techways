package com.example.techways.Repository;

import com.example.techways.Models.NewUsers;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailRepository extends JpaRepository<NewUsers,Long> {
    NewUsers findByEmail(String email);
}
