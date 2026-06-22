package vn.edu.fpt.eyesora.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.fpt.eyesora.entity.Classes;

@Repository
public interface ClassesRepository extends JpaRepository<Classes, String> {
}
