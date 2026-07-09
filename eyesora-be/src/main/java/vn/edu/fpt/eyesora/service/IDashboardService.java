package vn.edu.fpt.eyesora.service;

import vn.edu.fpt.eyesora.dto.response.*;

import java.io.ByteArrayInputStream;
import java.util.List;

public interface IDashboardService {
    DashboardSummaryResponse getSummaryCounters();
    List<GradeMyopiaResponse> getGradeStats();
//    List<MyopiaTimelineResponse> getMyopiaTimeline();
    List<FacilityMyopiaResponse> getFacilityStats();

    ByteArrayInputStream  exportDashboardReport();
}