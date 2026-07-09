package vn.edu.fpt.eyesora.service;

import vn.edu.fpt.eyesora.dto.response.FacilityGradeMyopiaResponse;
import vn.edu.fpt.eyesora.dto.response.FacilitySelectResponse;
import vn.edu.fpt.eyesora.dto.response.MyopiaTimelineResponse;

import java.util.List;

public interface IFacilityDashboardService {
    List<FacilitySelectResponse> getFacilityList();
    List<FacilityGradeMyopiaResponse> getFacilityGradeStats(String facilityId);
    List<MyopiaTimelineResponse> getFacilityTimeline(String facilityId);
}