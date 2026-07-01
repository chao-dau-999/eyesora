package vn.edu.fpt.eyesora.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import vn.edu.fpt.eyesora.dto.request.EyeExamRecordRequest;
import vn.edu.fpt.eyesora.dto.response.ExcelImportResponse;
import vn.edu.fpt.eyesora.dto.response.EyeExamRecordResponse;

public interface IEyeExamRecordService {
    Page<EyeExamRecordResponse> getExamRecords(String keyword, Pageable pageable);
    EyeExamRecordResponse updateExamRecord(String examId, EyeExamRecordRequest request);
    EyeExamRecordResponse createExamRecord(EyeExamRecordRequest request);
    EyeExamRecordResponse getExamRecordDetail(String examId);
    void deleteExamRecord(String examId);
    ExcelImportResponse importExamRecordsFromExcel(MultipartFile file, String campaignId, String examinerId, String facilityId);
}