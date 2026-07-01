package vn.edu.fpt.eyesora.service.impl;

import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vn.edu.fpt.eyesora.dto.request.EyeExamRecordRequest;
import vn.edu.fpt.eyesora.dto.response.ExcelImportResponse;
import vn.edu.fpt.eyesora.dto.response.EyeExamRecordResponse;
import vn.edu.fpt.eyesora.dto.response.RowError;
import vn.edu.fpt.eyesora.entity.*;
import vn.edu.fpt.eyesora.exceptions.ResourceNotFoundException;
import vn.edu.fpt.eyesora.repository.*;
import vn.edu.fpt.eyesora.service.IEyeExamRecordService;

import java.io.InputStream;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.*;

@Service
@RequiredArgsConstructor
public class EyeExamRecordServiceImpl implements IEyeExamRecordService {

    private static final DateTimeFormatter DATE_FORMATTER = new DateTimeFormatterBuilder()
            .appendPattern("dd/MM/yyyy")
            .toFormatter();
    ;
    private final EyeExamRecordRepository eyeExamRecordRepository;
    private final CampaignRepository campaignRepository;
    private final ClassesRepository classesRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final FacilityRepository facilityRepository;

    @Override
    @Transactional
    public Page<EyeExamRecordResponse> getExamRecords(String keyword, Pageable pageable) {

        Specification<EyeExamRecord> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.equal(root.get("isDeleted"), false));

