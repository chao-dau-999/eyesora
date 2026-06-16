package vn.edu.fpt.eyesora.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.fpt.eyesora.entity.ExamCampaign;
import java.util.List;

@Repository
public interface CampaignRepository extends JpaRepository<ExamCampaign, String> {

    @EntityGraph(attributePaths = {"organization", "targetfacility"})
    List<ExamCampaign> findAll();
}