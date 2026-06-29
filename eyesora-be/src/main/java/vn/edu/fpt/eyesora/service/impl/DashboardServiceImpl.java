package vn.edu.fpt.eyesora.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.fpt.eyesora.dto.response.*;
import vn.edu.fpt.eyesora.entity.EyeExamRecord;
import vn.edu.fpt.eyesora.repository.EyeExamRecordRepository;
import vn.edu.fpt.eyesora.service.IDashboardService;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements IDashboardService {

    private final EyeExamRecordRepository eyeExamRecordRepository;

    private EyeExamRecordResponse mapToResponse(EyeExamRecord entity) {
        return EyeExamRecordResponse.builder()
                .examId(entity.getExamId())
                .examDate(entity.getExamDate())
                .campaignTitle(entity.getCampaign() != null ? entity.getCampaign().getCampaignTitle() : null)
                .patientName(entity.getPatient() != null ? entity.getPatient().getPatientName() : null)
                .className(entity.getClassesField() != null ? entity.getClassesField().getClassName() : null)
                .examinerName(entity.getExaminer() != null ? entity.getExaminer().getFull_name() : null)
                .grade(entity.getClassesField() != null ? entity.getClassesField().getGrade() : 0)
                .schoolYear(entity.getClassesField() != null ? entity.getClassesField().getSchoolYear() : "N/A")
                .sphLeft(entity.getSphLeft())
                .sphRight(entity.getSphRight())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummaryCounters() {
        List<EyeExamRecord> entityList = eyeExamRecordRepository.findByIsDeletedFalse();

        long totalStudents = entityList.size();
        long totalAlertCases = entityList.stream()
                .filter(e -> (e.getSphLeft() != null && e.getSphLeft() <= -6.00) || (e.getSphRight() != null && e.getSphRight() <= -6.00))
                .count();

        long totalMyopia = entityList.stream()
                .filter(e -> (e.getSphLeft() != null && e.getSphLeft() < 0) || (e.getSphRight() != null && e.getSphRight() < 0))
                .count();
        double currentMyopiaRate = totalStudents > 0 ? Math.round((totalMyopia * 100.0 / totalStudents) * 10.0) / 10.0 : 0.0;

        long totalFacilities = entityList.stream()
                .filter(e -> e.getClassesField() != null && e.getClassesField().getFacility() != null)
                .map(e -> e.getClassesField().getFacility().getId())
                .distinct()
                .count();

        Double myopiaRateTrend = null;
        Map<String, List<EyeExamRecord>> groupByYear = entityList.stream()
                .filter(e -> e.getClassesField() != null && e.getClassesField().getSchoolYear() != null)
                .collect(Collectors.groupingBy(e -> e.getClassesField().getSchoolYear()));

        if (groupByYear.size() >= 2) {
            List<String> sortedYears = groupByYear.keySet().stream().sorted().toList();
            String latestYear = sortedYears.get(sortedYears.size() - 1);
            String previousYear = sortedYears.get(sortedYears.size() - 2);

            double latestRate = calculateMyopiaRate(groupByYear.get(latestYear));
            double previousRate = calculateMyopiaRate(groupByYear.get(previousYear));
            myopiaRateTrend = Math.round((latestRate - previousRate) * 10.0) / 10.0;
        }

        return DashboardSummaryResponse.builder()
                .totalExaminedStudents(totalStudents)
                .currentMyopiaRate(currentMyopiaRate)
                .myopiaRateTrend(myopiaRateTrend)
                .totalAlertCases(totalAlertCases)
                .totalParticipatingFacilities(totalFacilities)
                .build();
    }

    private double calculateMyopiaRate(List<EyeExamRecord> records) {
        if (records == null || records.isEmpty()) return 0.0;
        long myopiaCount = records.stream()
                .filter(e -> (e.getSphLeft() != null && e.getSphLeft() < 0) || (e.getSphRight() != null && e.getSphRight() < 0))
                .count();
        return (myopiaCount * 100.0) / records.size();
    }

    @Override
    @Transactional(readOnly = true)
    public List<GradeMyopiaResponse> getGradeStats() {
        List<EyeExamRecordResponse> allRecords = eyeExamRecordRepository.findByIsDeletedFalse().stream()
                .map(this::mapToResponse).toList();

        Map<Integer, List<EyeExamRecordResponse>> groupByGrade = allRecords.stream()
                .collect(Collectors.groupingBy(EyeExamRecordResponse::grade));

        List<GradeMyopiaResponse> gradeStats = new ArrayList<>();
        groupByGrade.forEach((grade, gradeRecords) -> {
            if (grade != null && grade > 0) {
                long totalInGrade = gradeRecords.size();
                long myopiaInGrade = gradeRecords.stream()
                        .filter(r -> (r.sphLeft() != null && r.sphLeft() < 0) || (r.sphRight() != null && r.sphRight() < 0))
                        .count();
                double rate = Math.round((myopiaInGrade * 100.0 / totalInGrade) * 10.0) / 10.0;
                gradeStats.add(new GradeMyopiaResponse("Khối " + grade, rate));
            }
        });
        gradeStats.sort(Comparator.comparing(GradeMyopiaResponse::gradeName));
        return gradeStats;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MyopiaTimelineResponse> getMyopiaTimeline() {
        List<EyeExamRecordResponse> allRecords = eyeExamRecordRepository.findByIsDeletedFalse().stream()
                .map(this::mapToResponse).toList();

        Map<String, List<EyeExamRecordResponse>> groupByYear = allRecords.stream()
                .filter(r -> r.schoolYear() != null && !r.schoolYear().equals("N/A"))
                .collect(Collectors.groupingBy(EyeExamRecordResponse::schoolYear));

        List<MyopiaTimelineResponse> timelineStats = new ArrayList<>();
        groupByYear.forEach((schoolYear, yearRecords) -> {
            long totalInYear = yearRecords.size();
            long myopiaInYear = yearRecords.stream()
                    .filter(r -> (r.sphLeft() != null && r.sphLeft() < 0) || (r.sphRight() != null && r.sphRight() < 0))
                    .count();
            double rate = Math.round((myopiaInYear * 100.0 / totalInYear) * 10.0) / 10.0;
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