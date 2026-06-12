package vn.edu.fpt.eyesora.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Entity
@Data
@Table(name = "refresh_tokens")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    @Column(nullable = false, unique = true)
    private String token;           // UUID random

    @Column(nullable = false)
    private String username;          // username hoặc ID — dùng string để chứa cả User lẫn Artist

    @Column(nullable = false)
    private String source;          // "user" | "artist"


    @Column(name = "expiry_date", nullable = false)
    private Instant expiryDate;

    private boolean revoked = false;
}