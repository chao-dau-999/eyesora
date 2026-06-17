package vn.edu.fpt.eyesora.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import vn.edu.fpt.eyesora.entity.Patient;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, String>, JpaSpecificationExecutor<Patient> {

    @EntityGraph(attributePaths = {"ward"})
    Page<Patient> findAll(Specification<Patient> spec, Pageable pageable);

    @EntityGraph(attributePaths = {"ward"})
    Optional<Patient> findByPatientId(String patientId);

    Integer countByExamCampaign_CampaignIdAndIsDeletedFalse(String campaignId);
}