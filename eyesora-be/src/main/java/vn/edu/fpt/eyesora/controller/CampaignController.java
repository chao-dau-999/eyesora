package vn.edu.fpt.eyesora.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.fpt.eyesora.dto.request.CampaignRequest;
import vn.edu.fpt.eyesora.dto.response.CampaignResponse;
import vn.edu.fpt.eyesora.service.ICampaignService;
import vn.edu.fpt.eyesora.service.IPatientService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
public class CampaignController {
    private final ICampaignService campaignService;
    private final IPatientService patientService;

//    @GetMapping
//    public ResponseEntity<?> getAll() {
//        return ResponseEntity.ok(campaignService.getAllCampaigns());
//    }

    @GetMapping
    public ResponseEntity<List<CampaignResponse>> getAllCampaigns() {
        return ResponseEntity.ok(campaignService.getAllCampaigns());
    }

    @GetMapping("/{campaignId}/patient-count")
    public ResponseEntity<?> getPatientCountForCampaign(@PathVariable String campaignId) {
        return ResponseEntity.ok(Map.of("count", patientService.countPatientsByCampaign(campaignId)));
    }

    @PostMapping
    public ResponseEntity<String> create(@RequestBody CampaignRequest req) {
        campaignService.createCampaign(req);
        return ResponseEntity.ok("Exam campaign created successfully");
    }

    @PatchMapping("/{id}/status/{status}")
    public ResponseEntity<?> updateStatus(
            @PathVariable String id,
            @PathVariable String status) {
        campaignService.setCampaignStatus(id, status);
        return ResponseEntity.ok("Status updated to " + status);
    }
}