package vn.edu.fpt.eyesora.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph; // Thêm import này
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.fpt.eyesora.entity.Ward;

@Repository
public interface WardRepository extends JpaRepository<Ward, String> {

    @EntityGraph(attributePaths = {"district"})
    Page<Ward> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"district"})
    Page<Ward> findByDistrictId(String districtId, Pageable pageable);
}