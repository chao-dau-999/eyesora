package vn.edu.fpt.eyesora.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.fpt.eyesora.entity.Ward;

import java.util.List;

public interface WardRepository extends JpaRepository<Ward, String> {
    List<Ward> findByDistrictId(String districtId);
}