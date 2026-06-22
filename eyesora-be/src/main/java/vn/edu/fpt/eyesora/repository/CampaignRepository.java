package vn.edu.fpt.eyesora.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.edu.fpt.eyesora.entity.ExamCampaign;

@Repository
public interface CampaignRepository extends JpaRepository<ExamCampaign, String> {

    @EntityGraph(attributePaths = {"organization", "targetfacility"})
    Page<ExamCampaign> findByStatusNot(ExamCampaign.CampaignStatus status, Pageable pageable);

//    @EntityGraph(attributePaths = {"organization", "targetfacility"})
//    Page<ExamCampaign> findByStatus(ExamCampaign.CampaignStatus status, Pageable pageable);
}