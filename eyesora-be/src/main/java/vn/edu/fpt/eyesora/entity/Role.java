package vn.edu.fpt.eyesora.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "roles")
@NoArgsConstructor
@Getter
@Setter
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "roleid")
    private Long roleId;
    private String name;

    @ManyToMany(mappedBy = "roles")
    private Set<User> users;

    public Role(Long roleId, String name, Set<User> users) {
        this.roleId = roleId;
        this.name = name;
    }
}
