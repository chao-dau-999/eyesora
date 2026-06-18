package vn.edu.fpt.eyesora.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.fpt.eyesora.entity.Facility;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, String> {

}
