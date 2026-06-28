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

    @NotBlank(message = "Mã chiến dịch không được để trống")
    private String campaignId;

    @NotBlank(message = "Mã bệnh nhân không được để trống")
    private String patientId;

    @NotBlank(message = "Mã lớp không được để trống")
    private String classId;

    @NotBlank(message = "Mã người khám không được để trống")
    private String examinerId;

    @NotNull(message = "Thị lực mắt trái chưa đeo kính không được để trống")
    @Min(value = 0, message = "Thị lực không được nhỏ hơn 0")
    private Float vaLeftWithoutGlasses;

    private Float vaLeftWithGlasses;
    private Float sphLeft;
    private Float cylLeft;

    @Min(value = 0, message = "Trục mắt trái phải lớn hơn hoặc bằng 0")
    @Max(value = 180, message = "Trục mắt trái phải nhỏ hơn hoặc bằng 180")
    private Integer axisLeft;

    @NotNull(message = "Thị lực mắt phải chưa đeo kính không được để trống")
    @Min(value = 0, message = "Thị lực không được nhỏ hơn 0")
    private Float vaRightWithoutGlasses;

    private Float vaRightWithGlasses;
    private Float sphRight;
    private Float cylRight;

    @Min(value = 0, message = "Trục mắt phải phải lớn hơn hoặc bằng 0")
    @Max(value = 180, message = "Trục mắt phải phải nhỏ hơn hoặc bằng 180")
    private Integer axisRight;
}