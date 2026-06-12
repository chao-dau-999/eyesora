package vn.edu.fpt.eyesora.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false)
    private String password_hash;

    @Column(nullable = false, length = 100)
    private String full_name;

    private Integer facility_id;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_role",
            joinColumns = @JoinColumn(name="user_id"),
            inverseJoinColumns = @JoinColumn(name="role_id")
    )
    private Set<Role> roles;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AccountStatus status = AccountStatus.ACTIVE;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .toList();
    }

    @Override
    public String getPassword() {
        return password_hash;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonLocked() {
        return status != AccountStatus.LOCKED;
    }

    @Override
    public boolean isEnabled() {
        return status == AccountStatus.ACTIVE;
    }

    @PrePersist
    void prePersist() {
        if (status == null) {
            status = AccountStatus.ACTIVE;
        }
    }

    public enum RoleType {
        SUPER_ADMIN,
        DISTRICT_ADMIN,
        FACILITY_ADMIN,
        EXAMINER
    }

    public enum AccountStatus {
        ACTIVE,
        LOCKED
    }
}
