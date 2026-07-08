package vn.edu.fpt.eyesora.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.fpt.eyesora.dto.response.FacilityGradeMyopiaResponse;
import vn.edu.fpt.eyesora.dto.response.FacilitySelectResponse;
import vn.edu.fpt.eyesora.dto.response.MyopiaTimelineResponse;
import vn.edu.fpt.eyesora.service.IFacilityDashboardService;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard/facility")
@RequiredArgsConstructor
public class FacilityDashboardController {

    private final IFacilityDashboardService facilityDashboardService;

    @GetMapping("/list")
    public ResponseEntity<List<FacilitySelectResponse>> getFacilityList() {
        return ResponseEntity.ok(facilityDashboardService.getFacilityList());
    }

    @GetMapping("/grade-stats")
    public ResponseEntity<List<FacilityGradeMyopiaResponse>> getFacilityGradeStats(@RequestParam String facilityId) {
        return ResponseEntity.ok(facilityDashboardService.getFacilityGradeStats(facilityId));
    }

    @GetMapping("/timeline")
    public ResponseEntity<List<MyopiaTimelineResponse>> getFacilityTimeline(@RequestParam String facilityId) {
        return ResponseEntity.ok(facilityDashboardService.getFacilityTimeline(facilityId));
    }
}