            if (keyword != null && !keyword.isBlank()) {
                String likePattern = "%" + keyword.trim().toLowerCase() + "%";

                Predicate searchPatient = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("patient").get("patientName")), likePattern);

                Predicate searchClass = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("classesField").get("className")), likePattern);

                Predicate searchCampaign = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("campaign").get("campaignTitle")), likePattern);

                Predicate globalSearchPredicate = criteriaBuilder.or(searchPatient, searchClass, searchCampaign);

                predicates.add(globalSearchPredicate);
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<EyeExamRecord> recordsPage = eyeExamRecordRepository.findAll(spec, pageable);
        return recordsPage.map(this::mapToResponse);
    }

    @Override
    @Transactional
    public EyeExamRecordResponse updateExamRecord(String examId, EyeExamRecordRequest request) {
        EyeExamRecord entity = eyeExamRecordRepository.findById(examId)
                .filter(record -> !Boolean.TRUE.equals(record.getIsDeleted()))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu kiểm tra thị lực, ID: " + examId));

        if (request.getClassId() != null && !request.getClassId().isBlank()) {
            if (entity.getClassesField() == null || !entity.getClassesField().getId().equals(request.getClassId())) {
                Classes newClasses = classesRepository.findById(request.getClassId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học mới nào có ID: " + request.getClassId()));
                entity.setClassesField(newClasses);
            }
        }

        entity.setVaLeftWithoutGlasses(request.getVaLeftWithoutGlasses());
        entity.setVaLeftWithGlasses(request.getVaLeftWithGlasses());
        entity.setSphLeft(request.getSphLeft() != null ? request.getSphLeft() : 0f);
        entity.setCylLeft(request.getCylLeft() != null ? request.getCylLeft() : 0f);
        entity.setAxisLeft(request.getAxisLeft());

        entity.setVaRightWithoutGlasses(request.getVaRightWithoutGlasses());
        entity.setVaRightWithGlasses(request.getVaRightWithGlasses());
        entity.setSphRight(request.getSphRight() != null ? request.getSphRight() : 0f);
        entity.setCylRight(request.getCylRight() != null ? request.getCylRight() : 0f);
        entity.setAxisRight(request.getAxisRight());

        EyeExamRecord updatedEntity = eyeExamRecordRepository.save(entity);
        return mapToResponse(updatedEntity);
    }

    @Override
    @Transactional
    public EyeExamRecordResponse createExamRecord(EyeExamRecordRequest request) {
        EyeExamRecord entity = new EyeExamRecord();

        if (request.getCampaignId() != null && !request.getCampaignId().isBlank()) {
            entity.setCampaign(campaignRepository.getReferenceById(request.getCampaignId()));
        }

        if (request.getPatientId() != null && !request.getPatientId().isBlank()) {
            entity.setPatient(patientRepository.getReferenceById(request.getPatientId()));
        }

        if (request.getClassId() != null && !request.getClassId().isBlank()) {
            entity.setClassesField(classesRepository.getReferenceById(request.getClassId()));
        }

        if (request.getExaminerId() != null && !request.getExaminerId().isBlank()) {
            entity.setExaminer(userRepository.getReferenceById(request.getExaminerId()));
        }

        entity.setIsDeleted(false);

        entity.setVaLeftWithoutGlasses(request.getVaLeftWithoutGlasses());
        entity.setVaLeftWithGlasses(request.getVaLeftWithGlasses());
        entity.setSphLeft(request.getSphLeft() != null ? request.getSphLeft() : 0f);
        entity.setCylLeft(request.getCylLeft() != null ? request.getCylLeft() : 0f);
        entity.setAxisLeft(request.getAxisLeft());

        entity.setVaRightWithoutGlasses(request.getVaRightWithoutGlasses());
        entity.setVaRightWithGlasses(request.getVaRightWithGlasses());
        entity.setSphRight(request.getSphRight() != null ? request.getSphRight() : 0f);
        entity.setCylRight(request.getCylRight() != null ? request.getCylRight() : 0f);
        entity.setAxisRight(request.getAxisRight());

        EyeExamRecord savedEntity = eyeExamRecordRepository.save(entity);
        return mapToResponse(savedEntity);
    }

    @Override
    @Transactional
    public EyeExamRecordResponse getExamRecordDetail(String examId) {
        EyeExamRecord eyeExamRecord = eyeExamRecordRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hồ sơ khám mắt"));
        return mapToResponse(eyeExamRecord);
    }

    @Override
    @Transactional
    public void deleteExamRecord(String examId) {
        EyeExamRecord entity = eyeExamRecordRepository.findById(examId)
                .filter(record -> !Boolean.TRUE.equals(record.getIsDeleted()))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hoặc đã bị xóa hồ sơ khám mắt với ID: " + examId));

        entity.setIsDeleted(true);
        eyeExamRecordRepository.save(entity);
    }

    @Override
    @Transactional
    public ExcelImportResponse importExamRecordsFromExcel(MultipartFile file, String campaignId, String examinerId, String facilityId) {
        List<RowError> errorList = new ArrayList<>();
        List<EyeExamRecord> recordsToSave = new ArrayList<>();
        int totalRows = 0;

        // 1. Kiểm tra và lấy Facility
        if (facilityId == null || facilityId.isBlank()) {
            throw new IllegalArgumentException("Mã cơ sở (Facility ID) không được để trống.");
        }
        Facility facility = facilityRepository.findById(facilityId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy cơ sở/trường học với ID: " + facilityId));

        // 2. Khởi tạo campagin & examiner
        ExamCampaign campaign = campaignId != null ? campaignRepository.findById(campaignId).orElse(null) : null;
        User examiner = examinerId != null ? userRepository.findById(examinerId).orElse(null) : null;

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            totalRows = Math.max(sheet.getPhysicalNumberOfRows() - 1, 0);

            Map<String, Classes> classCache = new HashMap<>();
            Map<String, Patient> patientCache = new HashMap<>();

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null || isRowEmpty(row)) continue;

                List<String> localErrors = new ArrayList<>();

                EyeExamRecord record = parseRowToEntitySafe(row, campaign, examiner, facility, classCache, patientCache, localErrors);

                if (!localErrors.isEmpty()) {
                    errorList.add(new RowError(i + 1, String.join(", ", localErrors)));
                } else if (record != null) {
                    recordsToSave.add(record);
                }
            }

            // Thực hiện Batch Insert an toàn
            if (!recordsToSave.isEmpty()) {
                eyeExamRecordRepository.saveAll(recordsToSave);
            }

        } catch (Exception e) {
            throw new RuntimeException("Lỗi hệ thống khi xử lý file Excel: " + e.getMessage());
        }

        return new ExcelImportResponse(
                totalRows,
                recordsToSave.size(),
                errorList.size(),
                errorList
        );
    }

    private EyeExamRecord parseRowToEntitySafe(Row row, ExamCampaign campaign, User examiner, Facility facility,
                                               Map<String, Classes> classCache,
                                               Map<String, Patient> patientCache,
                                               List<String> localErrors) {

        // 1. XỬ LÝ LỚP HỌC THEO CƠ SỞ (Cột 4)
        String className = getCellValueAsString(row.getCell(4));
        if (className.isEmpty()) {
            localErrors.add("Tên lớp (Class Name) không được để trống");
            return null;
        }

        Classes clazz = classCache.get(className);
        if (clazz == null) {
            clazz = classesRepository.findByClassNameAndFacility(className, facility).orElse(null);

            if (clazz == null) {
                Classes newClass = new Classes();
                newClass.setClassName(className);
                newClass.setFacility(facility);

                try {
                    // Lấy tất cả các chữ số đầu tiên của tên lớp (Ví dụ: "10A1" -> "10", "6B" -> "6")
                    String gradeNumbers = className.replaceAll("^(\\d+).*$", "$1");
                    newClass.setGrade(Integer.parseInt(gradeNumbers));
                } catch (Exception e) {
                    newClass.setGrade(99); // Đặt một giá trị mặc định tạm thời để không bị lỗi NOT NULL
                }
                newClass.updateSchoolYear();

                clazz = classesRepository.save(newClass);
            }
            classCache.put(className, clazz);
        }

        // 2. XỬ LÝ THÔNG TIN BỆNH NHÂN (Cột 0, 1, 2, 3)
        String patientId = getCellValueAsString(row.getCell(0));
        String patientName = getCellValueAsString(row.getCell(1));
        String dobStr = getCellValueAsString(row.getCell(2));
        String genderStr = getCellValueAsString(row.getCell(3));

        if (patientId.isEmpty()) {
            localErrors.add("Mã bệnh nhân (Patient ID) không được để trống");
            return null;
        }

        Patient patient = patientCache.get(patientId);
        if (patient == null) {
            patient = patientRepository.findById(patientId).orElse(null);
            if (patient == null) {
                if (patientName.isEmpty()) {
                    localErrors.add("Bệnh nhân mới yêu cầu bắt buộc nhập Tên (Patient Name)");
                    return null;
                }
                Patient newPatient = new Patient();
                newPatient.setPatientName(patientName);
                newPatient.setClasses(clazz); // Gắn học sinh vào lớp vừa tìm/tạo ở trên

                // Parse Ngày sinh an toàn
                if (dobStr.trim().isEmpty()) {
                    localErrors.add("Bệnh nhân mới yêu cầu bắt buộc nhập Ngày sinh (DOB)");
                    return null;
                }
                try {
                    if (row.getCell(2).getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(row.getCell(2))) {
                        newPatient.setDob(row.getCell(2).getDateCellValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
                    } else {
                        newPatient.setDob(LocalDate.parse(dobStr, DATE_FORMATTER));
                    }
                } catch (Exception e) {
                    localErrors.add("Định dạng Ngày sinh (DOB) lỗi. Chuẩn: dd/MM/yyyy");
                    return null;
                }

                if (genderStr.trim().isEmpty()) {
                    localErrors.add("Bệnh nhân mới yêu cầu bắt buộc nhập giới tính)");
                    return null;
                }
                try {
                    newPatient.setGender(genderStr.equalsIgnoreCase("nam") ? Patient.Gender.MALE :
                            genderStr.equalsIgnoreCase("nữ") ? Patient.Gender.FEMALE : Patient.Gender.OTHER);
                } catch (Exception e) {
                    localErrors.add("Giới tính của bệnh nhân required");
                    return null;
                }
                patient = patientRepository.save(newPatient);
            }
            patientCache.put(patientId, patient);
        }

        // 3. KHỞI TẠO RECORD & NGÀY KHÁM (Cột 5)
        EyeExamRecord record = new EyeExamRecord();
        record.setCampaign(campaign);
        record.setExaminer(examiner);
        record.setClassesField(clazz);
        record.setPatient(patient);
        record.setIsDeleted(false);

        DataFormatter dataFormatter = new DataFormatter();
        Cell examDateCell = row.getCell(5);
        if (examDateCell != null && examDateCell.getCellType() != CellType.BLANK) {
            try {
                if (examDateCell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(examDateCell)) {
                    record.setExamDate(examDateCell.getDateCellValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
                } else {
                    // Dùng dataFormatter cứu cánh cho trường hợp cột 5 bị sai định dạng ô
                    String examDateStrClean = dataFormatter.formatCellValue(examDateCell).trim();
                    record.setExamDate(LocalDate.parse(examDateStrClean, DATE_FORMATTER));
                }
            } catch (Exception e) {
                localErrors.add("Định dạng Ngày khám không hợp lệ. Chuẩn: dd/MM/yyyy");
                return null;
            }
        }

        // 4. ĐỌC THÔNG SỐ THỊ LỰC & KHÚC XẠ (Cột 6 - 15)
        try {
            Float vaLeftWO = getCellValueAsFloat(row.getCell(6), "VA không kính (Trái) bắt buộc");
            Float vaRightWO = getCellValueAsFloat(row.getCell(11), "VA không kính (Phải) bắt buộc");

            if (vaLeftWO == null || vaRightWO == null) {
                localErrors.add("Thiếu thông số thị lực không kính bắt buộc");
                return null;
            }

            // Mắt Trái
            record.setVaLeftWithoutGlasses(vaLeftWO);
            record.setVaLeftWithGlasses(getCellValueAsFloat(row.getCell(7), null));
            float sphLeft = Optional.ofNullable(getCellValueAsFloat(row.getCell(8), null)).orElse(0f);
            float cylLeft = Optional.ofNullable(getCellValueAsFloat(row.getCell(9), null)).orElse(0f);
            record.setSphLeft(sphLeft);
            record.setCylLeft(cylLeft);
            record.setAxisLeft(getCellValueAsInteger(row.getCell(10)));

            // Mắt Phải
            record.setVaRightWithoutGlasses(vaRightWO);
            record.setVaRightWithGlasses(getCellValueAsFloat(row.getCell(12), null));
            float sphRight = Optional.ofNullable(getCellValueAsFloat(row.getCell(13), null)).orElse(0f);
            float cylRight = Optional.ofNullable(getCellValueAsFloat(row.getCell(14), null)).orElse(0f);
            record.setSphRight(sphRight);
            record.setCylRight(cylRight);
            record.setAxisRight(getCellValueAsInteger(row.getCell(15)));

            boolean hasError = (sphLeft != 0 || cylLeft != 0 || sphRight != 0 || cylRight != 0);
//            record.setHasRefractiveError(hasError);
//            record.setDiagnosis(generateDynamicDiagnosis(sphLeft, cylLeft, sphRight, cylRight));

        } catch (Exception e) {
            localErrors.add("Lỗi định dạng số tại các cột thông số mắt: " + e.getMessage());
            return null;
        }

        return record;
    }


    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        if (cell.getCellType() == CellType.NUMERIC) {
            return String.format("%.0f", cell.getNumericCellValue()); // Tránh bị biến thành số mũ e+
        }
        return cell.getStringCellValue().trim();
    }

    private Float getCellValueAsFloat(Cell cell, String requiredErrorMessage) {
        if (cell == null || cell.getCellType() == CellType.BLANK) {
            if (requiredErrorMessage != null) throw new IllegalArgumentException(requiredErrorMessage);
            return null;
        }
        try {
            return (float) cell.getNumericCellValue();
        } catch (Exception e) {
            throw new IllegalArgumentException("Định dạng số không hợp lệ tại ô " + cell.getAddress());
        }
    }

    private Integer getCellValueAsInteger(Cell cell) {
        if (cell == null || cell.getCellType() == CellType.BLANK) return null;
        try {
            return (int) cell.getNumericCellValue();
        } catch (Exception e) {
            throw new IllegalArgumentException("Định dạng số nguyên không hợp lệ tại ô " + cell.getAddress());
        }
    }

    private boolean isRowEmpty(Row row) {
        for (int c = row.getFirstCellNum(); c < row.getLastCellNum(); c++) {
            Cell cell = row.getCell(c);
            if (cell != null && cell.getCellType() != CellType.BLANK) return false;
        }
        return true;
    }

    private String generateDynamicDiagnosis(float sphL, float cylL, float sphR, float cylR) {
        if (sphL == 0 && cylL == 0 && sphR == 0 && cylR == 0) return "Mắt bình thường";
        StringBuilder sb = new StringBuilder();
        if (sphL < 0 || cylL < 0) sb.append("Mắt trái có dấu hiệu cận/loạn thị. ");
        if (sphR < 0 || cylR < 0) sb.append("Mắt phải có dấu hiệu cận/loạn thị. ");
        return sb.toString().trim();
    }

    private EyeExamRecordResponse mapToResponse(EyeExamRecord entity) {
        return EyeExamRecordResponse.builder()
                .examId(entity.getExamId())
                .examDate(entity.getExamDate())
                .campaignTitle(entity.getCampaign() != null ? entity.getCampaign().getCampaignTitle() : null)
                .patientName(entity.getPatient() != null ? entity.getPatient().getPatientName() : null)
                .className(entity.getClassesField() != null ? entity.getClassesField().getClassName() : null)
                .examinerName(entity.getExaminer() != null ? entity.getExaminer().getFull_name() : null)

                .vaLeftWithoutGlasses(entity.getVaLeftWithoutGlasses())
                .vaLeftWithGlasses(entity.getVaLeftWithGlasses())
                .sphLeft(entity.getSphLeft())
                .cylLeft(entity.getCylLeft())
                .axisLeft(entity.getAxisLeft())

                .vaRightWithoutGlasses(entity.getVaRightWithoutGlasses())
                .vaRightWithGlasses(entity.getVaRightWithGlasses())
                .sphRight(entity.getSphRight())
                .cylRight(entity.getCylRight())
                .axisRight(entity.getAxisRight())
                .build();
    }
}