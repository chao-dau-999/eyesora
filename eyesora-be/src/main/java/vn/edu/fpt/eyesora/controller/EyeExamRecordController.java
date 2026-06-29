package vn.edu.fpt.eyesora.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.fpt.eyesora.dto.request.EyeExamRecordRequest;
import vn.edu.fpt.eyesora.dto.response.EyeExamRecordResponse;
import vn.edu.fpt.eyesora.service.IEyeExamRecordService;

import java.util.List;

@RestController
@RequestMapping("/api/eye-exam-records")
@RequiredArgsConstructor
public class EyeExamRecordController {

    private final IEyeExamRecordService eyeExamRecordService;

    @GetMapping
    public ResponseEntity<List<EyeExamRecordResponse>> getExamRecords(
            @RequestParam(required = false) String campaignId,
            @RequestParam(required = false) String classId) {

        List<EyeExamRecordResponse> result = eyeExamRecordService.getExamRecords(campaignId, classId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{examId}")
    public ResponseEntity<EyeExamRecordResponse> getExamRecordDetail(@PathVariable String examId) {
        EyeExamRecordResponse result = eyeExamRecordService.getExamRecordDetail(examId);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<EyeExamRecordResponse> createExamRecord(
            @Valid @RequestBody EyeExamRecordRequest request) {

        EyeExamRecordResponse response = eyeExamRecordService.createExamRecord(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{examId}")
    public ResponseEntity<EyeExamRecordResponse> updateExamRecord(
            @PathVariable String examId,
            @Valid @RequestBody EyeExamRecordRequest request) {

        EyeExamRecordResponse updatedRecord = eyeExamRecordService.updateExamRecord(examId, request);
        return ResponseEntity.ok(updatedRecord);
    }

    @DeleteMapping("/{examId}")
    public ResponseEntity<Void> deleteExamRecord(@PathVariable String examId) {
        eyeExamRecordService.deleteExamRecord(examId);
        return ResponseEntity.noContent().build();
    }
}