package vn.edu.fpt.eyesora.repository;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.fpt.eyesora.entity.EyeExamRecord;

import java.util.List;

@Repository
public interface EyeExamRecordRepository extends JpaRepository<EyeExamRecord, String> {
    List<EyeExamRecord> findAll(Specification<EyeExamRecord> spec, Sort sort);
}
