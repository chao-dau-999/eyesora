package vn.edu.fpt.eyesora.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EyeExamRecordRequest {

    @NotBlank(message = "The campaign ID cannot be left blank.")
    private String campaignId;

    @NotBlank(message = "Patient ID cannot be left blank.")
    private String patientId;

    @NotBlank(message = "Class ID cannot be left blank.")
    private String classId;

    @NotBlank(message = "The examination ID cannot be left blank.")
    private String examinerId;

    @NotNull(message = "The uncorrected left eye vision field must not be left blank.")
    @Min(value = 0, message = "Visual acuity must not be less than 0.")
    private Float vaLeftWithoutGlasses;

    private Float vaLeftWithGlasses;
    private Float sphLeft;
    private Float cylLeft;

    @Min(value = 0) @Max(value = 180)
    private Integer axisLeft;

    @NotNull(message = "The uncorrected right eye vision field must not be left blank.")
    @Min(value = 0, message = "Visual acuity must not be less than 0.")
    private Float vaRightWithoutGlasses;

    private Float vaRightWithGlasses;
    private Float sphRight;
    private Float cylRight;

    @Min(value = 0) @Max(value = 180)
    private Integer axisRight;
}