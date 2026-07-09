package vn.edu.fpt.eyesora.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.fpt.eyesora.entity.ExamCampaign;
import vn.edu.fpt.eyesora.entity.EyeExamRecord;
import vn.edu.fpt.eyesora.entity.Patient;

import java.util.List;
import java.util.Optional;

@Repository
public interface EyeExamRecordRepository extends JpaRepository<EyeExamRecord, String> {
    Page<EyeExamRecord> findAll(Specification<EyeExamRecord> spec, Pageable pageable);
    List<EyeExamRecord> findByIsDeletedFalse();

    List<EyeExamRecord> findByPatient_PatientId(String patientPatientId);

    Optional<EyeExamRecord> findByPatientAndCampaign(Patient patient, ExamCampaign campaign);
}
