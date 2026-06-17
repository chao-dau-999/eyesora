package vn.edu.fpt.eyesora.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.fpt.eyesora.entity.Ward;

import java.util.List;

public interface WardRepository extends JpaRepository<Ward, String> {
    Page<Ward> findByDistrictId(String districtId, Pageable pageable);
}