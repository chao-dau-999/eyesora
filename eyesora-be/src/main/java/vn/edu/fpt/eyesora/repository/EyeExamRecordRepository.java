package vn.edu.fpt.eyesora.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.fpt.eyesora.entity.EyeExamRecord;

import java.util.List;

@Repository
public interface EyeExamRecordRepository extends JpaRepository<EyeExamRecord, String> {
    Page<EyeExamRecord> findAll(Specification<EyeExamRecord> spec, Pageable pageable);
    List<EyeExamRecord> findByIsDeletedFalse();
}
