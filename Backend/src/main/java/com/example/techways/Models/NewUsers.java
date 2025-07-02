package com.example.techways.Models;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Data
@Table(name = "users")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NewUsers implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String email;
    private String password;
    private String role;



    // account status
    private boolean active;



    // account created
    private LocalDateTime createdAt = LocalDateTime.now();
    // account updated
    private LocalDateTime updatedAt = LocalDateTime.now();

    private String otp;
    private boolean verified;
    @Override
    public String getUsername() {
        return email; // Assuming email is used as the username
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(() -> role); // Assuming role is a single authority
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Default implementation
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Default implementation
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Default implementation
    }

    @Override
    public boolean isEnabled() {
        return true; // Default implementation
    }
}
