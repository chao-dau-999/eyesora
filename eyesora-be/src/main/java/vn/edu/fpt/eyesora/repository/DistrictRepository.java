package vn.edu.fpt.eyesora.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.fpt.eyesora.entity.District;

@Repository
public interface DistrictRepository extends JpaRepository<District, String> {

}