package com.example.techways.Repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.techways.Models.NewUsers;

@Repository
public interface NewUsersRepository extends JpaRepository<NewUsers, Integer> { // <Entity, PRIMARY KEY TYPE>
    Optional<NewUsers> findByEmail(String email);

    @Query("SELECT u from NewUsers u WHERE " +
            "LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")

    List<NewUsers> searchUsers(String keyword);
}
