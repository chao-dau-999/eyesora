package vn.edu.fpt.eyesora.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.fpt.eyesora.dto.response.FacilityGradeMyopiaResponse;
import vn.edu.fpt.eyesora.dto.response.FacilitySelectResponse;
import vn.edu.fpt.eyesora.dto.response.MyopiaTimelineResponse;
import vn.edu.fpt.eyesora.entity.EyeExamRecord;
import vn.edu.fpt.eyesora.repository.EyeExamRecordRepository;
import vn.edu.fpt.eyesora.service.IFacilityDashboardService;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FacilityDashboardServiceImpl implements IFacilityDashboardService {

    private final EyeExamRecordRepository eyeExamRecordRepository;

    @Override
    @Transactional(readOnly = true)
    public List<FacilitySelectResponse> getFacilityList() {
        return eyeExamRecordRepository.findByIsDeletedFalse().stream()
                .filter(e -> e.getClassesField() != null && e.getClassesField().getFacility() != null)
                .map(e -> e.getClassesField().getFacility())
                .distinct()
                .map(f -> new FacilitySelectResponse(String.valueOf(f.getId()), f.getFacilityName()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FacilityGradeMyopiaResponse> getFacilityGradeStats(String facilityId) { // <-- Sửa từ Long sang String
        List<EyeExamRecord> records = eyeExamRecordRepository.findByIsDeletedFalse().stream()
                .filter(e -> e.getClassesField() != null
                        && e.getClassesField().getFacility() != null
                        && String.valueOf(e.getClassesField().getFacility().getId()).equals(facilityId))
                .toList();

        Map<Integer, List<EyeExamRecord>> groupByGrade = records.stream()
                .filter(e -> e.getClassesField().getGrade() != null)
                .collect(Collectors.groupingBy(e -> e.getClassesField().getGrade()));

        List<FacilityGradeMyopiaResponse> gradeStats = new ArrayList<>();
        groupByGrade.forEach((grade, gradeRecords) -> {
            if (grade > 0) {
                long totalInGrade = gradeRecords.size();
                long myopiaInGrade = gradeRecords.stream()
                        .filter(e -> (e.getSphLeft() != null && e.getSphLeft() < 0)
                                || (e.getSphRight() != null && e.getSphRight() < 0))
                        .count();

                double rate = totalInGrade > 0 ? Math.round((myopiaInGrade * 100.0 / totalInGrade) * 10.0) / 10.0 : 0.0;
                gradeStats.add(new FacilityGradeMyopiaResponse("Khối " + grade, rate));
            }
        });

        gradeStats.sort(Comparator.comparing(FacilityGradeMyopiaResponse::gradeName));
        return gradeStats;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MyopiaTimelineResponse> getFacilityTimeline(String facilityId) { // <-- Sửa từ Long sang String
        List<EyeExamRecord> records = eyeExamRecordRepository.findByIsDeletedFalse().stream()
                .filter(e -> e.getClassesField() != null
                        && e.getClassesField().getFacility() != null
                        && String.valueOf(e.getClassesField().getFacility().getId()).equals(facilityId))
                .toList();

        Map<String, List<EyeExamRecord>> groupByYear = records.stream()
                .filter(e -> e.getClassesField().getSchoolYear() != null)
                .collect(Collectors.groupingBy(e -> e.getClassesField().getSchoolYear()));

        List<MyopiaTimelineResponse> timelineStats = new ArrayList<>();
        groupByYear.forEach((schoolYear, yearRecords) -> {
            long totalInYear = yearRecords.size();
            long myopiaInYear = yearRecords.stream()
                    .filter(e -> (e.getSphLeft() != null && e.getSphLeft() < 0)
                            || (e.getSphRight() != null && e.getSphRight() < 0))
                    .count();

            double rate = totalInYear > 0 ? Math.round((myopiaInYear * 100.0 / totalInYear) * 10.0) / 10.0 : 0.0;
            timelineStats.add(new MyopiaTimelineResponse(schoolYear, rate, "ACTUAL"));
        });

        timelineStats.sort(Comparator.comparing(MyopiaTimelineResponse::schoolYear));

        if (timelineStats.size() >= 2) {
            MyopiaTimelineResponse latest = timelineStats.get(timelineStats.size() - 1);
            MyopiaTimelineResponse previous = timelineStats.get(timelineStats.size() - 2);
            double diff = Math.round((latest.rate() - previous.rate()) * 10.0) / 10.0;

            try {
                int startYear = Integer.parseInt(latest.schoolYear().substring(0, 4));
                String nextSchoolYear = (startYear + 1) + "-" + (startYear + 2);
                double predictedRate = Math.round((latest.rate() + diff) * 10.0) / 10.0;
                timelineStats.add(new MyopiaTimelineResponse(nextSchoolYear, Math.max(0, predictedRate), "PREDICTED"));
            } catch (Exception ignored) {}
        }
        return timelineStats;
    }
}