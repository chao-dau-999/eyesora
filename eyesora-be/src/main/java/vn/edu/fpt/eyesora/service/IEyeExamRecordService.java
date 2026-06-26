package vn.edu.fpt.eyesora.service;

import vn.edu.fpt.eyesora.dto.request.EyeExamRecordRequest;
import vn.edu.fpt.eyesora.dto.response.EyeExamRecordResponse;
import java.util.List;

public interface IEyeExamRecordService {
    List<EyeExamRecordResponse> getExamRecords(String campaignId, String classId);
    EyeExamRecordResponse updateExamRecord(String examId, EyeExamRecordRequest request);
    EyeExamRecordResponse createExamRecord(EyeExamRecordRequest request);
    EyeExamRecordResponse getExamRecordDetail(String examId);
}