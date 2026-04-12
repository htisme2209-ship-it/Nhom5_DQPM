ĐẠI HỌC ĐÀ NẴNG

TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT

KHOA CÔNG NGHỆ SỐ

BÁO CÁO

ĐỒ ÁN PHẦN MỀM 1

NGÀNH CÔNG NGHỆ THÔNG TIN

ĐỀ TÀI : XÂY DỰNG HỆ THỐNG QUẢN LÝ LỊCH TRÌNH CÁC CHUYẾN TÀU CỦA NHÀ GA XE LỬA TP ĐÀ NẴNG

CBHD : ThS. Trần Bửu Dung

LHP : 225DAPM

NHÓM : 5

SINH VIÊN : Lê Viết Hoàng Thắng – 23115053122237

Phạm Thái Bảo – 23115053122102

Nguyễn Phước Quý Bửu – 23115053122104

Lê Bá Đại – 23115053122127

Đà Nẵng, tháng 03/2026

Mục Lục

[Mục Lục 2](#_Toc225700417)

[DANH MỤC BẢNG BIỂU 4](#_Toc225700418)

[DANH MỤC HÌNH VẼ 5](#_Toc225700419)

[Chương 1: TỔNG QUAN VỀ ĐỀ TÀI 6](#_Toc225700420)

[1.1. Tên đề tài 6](#_Toc225700421)

[1.2. Mục tiêu 6](#_Toc225700422)

[1.3. Cơ sở nghiên cứu 7](#_Toc225700423)

[_1.3.1._ Đối tượng sử dụng 7](#_Toc225700424)

[_1.3.2._ Chức năng chính 7](#_Toc225700425)

[_1.3.3._ Giới hạn của hệ thống 7](#_Toc225700426)

[Chương 2: PHÂN TÍCH THIẾT KẾ HỆ THỐNG 8](#_Toc225700427)

[2.1. Nghiệp vụ hoạt động của hệ thống 8](#_Toc225700428)

[_2.1.1._ Quy trình cốt lõi 8](#_Toc225700429)

[_2.1.2._ Các quy tắc nghiệp vụ 8](#_Toc225700430)

[2.2. Xác định các tác nhân 10](#_Toc225700431)

[2.3. Các chức năng của các tác nhân 11](#_Toc225700432)

[_2.3.1._ Nhân viên Điều hành 11](#_Toc225700433)

[_2.3.2._ Nhân viên Nhà ga 11](#_Toc225700434)

[_2.3.3._ Ban Quản lý Nhà ga 11](#_Toc225700435)

[_2.3.4._ Quản trị viên 11](#_Toc225700436)

[2.4. Sơ đồ Usecase 12](#_Toc225700437)

[2.5. Đặc tả chức năng 13](#_Toc225700438)

[_2.5.1._ Đăng nhập 13](#_Toc225700439)

[_2.5.2._ Xem và tra cứu thông tin 15](#_Toc225700440)

[_2.5.3._ Lập và điều chỉnh lịch trình 17](#_Toc225700441)

[_2.5.4._ Điều phối đường ray 20](#_Toc225700442)

[_2.5.5._ Mô phỏng lịch trình 22](#_Toc225700443)

[_2.5.6._ Điều hành và thông báo về sự cố 24](#_Toc225700444)

[_2.5.7._ Gửi yêu cầu phê duyệt kế hoạch đặc biệt 25](#_Toc225700445)

[_2.5.8._ Xác nhận tàu 28](#_Toc225700446)

[_2.5.9._ Ghi nhận sự cố 30](#_Toc225700447)

[_2.5.10._ Xem và tra cứu báo cáo thống kê hiệu suất lịch trình 32](#_Toc225700448)

[_2.5.11._ Phê duyệt kế hoạch 34](#_Toc225700449)

[_2.5.12._ Xem danh sách kế hoạch chờ duyệt 36](#_Toc225700450)

[_2.5.13._ Tạo báo cáo lịch trình 38](#_Toc225700451)

[_2.5.14._ Gửi chỉ đạo vận hành 40](#_Toc225700452)

[_2.5.15._ Xem và tra cứu thông tin nhân sự,nhật ký 41](#_Toc225700453)

[_2.5.16._ Thiết lập thông tin chuyến tàu 45](#_Toc225700454)

[_2.5.17._ Thiết lập thông tin hạ tầng ga/tuyến 48](#_Toc225700455)

[_2.5.18._ Xây dựng quy trình phê duyệt và các quy tắc nghiệp vụ hệ thống 50](#_Toc225700456)

[_2.5.19._ Thiết lập và cập nhật tài khoản 52](#_Toc225700457)

[2.6. Thiết kế ERD 55](#_Toc225700458)

[_2.6.1._ Sơ Đồ ERD 55](#_Toc225700459)

[_2.6.2._ Bảng TAI_KHOAN 55](#_Toc225700460)

[_2.6.3._ Bảng TAU 57](#_Toc225700461)

[_2.6.4._ Bảng TUYEN_DUONG 57](#_Toc225700462)

[_2.6.5._ Bảng GA 58](#_Toc225700463)

[_2.6.6._ Bảng GA_TUYEN 59](#_Toc225700464)

[_2.6.7._ Bảng CHUYEN_TAU 60](#_Toc225700465)

[_2.6.8._ Bảng DUONG_RAY 61](#_Toc225700466)

[_2.6.9._ Bảng LICH_TRINH 62](#_Toc225700467)

[_2.6.10._ Bảng SU_CO 64](#_Toc225700468)

[_2.6.11._ Bảng KE_HOACH_DAC_BIET 65](#_Toc225700469)

[_2.6.12._ Bảng NHAT_KY 66](#_Toc225700470)

[_2.6.13._ Bảng CHI_DAO 67](#_Toc225700471)

DANH MỤC BẢNG BIỂU

Bảng 3.1 Bản đặc tả Usecase “Đăng nhập” 10

Bảng 3.2 Bảng đặc tả Usecase “Xem và tra cứu thông tin” 11

Bảng 3.3 Bảng đặc tả Usecase “Lập và điều chỉnh lịch trình” 13

Bảng 3.4 Bảng đặc tả Usecase “Điều phối đường ray” 15

Bảng 3.5 Bảng đặc tả Usecase “Mô phỏng lịch trình” 16

Bảng 3.6 Bảng đặc tả Usecase “Điều hành và thông báo về sự cố” 17

Bảng 3.7 Bảng đặc tả Usecase “Điều phối đường ray” 18

Bảng 3.8 Bảng đặc tả Usecase “Xem và tra cứu thông tin” 19

Bảng 3.9 Bảng đặc tả Usecase “Điều phối đường ray” 20

Bảng 3.10 Bảng đặc tả Usecase “Ghi nhận sự cố” 21

Bảng 3.11 Bảng đặc tả Usecase “xem và tra cứu báo cáo thống kê hiệu suất lịch trình” 22

Bảng 3.12 Bảng đặc tả Usecase “Phê duyệt kế hoạch” 23

Bảng 3.13 Bảng đặc tả Usecase “Xem danh sách kế hoạch chờ duyệt” 24

Bảng 3.14 Bảng đặc tả Usecase “Tạo báo cáo lịch trình” 25

Bảng 3.15 Bảng đặc tả Usecase “Gửi chỉ đạo vận hành” 26

Bảng 3.16 Bảng đặc tả Usecase “Xem và tra cứu thông tin” 27

Bảng 3.17 Bảng đặc tả Usecase “Thiết lập thông tin chuyến tàu” 29

Bảng 3.18 Bảng đặc tả Usecase “Thiết lập thông tin hạ tầng ga/tuyến” 30

Bảng 3.19 Bảng đặc tả Usecase “Xây dựng quy trình phê duyệt và các quy tắc nghiệp vụ hệ thống” 31

Bảng 3.20 Bảng đặc tả Usecase “Thiết lập và cập nhật tài khoản” 32

DANH MỤC HÌNH VẼ

Hình 2.1 Sơ đồ Usecase 12

Hình 2.2 Giao diện Usecase “Đăng nhập” 14

Hình 2.3 Giao diên Usecase “Xem và tra cứu thông tin” 16

Hình 2.4 Giao diện Usecase “Lập và điều chỉnh lịch trình” 18

Hình 2.5 Giao diện Usecase “Điều phối đường ray” 21

Hình 2.6 Giao diện Usecase “Mô phỏng lịch trình” 23

Hình 2.7 Giao diện Usecase “Điều hành và thông báo về sự cố” 25

Hình 2.8 Giao diện Usecase “Gửi yêu cầu phê duyệt kế hoạch đặc biệt” 27

Hình 2.9 Giao diện Usecase “Xác nhận tàu” 29

Hình 2.10 Giao diện Usecase “Ghi nhận sự cố” 31

Hình 2.11 Giao diện “Xem và tra cứu báo cáo thống kê hiệu suất lịch trình” 33

Hình 2.12 Giao diện Usecase “Phê duyệt kế hoạch” 35

Hình 2.13 Gaio diện Usecase “Xem danh sách kế hoạch chờ duyệt” 37

Hình 2.14 Giao diện Usecase “Tạo báo cáo lịch trình” 39

Hình 2.15 Giao diện Usecase “Gửi chỉ đạo vận hành” 41

Hình 2.16 Giao diện Usecase “Xem và tra cứu thông tin nhân sự” 43

44

Hình 2.17 Giao diện Usecase “Thiết lập thông tin chuyến tàu” 47

Hình 2.18 Giao diện Usecase “Thiết lập thông tin hạ tầng ga/tuyến” 49

Hình 2.19 Giao diện Usecase “Xây dựng quy trình phê duyệt và các quy tắc nghiệp vụ hệ thống” 51

Hình 2.20 Giao diện Usecase “Thiết lập tài khoản” 53

# TỔNG QUAN VỀ ĐỀ TÀI

## Tên đề tài

- Xây Dựng Hệ Thống Quản Lý Lịch Trình Các Chuyến Tàu Của Nha Ga Xe Lửa Thành Phố Đà Nẵng

## Mục tiêu

- Xây dựng một hệ thống quản lý lịch trình vận hành tàu hỏa toàn diện, chính xác và hiện đại hóa quy trình nghiệp vụ cho nhà ga xe lửa thành phố Đà Nẵng.
- Số hóa quy trình điều hành: Chuyển đổi từ việc quản lý lịch trình thủ công sang hệ thống điện tử tự động, giảm thiểu sai sót về thời gian và nâng cao hiệu quả phối hợp giữa các bộ phận.
- Quản lý lịch trình thời gian thực: Xây dựng cơ sở dữ liệu (CSDL) lịch trình chính xác, hỗ trợ cập nhật tình trạng tàu (trễ chuyến, thay đổi đường ray) ngay lập tức.
- Tối ưu hóa hạ tầng ga: Hỗ trợ điều phối việc sử dụng các đường ray hiệu quả, tránh xung đột lịch trình trong khung giờ cao điểm.
- Hỗ trợ quyết định: Cung cấp hệ thống báo cáo thống kê về tần suất chạy tàu và tỷ lệ đúng giờ để ban quản lý đưa ra các điều chỉnh vận hành phù hợp.

## Cơ sở nghiên cứu

### Đối tượng sử dụng

- Quản trị viên
- Nhân viên Điều hành
- Nhân viên Nhà ga
- Ban quản lý nhà ga

### Chức năng chính

- Quản lý lịch trình: Khởi tạo lịch trình định kỳ, cấu hình danh sách các ga dừng và thời gian dự kiến.
- Điều hành thời gian thực: Cập nhật số phút trễ, thay đổi trạng thái tàu (Vào ga, Xuất phát, Hủy chuyến).
- Quản lý hạ tầng: Phân bổ đường ray và quản lý sơ đồ toa tàu.
- Hệ thống thông báo: Tự động đồng bộ dữ liệu lên bảng LED tại sảnh ga và ứng dụng di động cho khách.
- Báo cáo thống kê: Xuất dữ liệu tần suất tàu, lưu lượng khách và báo cáo doanh thu dịch vụ ga.

### Giới hạn của hệ thống

- Phạm vi: Tập trung phục vụ riêng cho công tác quản lý lịch trình tại Ga Đà Nẵng.
- Tích hợp: Hiện tại chưa tích hợp sâu với hệ thống điều hành toàn quốc của Tổng công ty Đường sắt Việt Nam.
- Quy mô đề tài: Đây là đề tài nghiên cứu cấp sinh viên, tập trung vào việc hoàn thiện các nghiệp vụ cốt lõi, chưa tối ưu hóa cho lượng truy cập cực lớn đồng thời.
- Nguồn lực: Hạn chế về kinh phí triển khai thực tế và đội ngũ bảo trì dài hạn.
- Bảo mật: Mức độ bảo mật dừng lại ở tiêu chuẩn ứng dụng phần mềm, chưa đảm bảo các chứng chỉ bảo mật doanh nghiệp cấp cao.
- Thời gian: Thời gian phát triển ngắn nên chưa thể thực hiện kiểm thử đầy đủ mọi tình huống phát sinh trong vận hành thực tế.

# PHÂN TÍCH THIẾT KẾ HỆ THỐNG

## Nghiệp vụ hoạt động của hệ thống

### Quy trình cốt lõi

**a. Quy trình Lập và Cập nhật Lịch trình hàng ngày:**

1.  **Khởi tạo:** Hệ thống tự động trích xuất dữ liệu từ "Lịch trình gốc"của ngành đường sắt để tạo danh sách chuyến tàu dự kiến đi/đến Ga Đà Nẵng trong ngày.
2.  **Xác nhận:** Nhân viên Điều hành kiểm tra và xác nhận danh sách các đoàn tàu thực tế sẽ vận hành.
3.  **Điều chỉnh:** Nếu có thông báo thay đổi từ trung tâm điều hành toàn quốc (ví dụ: tàu chạy thêm, hủy chuyến), Nhân viên Điều hành cập nhật trực tiếp vào hệ thống để đồng bộ dữ liệu.

**b. Quy trình Điều phối Tàu vào Ga và Xử lý biến động (Trễ tàu):**

1.  **Tiếp nhận dữ liệu:** Hệ thống nhận thông tin vị trí tàu thực tế từ các ga lân cận (Huế, Tam Kỳ).
2.  **Xử lý trễ chuyến:** Nếu tàu bị trễ, Nhân viên Điều hành nhập số phút trễ thực tế. Hệ thống tự động tính toán lại "Giờ đến dự kiến" và "Giờ đi dự kiến" tại Ga Đà Nẵng.
3.  **Chỉ định đường ray:** Nhân viên Điều hành chọn đường ray (1, 2 hoặc 3) cho tàu vào dựa trên tình trạng trống của hạ tầng.
4.  **Thông báo:** Thông tin về giờ tàu mới và số đường ray được tự động đẩy lên bảng LED tại sảnh và thông báo đến ứng dụng của Hành khách.

### Các quy tắc nghiệp vụ

Để đảm bảo tính chính xác và an toàn trong vận hành, hệ thống tuân thủ các quy tắc sau:

- **Quy tắc An toàn hạ tầng:** Tại một thời điểm, một đường ray (Platform) chỉ được phép chứa duy nhất một đoàn tàu. Hệ thống sẽ cảnh báo nếu có sự trùng lặp lịch trình trên cùng một ray.
- **Quy tắc Thời gian đệm:** Giữa hai chuyến tàu sử dụng cùng một đường ray phải có khoảng thời gian đệm tối thiểu (ví dụ: 15-20 phút) để đảm bảo công tác vệ sinh và an toàn chạy tàu.
- **Quy tắc Cập nhật thông tin:** Mọi thay đổi về giờ tàu hoặc số đường ray phải được hệ thống đồng bộ lên các phương tiện hiển thị công cộng (bảng LED, Website) trong vòng tối đa 30 giây.
- **Quy tắc Phân quyền (RBAC):** Chỉ Nhân viên Điều hành mới có quyền thay đổi giờ chạy tàu và chỉ định đường ray.
    - **Nhân viên Nhà ga** chỉ được phép cập nhật trạng thái đón khách và soát vé.
    - **Quản trị viên** không được phép can thiệp vào dữ liệu lịch trình thực tế mà chỉ quản lý hạ tầng và tài khoản.
- **Quy tắc Lưu vết :** Mọi thao tác thay đổi lịch trình (sửa giờ, đổi đường ray) đều phải được hệ thống ghi lại nhật ký bao gồm: người thực hiện, thời gian thực hiện và nội dung thay đổi để phục vụ công tác hậu kiểm.
- Quy tắc phân loại chuyến tàu tại ga Đà Nẵng

<div class="joplin-table-wrapper"><table><tbody><tr><td><p><strong>Loại tàu</strong></p></td><td><p><strong>Vai trò Đà Nẵng</strong></p></td><td><p><strong>Sự kiện ĐẾN</strong></p></td><td><p><strong>Sự kiện ĐI</strong></p></td><td><p><strong>Thời gian chiếm ray</strong></p></td></tr><tr><td><p><strong>Tàu trung gian</strong></p><p>(A → ĐN → B)</p></td><td><p>Ga dừng giữa hành trình</p></td><td><p>Có</p><p>(+1 đến)</p></td><td><p>Có</p><p>(+1 đi)</p></td><td><p>[Giờ đến, Giờ đi + 15' đệm]</p></td></tr><tr><td><p><strong>Tàu xuất phát</strong></p><p>(ĐN → B)</p></td><td><p>Điểm khởi hành</p></td><td><p>Không</p></td><td><p>Có</p><p>(+1 đi)</p></td><td><p>[Giờ lên tàu, Giờ đi + 15' đệm]</p></td></tr><tr><td><p><strong>Tàu điểm cuối</strong></p><p>(A → ĐN)</p></td><td><p>Điểm kết thúc hành trình</p></td><td><p>Có</p><p>(+1 đến)</p></td><td><p></p><p>Không</p></td><td><p>[Giờ đến, Giờ rời ray + 15' đệm]</p></td></tr><tr><td colspan="5"><p><strong>Công thức thống kê:</strong></p><ul><li>Tổng chuyến đến Đà Nẵng = Số tàu Điểm cuối + Số tàu Trung gian</li><li>Tổng chuyến đi<strong> </strong>từ Đà Nẵng = Số tàu Xuất phát + Số tàu Trung gian</li></ul></td></tr></tbody></table></div>

- **Quy tắc 1 — Phân loại phong tỏa theo mức độ sự cố:**
- Khi sự cố được ghi nhớn, hệ thống xác định muc_do từ bảng SU_CO và áp dụng tự động:
- THAP / TRUNG_BINH → trang_thai của ray chuyển sang PHONG_TOA_TAM, lưu thoi_gian_xu_ly_uoc_tinh_phut (thời gian ước tính để giải phóng ray).
- CAO / KHAN_CAP hoặc kich_hoat_phong_toa = true → trang_thai chuyển sang PHONG_TOA_CUNG, trường thoi_gian_phong_toa_uoc_tinh_phut để NULL vì không thể dự đoán. Chỉ BQL mới có quyền giải phóng trạng thái này.
- **Quy tắc 2 — Kiểm tra xung đột mở rộng:**
    - Hệ thống từ chối phân bổ ray không chỉ khi cửa sổ chiếm ray trùng nhau, mà còn từ chối khi ray có trang_thai là PHONG_TOA_TAM hoặc PHONG_TOA_CUNG. Thông báo lỗi phải phân biệt rõ nguyên nhân: “Xung đột lịch trình” khác với “Ray đang bị phong tỏa do sự cố”.
- **Quy tắc 3 — Tự động tính toán ảnh hưởng:**
    - Khi ray bị phong tỏa, hệ thống ngay lập tức truy vấn toàn bộ LICH_TRINH có ma_ray trùng và ngay_chay trong khoảng thời gian ảnh hưởng ước tính. Mỗi lịch trình bị ảnh hưởng được gán ma_su_co_anh_huong và phuong_an_xu_ly = ‘CHO_RAY’ làm mặc định, hiển thị rõ cho NVĐH để xử lý.
- **Quy tắc 4 — Giải phóng ray phải có xác nhận:**
    - PHONG_TOA_TAM: NVĐH có thể tự xác nhớn giải phóng khi trang_thai_xu_ly của SU_CO chuyển sang DA_XU_LY.
    - PHONG_TOA_CUNG: hệ thống chặn hoàn toàn, chỉ BQL mới có quyền thực hiện thao tác giải phóng. Mọi nỗ lực giải phóng từ NVĐH bị từ chối và ghi nhật ký.

## Xác định các tác nhân

1.  Quản trị viên : Người chịu trách nhiệm kỹ thuật, quản lý tài khoản nhân viên và cấu hình hệ thống.
2.  Nhân viên Điều hành : Người trực tiếp lập lịch, điều chỉnh giờ tàu và phân bổ đường ray đón khách.
3.  Nhân viên Nhà ga: Là lực lượng nhân sự trực tiếp tại khu vực sân ga, đóng vai trò giám sát và xác nhận trạng thái thực tế của hạ tầng để đồng bộ với hệ thống điều hành trung tâm.
4.  Ban Quản lý Nhà ga: Đơn vị theo dõi báo cáo tổng thể để đánh giá hiệu suất vận hành (tỷ lệ đúng giờ, lưu lượng khách).

## Các chức năng của các tác nhân

### Nhân viên Điều hành

- Đăng nhập
- Xem và tra cứu thông tin
- Lập và điều chỉnh lịch trình
- Điều phối đường ray
- Mô phỏng lịch trình
- Điều hành và thông báo về sự cố
- Gửi yêu cầu phê duyệt kế hoạch đặc biệt

### Nhân viên Nhà ga

- Đăng nhập
- Xem và tra cứu tra cứu thông tin
- Xác nhận tàu
- Ghi nhận sự cố

### Ban Quản lý Nhà ga

- Đăng nhập
- Xem và tra cứu báo cáo thống kê hiệu suất lịch trính
- Phê duyệt kế hoạch
- Xem danh sách kế hoạch chờ duyệt
- Tạo báo cáo lịch trình
- Gửi chỉ đạo vận hành cho nhân viên Điều hành

### Quản trị viên

- Đăng nhập
- Xem & tra cứu thông tin
- Thiết lập thông tin chuyến tàu
- Thiết lập thông tin hạ tầng ga/tuyến
- Xây dựng quy trình phê duyệt và các quy tắc nghiệp vụ hệ thống.
- Thiết lập và cập nhật tài khoản

## Sơ đồ Usecase

Sơ đồ Usecase

## Đặc tả chức năng

### Đăng nhập

|     |     |     |
| --- | --- | --- |
| **STT** | **Usecase name** | **Đăng nhập** |
| **1.** | **Description** | Người dùng đã có tài khoản muốn đăng nhập vào Hệ thống Quản lý Lịch trình Nhà ga Xe lửa TP Đà Nẵng. |
| **2.** | **Actors** | Quản trị viên, Nhân viên Điều hành, Nhân viên Nhà ga, Ban Quản lý Nhà ga |
| **3.** | **Input** | Actor đã có tài khoản trong hệ thống.<br><br>Thông tin đăng nhập: Email/Tên đăng nhập, Mật khẩu. |
| **4.** | **Output** | Hệ thống xác thực thành công và chuyển đến trang dashboard tương ứng theo vai trò của từng actor. |
| **5.** | **Basic flow** | 1\. Actor truy cập vào ứng dụng → Bắt đầu Usecase.<br><br>2\. Hệ thống hiển thị giao diện đăng nhập.<br><br>3\. Actor nhập email/tên đăng nhập và mật khẩu.<br><br>4\. Actor nhấn nút "Đăng nhập".<br><br>5\. Hệ thống kiểm tra và xác thực thông tin đăng nhập.<br><br>6\. Hệ thống chuyển đến trang chủ (dashboard) phù hợp với vai trò của actor → Kết thúc Usecase. |
| **6.** | **Alternative flow** | (Không có luồng thay thế) |
| **7.** | **Exception flow** | 2\. Actor thoát khỏi ứng dụng → Usecase kết thúc mà chưa đăng nhập.<br><br>3\. Nhập sai email hoặc mật khẩu → Hệ thống hiển thị thông báo "Tên đăng nhập hoặc mật khẩu không đúng" → Quay lại bước 2.<br><br>5\. Tài khoản bị vô hiệu hóa → Hệ thống thông báo "Tài khoản đã bị khóa, vui lòng liên hệ Quản trị viên" → Kết thúc Usecase. |

Bản đặc tả Usecase “Đăng nhập”

  

Giao diện Usecase “Đăng nhập”

### Xem và tra cứu thông tin

|     |     |     |
| --- | --- | --- |
| **STT** | **Usecase name** | **Xem và tra cứu thông tin** |
| **1.** | **Description** | Nhân viên Điều hành xem và tra cứu thông tin lịch trình chuyến tàu, tình trạng đường ray và các dữ liệu vận hành trong ngày. |
| **2.** | **Actors** | Nhân viên Điều hành |
| **3.** | **Input** | Nhân viên Điều hành đã đăng nhập.<br><br>Điều kiện tra cứu (mã tàu, số hiệu chuyến, ngày, trạng thái, loại tàu: Trung gian / Xuất phát / Điểm cuối…). |
| **4.** | **Output** | Hệ thống hiển thị danh sách và thông tin chi tiết chuyến tàu kèm phân loại vai trò tại Ga Đà Nẵng. |
| **5.** | **Basic flow** | 1\. Actor đăng nhập → Bắt đầu Usecase.<br><br>2\. Actor chọn chức năng "Xem và tra cứu thông tin".<br><br>3\. Hệ thống hiển thị danh sách chuyến tàu trong ngày với cột "Loại tàu" (Trung gian / Xuất phát / Điểm cuối).<br><br>4\. Actor nhập điều kiện tìm kiếm (có thể lọc theo loại tàu) và nhấn "Tìm kiếm".<br><br>5\. Hệ thống trả về kết quả.<br><br>6\. Actor chọn một chuyến để xem chi tiết: giờ đến, giờ đi, đường ray, trạng thái, cửa sổ chiếm ray → Kết thúc Usecase. |
| **6.** | **Alternative flow** | 4a. Actor lọc theo loại tàu: chỉ hiện Trung gian, hoặc chỉ Xuất phát/Điểm cuối để phân tích lưu lượng một chiều. |
| **7.** | **Exception flow** | 1\. Actor chưa đăng nhập → Hệ thống chuyển về trang đăng nhập.<br><br>5\. Không tìm thấy kết quả → Hệ thống thông báo "Không tìm thấy dữ liệu phù hợp" → Quay lại bước 3. |

Bảng đặc tả Usecase “Xem và tra cứu thông tin”

Giao diên Usecase “Xem và tra cứu thông tin”

### Lập và điều chỉnh lịch trình

|     |     |     |
| --- | --- | --- |
| **STT** | **Usecase name** | **Lập và điều chỉnh lịch trình** |
| **1.** | **Description** | Nhân viên Điều hành khởi tạo lịch trình chuyến tàu mới hoặc điều chỉnh lịch trình hiện có.<br><br>Hệ thống áp dụng quy tắc kiểm tra xung đột dựa trên phân loại vai trò tàu tại Ga Đà Nẵng:<br><br>\- Tàu TRUNG GIAN: có cả sự kiện Đến và Đi → chiếm ray từ T_đến đến T_đi + 15' đệm.<br><br>\- Tàu XUẤT PHÁT: chỉ có sự kiện Đi → chiếm ray từ T_lên tàu đến T_đi + 15' đệm.<br><br>\- Tàu ĐIỂM CUỐI: chỉ có sự kiện Đến → chiếm ray từ T_đến đến T_rời ray + 15' đệm. |
| **2.** | **Actors** | Nhân viên Điều hành |
| **3.** | **Input** | Nhân viên Điều hành đã đăng nhập.<br><br>Thông tin bắt buộc: Mã tàu, Loại vai trò tại Ga Đà Nẵng (Trung gian / Xuất phát / Điểm cuối), Đường ray dự kiến.<br><br>Thông tin theo loại:<br><br>\- Trung gian: Giờ đến dự kiến VÀ giờ đi dự kiến.<br><br>\- Xuất phát: Giờ đi dự kiến (giờ lên tàu = giờ đi - 30').<br><br>\- Điểm cuối: Giờ đến dự kiến (giờ rời ray = giờ đến + thời gian dừng đỗ). |
| **4.** | **Output** | Hệ thống lưu lịch trình với đầy đủ thông tin phân loại.<br><br>Hệ thống tính và lưu "cửa sổ chiếm ray" tương ứng với loại tàu.<br><br>Hệ thống ghi nhật ký thao tác (người thực hiện, thời gian, nội dung thay đổi). |
| **5.** | **Basic flow** | 1\. Actor đăng nhập → Bắt đầu Usecase.<br><br>2\. Actor chọn chức năng "Lập/Điều chỉnh lịch trình".<br><br>3\. Actor chọn loại tàu tại Ga Đà Nẵng: Trung gian / Xuất phát / Điểm cuối.<br><br>4\. Hệ thống hiển thị form phù hợp theo loại (Trung gian: cả giờ đến + giờ đi; Xuất phát: chỉ giờ đi; Điểm cuối: chỉ giờ đến).<br><br>5\. Actor điền thông tin, chọn đường ray dự kiến và nhấn "Lưu".<br><br>6\. Hệ thống tính cửa sổ chiếm ray và kiểm tra xung đột với tất cả chuyến cùng đường ray trong ngày.<br><br>7\. Hệ thống lưu lịch trình và đồng bộ lên bảng LED → Kết thúc Usecase. |
| **6.** | **Alternative flow** | 6a. Lịch trình là kế hoạch đặc biệt → Hệ thống gửi yêu cầu phê duyệt đến Ban Quản lý; trạng thái = "Chờ duyệt". |
| **7.** | **Exception flow** | 3\. Actor không chọn loại tàu → Hệ thống yêu cầu bắt buộc chọn loại trước khi tiếp tục.<br><br>6\. Phát hiện xung đột đường ray (cửa sổ chiếm ray giao nhau với chuyến khác) → Hệ thống cảnh báo chi tiết (tên tàu gây xung đột, khoảng thời gian bị trùng) → Quay lại bước 5.<br><br>6\. Tàu Trung gian nhưng giờ đến ≥ giờ đi → Hệ thống thông báo lỗi "Giờ đến phải nhỏ hơn giờ đi" → Quay lại bước 4. |

Bảng đặc tả Usecase “Lập và điều chỉnh lịch trình”

Giao diện Usecase “Lập và điều chỉnh lịch trình”

Giao diện Form thêm mới lịch trình

### Điều phối đường ray

|     |     |     |
| --- | --- | --- |
| **STT** | **Usecase name** | **Điều phối đường ray** |
| **1.** | **Description** | Nhân viên Điều hành phân bổ đường ray cho từng chuyến tàu vào ga.<br><br>Quy tắc kiểm tra xung đột dựa trên cửa sổ chiếm ray theo loại tàu:<br><br>\- Trung gian: cửa sổ = \[T_đến, T_đi + 15'\]<br><br>\- Xuất phát: cửa sổ = \[T_lên tàu, T_đi + 15'\]<br><br>\- Điểm cuối: cửa sổ = \[T_đến, T_rời ray + 15'\]<br><br>Hai chuyến xung đột nếu cửa sổ chiếm ray của chúng giao nhau trên cùng đường ray. |
| **2.** | **Actors** | Nhân viên Điều hành |
| **3.** | **Input** | Nhân viên Điều hành đã đăng nhập.<br><br>Thông tin chuyến tàu cần phân bổ (mã tàu, loại tàu, giờ đến/đi dự kiến).<br><br>Trạng thái các đường ray hiện tại (danh sách cửa sổ đã bị chiếm). |
| **4.** | **Output** | Hệ thống lưu thông tin đường ray và cửa sổ chiếm ray cho chuyến tàu.<br><br>Hệ thống đồng bộ số đường ray lên bảng LED trong 30 giây.<br><br>Hệ thống ghi nhật ký phân bổ. |
| **5.** | **Basic flow** | 1\. Actor đăng nhập → Bắt đầu Usecase.<br><br>2\. Actor chọn chức năng "Điều phối đường ray".<br><br>3\. Hệ thống hiển thị sơ đồ trạng thái đường ray theo timeline, phân biệt màu loại tàu (Trung gian / Xuất phát / Điểm cuối).<br><br>4\. Actor chọn chuyến tàu chưa được phân bổ đường ray.<br><br>5\. Hệ thống tô sáng các đường ray khả dụng (không có cửa sổ chiếm ray giao nhau với cửa sổ của chuyến đang phân bổ).<br><br>6\. Actor chọn đường ray. |
| **6.** | **Alternative flow** | 4a. Tàu Trung gian: Actor xem cả giờ đến lẫn giờ đi để ước lượng thời gian chiếm ray trước khi chọn.<br><br>5a. Không có đường ray khả dụng → Hệ thống gợi ý điều chỉnh giờ đến/giờ đi để giải phóng xung đột. |
| **7.** | **Exception flow** | 7\. Trước khi phân bổ ray, hệ thống kiểm tra trang_thai của ray. Nếu trang_thai = PHONG_TOA_TAM → hiển thị tên sự cố, thời gian phong tỏa, thời gian ước tính còn lại; nếu PHONG_TOA_CUNG → hiển thị thông báo “Ray đang bị phong tỏa cứng, chờ BQL giải phóng” → Từ chối và quay lại bước 6. Đường ray bị chiếm bởi loại bất kỳ trong cửa sổ thời gian giao nhau → Hệ thống từ chối và hiển thị chi tiết xung đột (tên tàu chiếm ray, loại tàu, khoảng thời gian bị trùng) → Quay lại bước 5 |

Bảng đặc tả Usecase “Điều phối đường ray”

Giao diện Usecase “Điều phối đường ray”

### Mô phỏng lịch trình

|     |     |     |
| --- | --- | --- |
| **STT** | **Usecase name** | **Mô phỏng lịch trình** |
| **1.** | **Description** | Nhân viên Điều hành mô phỏng kịch bản lịch trình (thêm/sửa chuyến, điều chỉnh đường ray, thay đổi loại tàu...) để kiểm tra tính khả thi trước khi áp dụng chính thức. |
| **2.** | **Actors** | Nhân viên Điều hành |
| **3.** | **Input** | Nhân viên Điều hành đã đăng nhập.<br><br>Dữ liệu kịch bản mô phỏng (thêm/sửa chuyến, đổi loại tàu, thay đổi đường ray, điều chỉnh giờ...). |
| **4.** | **Output** | Hệ thống hiển thị kết quả mô phỏng: xung đột lịch trình (phân loại xung đột theo loại tàu), khuyến nghị.<br><br>Dữ liệu mô phỏng không ảnh hưởng đến lịch trình đang vận hành thực tế. |
| **5.** | **Basic flow** | 1\. Actor đăng nhập → Bắt đầu Usecase.<br><br>2\. Actor chọn chức năng "Mô phỏng lịch trình".<br><br>3\. Hệ thống hiển thị giao diện mô phỏng (bản sao lịch trình thực, không ảnh hưởng dữ liệu gốc).<br><br>4\. Actor thực hiện thay đổi trên bản mô phỏng (thêm chuyến, đổi loại tàu, sửa giờ, đổi đường ray…).<br><br>5\. Actor nhấn "Chạy mô phỏng".<br><br>6\. Hệ thống tính lại cửa sổ chiếm ray cho tất cả chuyến (theo loại tàu) và phát hiện xung đột.<br><br>7\. Hệ thống hiển thị kết quả: danh sách xung đột, tỷ lệ tận dụng đường ray, thống kê chuyến đến/đi theo loại → Kết thúc Usecase. |
| **6.** | **Alternative flow** | 7a. Actor chấp nhận kịch bản → Chọn "Áp dụng vào lịch trình thực" → Hệ thống chuyển sang UC-03 để lưu chính thức. |
| **7.** | **Exception flow** | 4\. Actor thay đổi loại tàu nhưng thiếu thông tin bắt buộc (ví dụ: đổi sang Trung gian mà không nhập giờ đi) → Hệ thống thông báo lỗi → Quay lại bước 4. |

Bảng đặc tả Usecase “Mô phỏng lịch trình”

Giao diện Usecase “Mô phỏng lịch trình”

### Điều hành và thông báo về sự cố

|     |     |     |
| --- | --- | --- |
| **STT** | **Usecase name** | **Điều hành và thông báo về sự cố** |
| **1.** | **Description** | Nhân viên Điều hành xử lý các biến động thực tế (tàu trễ, hủy chuyến, đổi đường ray đột xuất) |
| **2.** | **Actors** | Nhân viên Điều hành |
| **3.** | **Input** | Nhân viên Điều hành đã đăng nhập vào hệ thống.<br><br>Thông tin sự cố: mã tàu, loại sự cố (Trễ chuyến / Hủy chuyến / Đổi đường ray), số phút trễ, lý do. |
| **4.** | **Output** | Hệ thống cập nhật trạng thái tàu và tính toán lại giờ đến/đi dự kiến (nếu trễ).<br><br>Hệ thống ghi nhật ký đầy đủ: người thực hiện, thời gian, nội dung thay đổi. |
| **5.** | **Basic flow** | 1\. Actor đăng nhập → Bắt đầu Usecase.<br><br>2\. Actor chọn chuyến tàu bị biến động trên danh sách lịch trình.<br><br>3\. Actor chọn loại sự cố: Trễ chuyến / Hủy chuyến / Đổi đường ray.<br><br>4\. Actor nhập thông tin chi tiết (số phút trễ, lý do sự cố, đường ray mới nếu cần).<br><br>5\. Actor nhấn "Xác nhận cập nhật".<br><br>6\. Hệ thống tính toán lại giờ dự kiến (nếu trễ) và cập nhật trạng thái.<br><br>7\. Kết thúc Usecase. 6. Nếu ray đang ở PHONG_TOA_TAM, hệ thống hiển thị danh sách lịch trình bị tác động kèm 3 lựa chọn cho mỗi chuyến: (1) “Giữ nguyên chờ ray”, (2) “Đề xuất đổi sang ray khác”, (3) “Hủy chuyến”. NVĐH xử lý từng chuyến trước khi đóng sự cố. |
| **6.** | **Alternative flow** | 3a. Actor chọn "Hủy chuyến" → Hệ thống hiển thị hộp thoại xác nhận trước khi thực hiện. |
| **7.** | **Exception flow** | 4\. Số phút trễ nhập không hợp lệ (âm hoặc không phải số) → Hệ thống thông báo lỗi → Quay lại bước 4.<br><br>6\. Đổi sang đường ray đang bị xung đột → Hệ thống cảnh báo → Quay lại bước 4. |

Bảng đặc tả Usecase “Điều hành và thông báo về sự cố”

Giao diện Usecase “Điều hành và thông báo về sự cố”

### Gửi yêu cầu phê duyệt kế hoạch đặc biệt

|     |     |     |
| --- | --- | --- |
| **STT** | **Usecase name** | **Gửi yêu cầu phê duyệt kế hoạch đặc biệt** |
| **1.** | **Description** | Nhân viên Điều hành lập kế hoạch vận hành đặc biệt (thêm chuyến, thay đổi tuyến, vận hành ngày lễ…) và gửi lên Ban Quản lý Nhà ga để xin phê duyệt. |
| **2.** | **Actors** | Nhân viên Điều hành |
| **3.** | **Input** | Nhân viên Điều hành đã đăng nhập vào hệ thống.<br><br>Nội dung kế hoạch: tiêu đề, mô tả, thời gian áp dụng, lý do, dữ liệu lịch trình kèm theo (nếu có). |
| **4.** | **Output** | Hệ thống lưu kế hoạch với trạng thái "Chờ phê duyệt".<br><br>Hệ thống gửi thông báo đến Ban Quản lý Nhà ga. |
| **5.** | **Basic flow** | 1\. Actor đăng nhập → Bắt đầu Usecase.<br><br>2\. Actor chọn chức năng "Gửi yêu cầu phê duyệt kế hoạch đặc biệt".<br><br>3\. Hệ thống hiển thị form soạn thảo kế hoạch.<br><br>4\. Actor điền thông tin: tiêu đề, nội dung, thời gian áp dụng, lý do; đính kèm file nếu có.<br><br>5\. Actor nhấn "Gửi yêu cầu".<br><br>6\. Hệ thống lưu kế hoạch với trạng thái "Chờ phê duyệt" và gửi thông báo đến Ban Quản lý → Kết thúc Usecase. |
| **6.** | **Alternative flow** | 5a. Actor nhấn "Lưu nháp" → Hệ thống lưu kế hoạch ở trạng thái nháp, chưa gửi đến Ban Quản lý. |
| **7.** | **Exception flow** | 4\. Thiếu thông tin bắt buộc (tiêu đề, nội dung, thời gian) → Hệ thống thông báo lỗi → Quay lại bước 4.<br><br>6\. Gửi thất bại (lỗi mạng) → Hệ thống thông báo lỗi và lưu kế hoạch để gửi lại sau → Kết thúc Usecase. |

Bảng đặc tả Usecase “Gửi yêu cầu phê duyệt kế hoạch đặc biệt”

Giao diện Usecase “Gửi yêu cầu phê duyệt kế hoạch đặc biệt”

### Xác nhận tàu

|     |     |     |
| --- | --- | --- |
| **STT** | **Usecase name** | **Xác nhận tàu** |
| **1.** | **Description** | Nhân viên Nhà ga xác nhận trạng thái thực tế của tàu tại sân ga (Tàu vào ga / Tàu xuất phát) để đồng bộ với hệ thống điều hành trung tâm và cập nhật cửa sổ chiếm ray thực tế. |
| **2.** | **Actors** | Nhân viên Nhà ga |
| **3.** | **Input** | Nhân viên Nhà ga đã đăng nhập.<br><br>Thông tin xác nhận: mã tàu, trạng thái (Tàu vào ga / Tàu xuất phát), thời gian thực tế. |
| **4.** | **Output** | Hệ thống cập nhật trạng thái và ghi nhận thời gian thực tế.<br><br>Hệ thống so sánh giờ thực tế với giờ dự kiến để phát hiện trễ.<br><br>Hệ thống đồng bộ lên bảng LED. |
| **5.** | **Basic flow** | 1\. Actor đăng nhập → Bắt đầu Usecase.<br><br>2\. Actor chọn chức năng "Xác nhận tàu".<br><br>3\. Hệ thống hiển thị danh sách chuyến chờ xác nhận trong ca trực.<br><br>4\. Actor chọn chuyến tàu (hệ thống hiển thị loại tàu để tham khảo).<br><br>5\. Actor chọn trạng thái: "Tàu vào ga" hoặc "Tàu xuất phát".<br><br>6\. Actor nhấn "Xác nhận" → Hệ thống cập nhật và đồng bộ lên bảng LED → Kết thúc Usecase. |
| **6.** | **Alternative flow** | 5a. Actor thêm ghi chú thực tế trước khi xác nhận. |
| **7.** | **Exception flow** | 6\. Actor xác nhận nhầm → Chọn "Hủy xác nhận" → Hệ thống hoàn tác → Quay lại bước 3. |

Bảng đặc tả Usecase “Xác nhận tàu”

Giao diện Usecase “Xác nhận tàu”

### Ghi nhận sự cố

|     |     |     |
| --- | --- | --- |
| **STT** | **Usecase name** | **Ghi nhận sự cố** |
| **1.** | **Description** | Nhân viên Nhà ga ghi nhận và báo cáo sự cố thực tế tại sân ga vào hệ thống để thông báo kịp thời đến Nhân viên Điều hành và Ban Quản lý. |
| **2.** | **Actors** | Nhân viên Nhà ga |
| **3.** | **Input** | Nhân viên Nhà ga đã đăng nhập.<br><br>Thông tin sự cố: loại sự cố, vị trí, mức độ nghiêm trọng, mô tả chi tiết, hình ảnh (nếu có). |
| **4.** | **Output** | Hệ thống lưu báo cáo sự cố với thời gian ghi nhận.<br><br>Hệ thống gửi thông báo đến Nhân viên Điều hành và Ban Quản lý Nhà ga. |
| **5.** | **Basic flow** | 1\. Actor đăng nhập → Bắt đầu Usecase.<br><br>2\. Actor chọn chức năng "Ghi nhận sự cố".<br><br>3\. Hệ thống hiển thị form ghi nhận sự cố.<br><br>4\. Actor điền thông tin; đính kèm hình ảnh nếu có.<br><br>5\. Actor nhấn "Gửi báo cáo".<br><br>6\. Hệ thống lưu và gửi thông báo → Kết thúc Usecase. |
| **6.** | **Alternative flow** | 5a. Nhấn "Lưu nháp" → Báo cáo chưa gửi, lưu tạm để bổ sung. |
| **7.** | **Exception flow** | 4\. Thiếu thông tin bắt buộc → Hệ thống thông báo lỗi → Quay lại bước 4. |

Bảng đặc tả Usecase “Ghi nhận sự cố”

Giao diện Usecase “Ghi nhận sự cố”

### Xem và tra cứu báo cáo thống kê hiệu suất lịch trình

|     |     |     |
| --- | --- | --- |
| **STT** | **Usecase name** | **Xem và tra cứu báo cáo thống kê hiệu suất lịch trình** |
| **1.** | **Description** | Ban Quản lý Nhà ga xem báo cáo tổng hợp hiệu suất vận hành, bao gồm:<br><br>\- Thống kê chuyến ĐẾN Đà Nẵng = Tàu Điểm cuối + Tàu Trung gian.<br><br>\- Thống kê chuyến ĐI từ Đà Nẵng = Tàu Xuất phát + Tàu Trung gian.<br><br>\- Phân tích cơ cấu lưu lượng: tỷ lệ Trung gian / Xuất phát / Điểm cuối.<br><br>\- Tỷ lệ đúng giờ, số chuyến trễ theo loại tàu.<br><br>\- Tỷ lệ tận dụng đường ray và các điểm nghẽn lịch trình. |
| **2.** | **Actors** | Ban Quản lý Nhà ga |
| **3.** | **Input** | Ban Quản lý đã đăng nhập.<br><br>Tiêu chí: khoảng thời gian (ngày/tuần/tháng), loại thống kê, loại tàu cần lọc. |
| **4.** | **Output** | Báo cáo ĐẾN: tổng chuyến đến = Điểm cuối + Trung gian, tỷ lệ đúng giờ của từng loại.<br><br>Báo cáo ĐI: tổng chuyến đi = Xuất phát + Trung gian, tỷ lệ đúng giờ của từng loại.<br><br>Biểu đồ cơ cấu lưu lượng và tỷ lệ tận dụng đường ray theo loại tàu. |
| **5.** | **Basic flow** | 1\. Actor đăng nhập → Bắt đầu Usecase.<br><br>2\. Actor chọn chức năng "Xem báo cáo thống kê hiệu suất".<br><br>3\. Hệ thống hiển thị giao diện báo cáo với bộ lọc (ngày/tuần/tháng, loại tàu, loại thống kê).<br><br>4\. Actor chọn tiêu chí và nhấn "Xem báo cáo".<br><br>5\. Hệ thống hiển thị: tổng chuyến đến (phân loại), tổng chuyến đi (phân loại), tỷ lệ đúng giờ, biểu đồ cơ cấu, phân tích điểm nghẽn.<br><br>6\. Actor xem xét dữ liệu → Kết thúc Usecase. |
| **6.** | **Alternative flow** | 5a. Actor nhấn "Xuất báo cáo" (PDF/Excel) → Hệ thống tạo file (liên kết UC-14). |
| **7.** | **Exception flow** | 4\. Không có dữ liệu trong khoảng thời gian → Hệ thống thông báo "Không có dữ liệu trong khoảng thời gian này". |

Bảng đặc tả Usecase “xem và tra cứu báo cáo thống kê hiệu suất lịch trình”

Giao diện “Xem và tra cứu báo cáo thống kê hiệu suất lịch trình”

### Phê duyệt kế hoạch

|     |     |     |
| --- | --- | --- |
| **STT** | **Usecase name** | **Phê duyệt kế hoạch** |
| **1.** | **Description** | Ban Quản lý Nhà ga xem xét yêu cầu kế hoạch đặc biệt từ Nhân viên Điều hành và ra quyết định phê duyệt, từ chối hoặc yêu cầu bổ sung thông tin. |
| **2.** | **Actors** | Ban Quản lý Nhà ga |
| **3.** | **Input** | Ban Quản lý đã đăng nhập.<br><br>Nội dung kế hoạch đang ở trạng thái "Chờ phê duyệt".<br><br>Ý kiến của Ban Quản lý (phê duyệt / từ chối / yêu cầu bổ sung). |
| **4.** | **Output** | Hệ thống cập nhật trạng thái: Đã phê duyệt / Từ chối / Chờ bổ sung.<br><br>Hệ thống gửi thông báo kết quả đến Nhân viên Điều hành. |
| **5.** | **Basic flow** | 1\. Actor đăng nhập → Bắt đầu Usecase.<br><br>2\. Actor chọn chức năng "Phê duyệt kế hoạch".<br><br>3\. Hệ thống hiển thị danh sách kế hoạch đang chờ.<br><br>4\. Actor chọn kế hoạch và xem chi tiết nội dung.<br><br>5\. Actor nhập ý kiến và chọn "Phê duyệt" hoặc "Từ chối".<br><br>6\. Actor xác nhận quyết định.<br><br>7\. Hệ thống cập nhật trạng thái và gửi thông báo → Kết thúc Usecase. |
| **6.** | **Alternative flow** | 5a. Chọn "Yêu cầu bổ sung" → Hệ thống gửi yêu cầu đến NVĐH; kế hoạch sang trạng thái "Chờ bổ sung". |
| **7.** | **Exception flow** | 5\. Không nhập ý kiến bắt buộc → Hệ thống thông báo lỗi → Quay lại bước 5. |

Bảng đặc tả Usecase “Phê duyệt kế hoạch”

Giao diện Usecase “Phê duyệt kế hoạch”

### Xem danh sách kế hoạch chờ duyệt

|     |     |     |
| --- | --- | --- |
| **STT** | **Usecase name** | **Xem danh sách kế hoạch chờ duyệt** |
| **1.** | **Description** | Ban Quản lý Nhà ga xem tổng quan danh sách các kế hoạch đang chờ phê duyệt. |
| **2.** | **Actors** | Ban Quản lý Nhà ga |
| **3.** | **Input** | Ban Quản lý đã đăng nhập. |
| **4.** | **Output** | Danh sách kế hoạch "Chờ phê duyệt" kèm người gửi, thời gian gửi, mức độ ưu tiên. |
| **5.** | **Basic flow** | 1\. Actor đăng nhập → Bắt đầu Usecase.<br><br>2\. Actor chọn chức năng "Danh sách kế hoạch chờ duyệt".<br><br>3\. Hệ thống hiển thị danh sách xếp theo thứ tự thời gian gửi.<br><br>4\. Actor chọn kế hoạch để xem chi tiết hoặc chuyển sang UC-12 → Kết thúc Usecase. |
| **6.** | **Alternative flow** | 3a. Không có kế hoạch nào → Hệ thống thông báo "Không có kế hoạch đang chờ phê duyệt". |
| **7.** | **Exception flow** | 1\. Actor chưa đăng nhập → Hệ thống chuyển về trang đăng nhập. |

Bảng đặc tả Usecase “Xem danh sách kế hoạch chờ duyệt”

Gaio diện Usecase “Xem danh sách kế hoạch chờ duyệt”

### Tạo báo cáo lịch trình

|     |     |     |
| --- | --- | --- |
| **STT** | **Usecase name** | **Tạo báo cáo lịch trình** |
| **1.** | **Description** | Ban Quản lý Nhà ga xuất báo cáo lịch trình chính thức phục vụ lưu trữ và báo cáo cấp trên.<br><br>Báo cáo phải phản ánh đúng cơ cấu phân loại tàu: tổng chuyến đến (Điểm cuối + Trung gian), tổng chuyến đi (Xuất phát + Trung gian), chi tiết theo từng loại. |
| **2.** | **Actors** | Ban Quản lý Nhà ga |
| **3.** | **Input** | Ban Quản lý đã đăng nhập.<br><br>Thông số báo cáo: khoảng thời gian, loại tàu cần đưa vào, định dạng xuất (PDF / Excel). |
| **4.** | **Output** | File báo cáo theo định dạng yêu cầu, gồm: tổng chuyến đến/đi (phân loại), tỷ lệ đúng giờ, biểu đồ tận dụng đường ray.<br><br>Đường dẫn tải file. |
| **5.** | **Basic flow** | 1\. Actor đăng nhập → Bắt đầu Usecase.<br><br>2\. Actor chọn chức năng "Tạo báo cáo lịch trình".<br><br>3\. Actor chọn khoảng thời gian, loại tàu cần đưa vào và định dạng xuất.<br><br>4\. Actor nhấn "Tạo báo cáo".<br><br>5\. Hệ thống tổng hợp dữ liệu (phân theo loại tàu) và tạo file.<br><br>6\. Hệ thống hiển thị đường dẫn tải file → Kết thúc Usecase. |
| **6.** | **Alternative flow** | 4a. Nhấn "Xem trước" → Hệ thống hiển thị bản xem trước trước khi xuất file. |
| **7.** | **Exception flow** | 3\. Khoảng thời gian không hợp lệ → Hệ thống thông báo lỗi → Quay lại bước 3.<br><br>5\. Lỗi khi tạo file → Hệ thống thông báo và gợi ý thử lại. |

Bảng đặc tả Usecase “Tạo báo cáo lịch trình”

Giao diện Usecase “Tạo báo cáo lịch trình”

### Gửi chỉ đạo vận hành

|     |     |     |
| --- | --- | --- |
| **STT** | **Usecase name** | **Gửi chỉ đạo vận hành cho Nhân viên Điều hành** |
| **1.** | **Description** | Ban Quản lý Nhà ga gửi thông điệp chỉ đạo hoặc cảnh báo vận hành trực tiếp đến Nhân viên Điều hành. |
| **2.** | **Actors** | Ban Quản lý Nhà ga |
| **3.** | **Input** | Ban Quản lý đã đăng nhập.<br><br>Nội dung: tiêu đề, nội dung, mức độ ưu tiên, người nhận. |
| **4.** | **Output** | Hệ thống gửi thông báo đến NVĐH được chỉ định.<br><br>Hệ thống lưu lịch sử chỉ đạo. |
| **5.** | **Basic flow** | 1\. Actor đăng nhập → Bắt đầu Usecase.<br><br>2\. Actor chọn chức năng "Gửi chỉ đạo vận hành".<br><br>3\. Actor nhập tiêu đề, nội dung, chọn mức độ ưu tiên và người nhận.<br><br>4\. Actor nhấn "Gửi chỉ đạo".<br><br>5\. Hệ thống lưu và gửi thông báo ngay → Kết thúc Usecase. |
| **6.** | **Alternative flow** | 4a. Nhấn "Lưu nháp" → Hệ thống lưu tạm, chưa gửi. |
| **7.** | **Exception flow** | 3\. Thiếu tiêu đề hoặc nội dung → Hệ thống thông báo lỗi → Quay lại bước 3.<br><br>5\. Gửi thất bại → Hệ thống thông báo lỗi và lưu để gửi lại. |

Bảng đặc tả Usecase “Gửi chỉ đạo vận hành”

Giao diện Usecase “Gửi chỉ đạo vận hành”

### Xem và tra cứu thông tin nhân sự,nhật ký

|     |     |     |
| --- | --- | --- |
| **STT** | **Usecase name** | **Xem & tra cứu thông tin nhân sự** |
| **1.** | **Description** | Quản trị viên tra cứu thông tin toàn hệ thống: tài khoản, nhật ký hoạt động và cấu hình hệ thống. |
| **2.** | **Actors** | Quản trị viên |
| **3.** | **Input** | Quản trị viên đã đăng nhập.<br><br>Tiêu chí tra cứu (tài khoản / nhật ký / cấu hình, từ khóa). |
| **4.** | **Output** | Hệ thống hiển thị thông tin theo phân quyền Quản trị viên. |
| **5.** | **Basic flow** | 1\. Actor đăng nhập → Bắt đầu Usecase.<br><br>2\. Actor chọn mục tra cứu trên dashboard quản trị.<br><br>3\. Actor nhập điều kiện và nhấn "Tìm kiếm".<br><br>4\. Hệ thống trả về kết quả → Kết thúc Usecase. |
| **6.** | **Alternative flow** | 3a. Không nhập điều kiện → Hệ thống hiển thị toàn bộ danh sách. |
| **7.** | **Exception flow** | 1\. Chưa đăng nhập → Hệ thống chuyển về trang đăng nhập.<br><br>4\. Không có kết quả → Hệ thống thông báo "Không tìm thấy dữ liệu". |

Bảng đặc tả Usecase “Xem và tra cứu thông tin”

Giao diện Usecase “Xem và tra cứu thông tin nhân sự”

Giao diện Usecase “Xem và tra cứu thông tin nhật kí”

### Thiết lập thông tin chuyến tàu

|     |     |     |
| --- | --- | --- |
| **STT** | **Usecase name** | **Thiết lập thông tin chuyến tàu** |
| **1.** | **Description** | Quản trị viên cấu hình dữ liệu nền (master data) về đoàn tàu, tuyến đường và danh sách ga dừng.<br><br>Đặc biệt, mỗi chuyến tàu phải được cấu hình "Vai trò tại Ga Đà Nẵng":<br><br>\- Trung gian: Đà Nẵng là ga dừng giữa hành trình → có cả sự kiện đến lẫn đi.<br><br>\- Xuất phát: Đà Nẵng là ga khởi hành → chỉ có sự kiện đi.<br><br>\- Điểm cuối: Đà Nẵng là ga kết thúc → chỉ có sự kiện đến.<br><br>Trường vai trò này quyết định form nhập liệu lịch trình và công thức thống kê . |
| **2.** | **Actors** | Quản trị viên |
| **3.** | **Input** | Quản trị viên đã đăng nhập.<br><br>Dữ liệu chuyến tàu: mã tàu, loại tàu, tuyến đường, danh sách ga dừng, thời gian dự kiến tại từng ga.<br><br>Vai trò tại Ga Đà Nẵng: Trung gian / Xuất phát / Điểm cuối (bắt buộc). |
| **4.** | **Output** | Hệ thống lưu thông tin chuyến tàu kèm vai trò tại Ga Đà Nẵng.<br><br>Dữ liệu khả dụng ngay cho UC-03 (lập lịch) và UC-11 (thống kê). |
| **5.** | **Basic flow** | 1\. Actor đăng nhập → Bắt đầu Usecase.<br><br>2\. Actor chọn chức năng "Thiết lập thông tin chuyến tàu".<br><br>3\. Hệ thống hiển thị danh sách chuyến tàu kèm cột "Vai trò tại Ga ĐN".<br><br>4a. Thêm mới: Nhấn "Thêm" → Điền đầy đủ thông tin, bắt buộc chọn vai trò → Nhấn "Lưu".<br><br>4b. Chỉnh sửa: Chọn chuyến → Sửa thông tin (kể cả vai trò) → Nhấn "Lưu".<br><br>4c. Xóa: Chọn chuyến → Nhấn "Xóa" → Xác nhận.<br><br>5\. Hệ thống kiểm tra và lưu thay đổi → Kết thúc Usecase. |
| **6.** | **Alternative flow** | 4b. Thay đổi vai trò từ Trung gian sang Xuất phát/Điểm cuối → Hệ thống cảnh báo ảnh hưởng đến lịch trình đang hoạt động và đề xuất kiểm tra lại UC-03. |
| **7.** | **Exception flow** | 4\. Không chọn vai trò tại Ga Đà Nẵng → Hệ thống thông báo "Vai trò tại Ga Đà Nẵng là trường bắt buộc" → Quay lại bước 4.<br><br>4\. Mã tàu trùng lặp → Hệ thống thông báo lỗi → Quay lại bước 4. |

Bảng đặc tả Usecase “Thiết lập thông tin chuyến tàu”

Giao diện Usecase “Thiết lập thông tin chuyến tàu”

### Thiết lập thông tin hạ tầng ga/tuyến

|     |     |     |
| --- | --- | --- |
| **STT** | **Usecase name** | **Thiết lập thông tin hạ tầng ga/tuyến** |
| **1.** | **Description** | Quản trị viên quản lý thông tin hạ tầng vật lý của nhà ga (đường ray, tuyến đường, sơ đồ sân ga). |
| **2.** | **Actors** | Quản trị viên |
| **3.** | **Input** | Quản trị viên đã đăng nhập.<br><br>Dữ liệu hạ tầng: danh sách đường ray (1, 2, 3...), trạng thái (hoạt động/bảo trì), tuyến đường, ga trung gian. |
| **4.** | **Output** | Hệ thống cập nhật thông tin hạ tầng vào cơ sở dữ liệu.<br><br>Thay đổi ảnh hưởng trực tiếp đến UC-04 (điều phối đường ray). |
| **5.** | **Basic flow** | 1\. Actor đăng nhập → Bắt đầu Usecase.<br><br>2\. Actor chọn chức năng "Thiết lập hạ tầng ga/tuyến".<br><br>3\. Hệ thống hiển thị sơ đồ hạ tầng và danh sách đường ray.<br><br>4\. Actor thêm/sửa/xóa thông tin đường ray hoặc tuyến đường.<br><br>5\. Actor nhấn "Lưu" → Hệ thống kiểm tra và lưu thay đổi → Kết thúc Usecase. |
| **6.** | **Alternative flow** | 4a. Đánh dấu đường ray "Bảo trì" → Hệ thống loại ray này khỏi danh sách phân bổ trong UC-04. |
| **7.** | **Exception flow** | 4\. Xóa đường ray đang có cửa sổ chiếm ray được phân bổ → Hệ thống từ chối và thông báo danh sách chuyến tàu bị ảnh hưởng. |

Bảng đặc tả Usecase “Thiết lập thông tin hạ tầng ga/tuyến”

Giao diện Usecase “Thiết lập thông tin hạ tầng ga/tuyến”

### Xây dựng quy trình phê duyệt và các quy tắc nghiệp vụ hệ thống

|     |     |     |
| --- | --- | --- |
| **STT** | **Usecase name** | **Xây dựng quy trình phê duyệt và các quy tắc nghiệp vụ hệ thống** |
| **1.** | **Description** | Quản trị viên cấu hình các quy tắc nghiệp vụ hệ thống.<br><br>Các quy tắc quan trọng liên quan đến phân loại tàu và xung đột:<br><br>\- Thời gian đệm tối thiểu sau mỗi loại tàu (mặc định 15 phút, có thể tùy chỉnh theo loại).<br><br>\- Thời gian lên tàu tối thiểu cho Tàu xuất phát (mặc định 30 phút trước giờ đi).<br><br>\- Thời gian dừng đỗ tối thiểu cho Tàu điểm cuối (mặc định 20 phút sau giờ đến).<br><br>\- Quy trình phê duyệt cho kế hoạch đặc biệt.<br><br>\- Ngưỡng cảnh báo trễ tàu, thời hạn đồng bộ bảng LED. |
| **2.** | **Actors** | Quản trị viên |
| **3.** | **Input** | Quản trị viên đã đăng nhập.<br><br>Thông số quy tắc: thời gian đệm (phút) theo từng loại tàu, thời gian lên tàu tối thiểu, thời gian dừng đỗ tối thiểu, số cấp phê duyệt... |
| **4.** | **Output** | Hệ thống lưu và áp dụng quy tắc mới vào vận hành ngay.<br><br>Hệ thống ghi nhật ký thay đổi quy tắc. |
| **5.** | **Basic flow** | 1\. Actor đăng nhập → Bắt đầu Usecase.<br><br>2\. Actor chọn chức năng "Quy trình phê duyệt & Quy tắc nghiệp vụ".<br><br>3\. Hệ thống hiển thị danh sách quy tắc kèm giá trị hiện tại, phân nhóm theo loại tàu.<br><br>4\. Actor chọn quy tắc cần chỉnh sửa và thay đổi thông số.<br><br>5\. Actor nhấn "Lưu" → Hệ thống kiểm tra, lưu và áp dụng → Kết thúc Usecase. |
| **6.** | **Alternative flow** | 4a. Xem nhật ký lịch sử thay đổi → Hệ thống hiển thị danh sách thay đổi theo thứ tự thời gian. |
| **7.** | **Exception flow** | 4\. Thông số không hợp lệ (ví dụ: thời gian đệm < 0) → Hệ thống thông báo lỗi → Quay lại bước 4. |

Bảng đặc tả Usecase “Xây dựng quy trình phê duyệt và các quy tắc nghiệp vụ hệ thống”

Giao diện Usecase “Xây dựng quy trình phê duyệt và các quy tắc nghiệp vụ hệ thống”

### Thiết lập và cập nhật tài khoản

|     |     |     |
| --- | --- | --- |
| **STT** | **Usecase name** | **Thiết lập và cập nhật tài khoản** |
| **1.** | **Description** | Quản trị viên tạo mới, chỉnh sửa, phân quyền hoặc vô hiệu hóa tài khoản người dùng theo RBAC. |
| **2.** | **Actors** | Quản trị viên |
| **3.** | **Input** | Quản trị viên đã đăng nhập.<br><br>Thông tin tài khoản: họ tên, email, vai trò (NVĐH / NVNG / BQL), trạng thái. |
| **4.** | **Output** | Hệ thống lưu tài khoản mới hoặc cập nhật.<br><br>Hệ thống gửi email thông báo khi tạo mới hoặc reset mật khẩu. |
| **5.** | **Basic flow** | 1\. Actor đăng nhập → Bắt đầu Usecase.<br><br>2\. Actor chọn chức năng "Quản lý tài khoản".<br><br>3\. Hệ thống hiển thị danh sách tài khoản với vai trò và trạng thái.<br><br>4a. Tạo mới: Nhấn "Thêm" → Điền họ tên, email, vai trò → Nhấn "Tạo".<br><br>4b. Chỉnh sửa: Chọn tài khoản → Sửa thông tin/vai trò → Nhấn "Lưu".<br><br>4c. Vô hiệu hóa: Chọn tài khoản → Nhấn "Vô hiệu hóa" → Xác nhận.<br><br>5\. Hệ thống lưu thay đổi; gửi email thông báo nếu tạo mới → Kết thúc Usecase. |
| **6.** | **Alternative flow** | 4b. Chọn "Reset mật khẩu" → Hệ thống tạo mật khẩu tạm và gửi email. |
| **7.** | **Exception flow** | 4\. Email tài khoản đã tồn tại → Hệ thống thông báo "Email đã được sử dụng" → Quay lại bước 4.<br><br>4\. Thiếu thông tin bắt buộc → Hệ thống thông báo lỗi → Quay lại bước 4. |

Bảng đặc tả Usecase “Thiết lập và cập nhật tài khoản”

Giao diện Usecase “Thiết lập tài khoản”

Giao diện Usecase “Thiết lập tài khoản”

## Thiết kế ERD

### Sơ Đồ ERD

Sơ đồ ERD

### Bảng TAI_KHOAN

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| --- | --- | --- | --- |
| ma_tai_khoan | VARCHAR(20) | PK ,NN | Mã tài khoản |
| quyen_truy_cap | VARCHAR(30) | NN,<br><br>CK IN ('QUAN_TRI_VIEN', 'NHAN_VIEN_DIEU_HANH', 'NHAN_VIEN_NHA_GA', 'BAN_QUAN_LY') | Quyền truy cập |
| ho_ten | NVARCHAR(150) | NN  | Họ và tên |
| email | VARCHAR(100) | UQ , NN | Email đăng nhập |
| so_dien_thoai | VARCHAR(15) | UQ  | Số điện thoại |
| mat_khau | VARCHAR(255) | NN  | Mật khẩu |
| gioi_tinh | ENUM('NAM','NU',<br><br>'KHAC') | NN  | Giới tính |
| ngay_sinh | DATE | CK ngay_sinh < CURDATE() | Ngày sinh |
| trang_thai | VARCHAR(20) | NN , DF 'CHO_XAC_NHAN'  <br>CK: IN ('HOAT_DONG', 'KHOA', 'CHO_XAC_NHAN') | Trạng thái tài khoản |
| ngay_tao | DATETIME | NN , DF CURRENT_TIMESTAMP | Ngày tạo |
| ngay_cap_nhat | DATETIME | DF CURRENT_TIMESTAMP ON UPDATE | Ngày cập nhật |

### Bảng TAU

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| --- | --- | --- | --- |
| ma_tau | VARCHAR(20) | PK , NN | Mã đoàn tàu (SE1, SE2…) |
| ten_tau | NVARCHAR(100) | UQ , NN | Tên tàu |
| loai_tau | VARCHAR(20) | NN  <br>CK IN ('TAU_NHANH', 'TAU_KHACH', 'TAU_HANG') | Loại tàu |
| so_toa | INT | NN , CK so_toa > 0 | Số lượng toa |
| suc_chua_hanh_khach | INT | NN , CK suc_chua > 0 | Sức chứa hành khách |
| trang_thai | VARCHAR(20) | NN ,DF 'HOAT_DONG'  <br>CK IN ('HOAT_DONG', 'BAO_TRI', 'NGHI_HOAT_DONG') | Trạng thái đoàn tàu |
| ngay_tao | DATETIME | NN,DF CURRENT_TIMESTAMP | Ngày tạo |
| ngay_cap_nhat | DATETIME | DF CURRENT_TIMESTAMP ON UPDATE | Ngày cập nhật |

### Bảng TUYEN_DUONG

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| --- | --- | --- | --- |
| ma_tuyen | VARCHAR(20) | PK , NN | Mã tuyến đường |
| ten_tuyen | NVARCHAR(200) | UQ , NN | Tên tuyến đường |
| ma_ga_dau | VARCHAR(20) | NN ,<br><br>FK → GA(ma_ga) | Ga đầu tuyến |
| ma_ga_cuoi | VARCHAR(20) | NN ,<br><br>FK → GA(ma_ga) | Ga cuối tuyến |
| khoang_cach_km | DECIMAL(8,2) | NN ,CK khoang_cach_km > 0 | Khoảng cách (km) |
| trang_thai | VARCHAR(20) | NN , DF 'HOAT_DONG'  <br>CK IN ('HOAT_DONG', 'DUNG') | Trạng thái tuyến |
| ngay_tao | DATETIME | NN,DF CURRENT_TIMESTAMP | Ngày tạo |

### Bảng GA

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| --- | --- | --- | --- |
| ma_ga | VARCHAR(20) | PK , NN | Mã nhà ga |
| ten_ga | NVARCHAR(150) | UQ ,NN | Tên nhà ga |
| dia_chi | NVARCHAR(300) | NN  | Địa chỉ nhà ga |
| thu_tu_tren_tuyen | INT | NN , CK thu_tu > 0 | Thứ tự ga trên tuyến |
| trang_thai | VARCHAR(20) | NN ,DF 'HOAT_DONG'  <br>CK IN ('HOAT_DONG', 'DUNG') | Trạng thái |
| ngay_tao | DATETIME | NN , DF CURRENT_TIMESTAMP | Ngày tạo |

### Bảng GA_TUYEN

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| --- | --- | --- | --- |
| ma_ga | VARCHAR(20) | PK, FK → GA(ma_ga) | Mã nhà ga |
| ma_tuyen | VARCHAR(20) | PK,<br><br>FK →TUYEN_DUONG(ma_tuyen) | Mã tuyến đường |
| thu_tu_tren_tuyen | INT | NN, CK > 0 | Thứ tự ga trên tuyến |
| khoang_cach_tu_dau_km | DECIMAL(8,2) | NN, CK >= 0 | Khoảng cách tính từ ga đầu tuyến (km) |
| thoi_gian_dung_phut | INT | NN, CK >= 0, DF 0 | Thời gian tàu dừng tại ga (phút) |
| ngay_tao | DATETIME | NN, DF CURRENT_TIMESTAMP | Ngày tạo |

### Bảng CHUYEN_TAU

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| --- | --- | --- | --- |
| ma_chuyen_tau | VARCHAR(20) | PK ,NN | Mã chuyến tàu (SE1…) |
| ma_tau | VARCHAR(20) | NN,<br><br>FK → TAU(ma_tau) | Mã đoàn tàu |
| ma_tuyen | VARCHAR(20) | NN, FK→TUYEN_DUONG<br><br>(ma_tuyen) | Mã tuyến đường |
| vai_tro_tai_da_nang | VARCHAR(20) | NN,<br><br>CK IN ('TRUNG_GIAN', 'XUAT_PHAT', 'DIEM_CUOI') | Vai trò tại Ga Đà Nẵng |
| gio_den_du_kien | TIME | NULL (nếu là tàu xuất phát) | Giờ đến dự kiến |
| gio_di_du_kien | TIME | NULL ( nếu là tàu điểm cuối) | Giờ đi dự kiến |
| ngay_chay | VARCHAR(30) | NN  | Ngày tàu chạy |
| trang_thai | VARCHAR(20 | NN ,DF 'HOAT_DONG'  <br>CK IN ('HOAT_DONG', 'DUNG') | Trạng thái chuyến |
| ngay_tao | DATETIME | NN, DF CURRENT_TIMESTAMP | Ngày tạo |
| ngay_cap_nhat | DATETIME | DF CURRENT_TIMESTAMP ON UPDATE | Ngày cập nhật |

### Bảng DUONG_RAY

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| --- | --- | --- | --- |
| ma_ray | VARCHAR(20) | PK ,NN | Mã đường ray |
| ma_ga | VARCHAR(20) | NN<br><br>FK → GA(ma_ga) | Mã ga |
| so_ray | INT | UQ ,NN,CK so_ray > 0 | Số thứ tự đường ray |
| chieu_dai_ray | DECIMAL(7,2) | NN ,CK chieu_dai_m > 0 | Chiều dài đường ray (m) |
| trang_thai | VARCHAR(20) | NN ,DF 'SAN_SANG'  <br>CK IN ('SAN_SANG',  <br>'DANG_SU_DUNG',  <br>'PHONG_TOA_TAM',  <br>'PHONG_TOA_CUNG') | Trạng thái đường ray |
| ghi_chu | NVARCHAR(500) | NULL | Ghi chú |
| ngay_tao | DATETIME | NN , DF CURRENT_TIMESTAMP | Ngày tạo |
| ngay_cap_nhat | DATETIME | DF CURRENT_TIMESTAMP ON UPDATE | Ngày cập nhật |
| thoi_gian_xu_<br><br>ly_uoc_tinh | INT | NULL, CK >= 0 | Thời gian xử lý ước tính (phút) cho PHONG_TOA_TAM |
| thoi_gian_<br><br>phong_toa_<br><br>uoc_tinh | INT | NULL | NULL khi PHONG_TOA_CUNG (không thể dự đoán) |

### Bảng LICH_TRINH

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| --- | --- | --- | --- |
| ma_lich_trinh | VARCHAR(20) | PK ,NN | Mã lịch trình |
| ma_chuyen_tau | VARCHAR(20) | NN FK→CHUYEN_TAU(ma_chuyen_tau) | Mã chuyến tàu |
| ma_ray | VARCHAR(20) | FK → DUONG_RAY(ma_ray) | Đường ray phân bổ |
| ma_nguoi_cap_nhat | VARCHAR(20) | FK → TAI_KHOAN(ma_tai_khoan) | Người cập nhật |
| ma_su_co_anh_huong | VARCHAR(20) | NULL, FK → SU_CO(ma_su_co) | Sự cố ảnh hưởng đến lịch trình này |
| ngay_chay | DATETIME | NN  | Ngày vận hành |
| gio_den_du_kien | DATETIME | NN,  <br>CK gio_den_du_kien >ngay_chay | Giờ đến dự kiến |
| gio_di_du_kien | DATETIME | NN,<br><br>CK gio_di_du_kien>gio_den_du_kien | Giờ đi dự kiến |
| gio_den_thuc_te | DATETIME | NULL,<br><br>CK gio_den_thuc_te > ngay_chay | Giờ đến thực tế |
| gio_di_thuc_te | DATETIME | NULL,<br><br>CK gio_di_thuc_te > gio_den_thuc_te | Giờ đi thực tế |
| so_phut_tre | INT | NN , DF , CK 0 \| so_phut_tre >= 0 | Số phút trễ thực tế |
| trang_thai | VARCHAR(20) | NN, DF 'CHO_XAC_NHAN'  <br>CK IN (  <br>'CHO_XAC_NHAN'  <br>'DA_XAC_NHAN', 'DANG_VAO_GA','DUNG_TAI_GA', 'DA_ROI_GA',  <br>'HUY_CHUYEN') | Trạng thái lịch trình |
| phuong_an_xu_ly | VARCHAR(20) | NULL, DF 'CHO_RAY', CK IN ('CHO_RAY','DOI_RAY','HUY_CHUYEN') | Phương án xử lý khi bị phong tỏa |
| ngay_tao | DATETIME | NN,DF CURRENT_TIMESTAMP | Ngày tạo |
| ngay_cap_nhat | DATETIME | DF,CURRENT_TIMESTAMP ON UPDATE | Ngày cập nhật |

### Bảng SU_CO

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| --- | --- | --- | --- |
| ma_su_co | VARCHAR(20) | PK ,NN | Mã sự cố |
| ma_lich_trinh | VARCHAR(20) | NN,<br><br>FK→LICH_TRINH(ma_lich_trinh) | Lịch trình liên quan |
| ma_nguoi_ghi_nhan | VARCHAR(20) | NN,<br><br>FK→TAI_KHOAN(ma_tai_khoan) | Người ghi nhận |
| ma_ray | VARCHAR(20) | NULL, FK → DUONG_RAY(ma_ray) | Ray bị ảnh hưởng bởi sự cố |
| kich_hoat_phong_toa | BIT | NN, DF 0 | Kích hoạt PHONG_TOA_CUNG thủ công (1=có) |
| loai_su_co | VARCHAR(20) | NN,  <br>CK IN ('TRE_TAU','HUY_CHUYEN',  <br>'HOA_HOAN',  <br>'SU_CO_KY_THUAT','KHAC') | Loại sự cố |
| mo_ta | NVARCHAR(1000) | NN  | Mô tả chi tiết |
| muc_do | VARCHAR(20) | NN , DF 'TRUNG_BINH'  <br>CK IN ('THAP','TRUNG_BINH','CAO',  <br>'KHAN_CAP') | Mức độ nghiêm trọng |
| trang_thai_xu_ly | VARCHAR(20) | NN,DF 'CHUA_XU_LY'  <br>CK IN ('CHUA_XU_LY','DANG_XU_LY','DA_XU_LY') | Trạng thái xử lý |
| ngay_xay_ra | DATETIME | NN  | Thời điểm xảy ra |
| ngay_xu_ly | DATETIME | NULL  <br>CK ngay_xu_ly >= ngay_xay_ra | Thời điểm xử lý xong |
| ngay_tao | DATETIME | NN , DF CURRENT_TIMESTAMP | Ngày tạo |

### Bảng KE_HOACH_DAC_BIET

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| --- | --- | --- | --- |
| ma_ke_hoach | VARCHAR(20) | PK ,NN | Mã kế hoạch |
| ma_nguoi_gui | VARCHAR(20) | NN, FK→TAI_KHOAN(ma_tai_khoan) | NV Điều hành gửi đề xuất |
| ma_nguoi_  <br>duyet | VARCHAR(20) | FK→TAI_KHOAN(ma_tai_  <br>khoan) | Người phê duyệt (BQL) |
| ma_lich_trinh | VARCHAR(20) | FK→LICH_TRINH(ma_lich_trinh) | Lịch trình liên quan |
| tieu_de | NVARCHAR(300) | NN  | Tiêu đề kế hoạch |
| noi_dung | NVARCHAR(2000) | NN  | Nội dung đề xuất |
| muc_do_uu_  <br>tien | VARCHAR(20) | NN , DF 'BINH_THUONG'  <br>CK IN ('THAP','BINH_THUONG','CAO','KHAN_CAP') | Mức độ ưu tiên |
| trang_thai | VARCHAR(20) | NN , DF 'CHO_PHE_DUYET'  <br>CK IN (  <br>'CHO_PHE_DUYET',  <br>'DA_PHE_DUYET',  <br>'TU_CHOI',  <br>'CHO_BO_SUNG') | Trạng thái phê duyệt |
| y_kien_duyet | NVARCHAR(1000) | NULL | Ý kiến của BQL |
| ngay_gui | DATETIME | NN,DF CURRENT_TIMESTAMP | Ngày gửi yêu cầu |
| ngay_duyet | DATETIME | CK ngay_duyet >= ngay_gui | Ngày phê duyệt / từ chối |

### Bảng NHAT_KY

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| --- | --- | --- | --- |
| ma_nhat_ky | VARCHAR(20) | PK , NN | Mã nhật ký |
| ma_tai_khoan | VARCHAR(20) | NN,<br><br>FK→TAI_KHOAN(ma_tai_khoan) | Tài khoản thực hiện |
| hanh_dong | NVARCHAR(200) | NN  | Hành động (SUA_GIO, DOI_RAY…) |
| doi_tuong | VARCHAR(100) | NN  | Bảng / đối tượng bị tác động |
| ma_doi_tuong | VARCHAR(50) | NULL | Mã bản ghi bị tác động |
| noi_dung_cu | NVARCHAR(2000) | NULL | Nội dung trước khi thay đổi |
| noi_dung_moi | NVARCHAR(2000) | NULL | Nội dung sau khi thay đổi |
| dia_chi_ip | VARCHAR(45) | NN  | Địa chỉ IP thực hiện |
| thoi_gian | DATETIME | NN .DF CURRENT_TIMESTAMP | Thời điểm thực hiện (hậu kiểm) |

### Bảng CHI_DAO

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| --- | --- | --- | --- |
| ma_chi_dao | VARCHAR(20) | PK ,NN | Mã chỉ đạo |
| ma_nguoi_  <br>gui | VARCHAR(20) | NN,<br><br>FK→TAI_KHOAN(ma_tai_khoan) | Ban Quản lý gửi |
| ma_nguoi_  <br>nhan | VARCHAR(20) | NN, FK→TAI_KHOAN(ma_tai_khoan) | NV Điều hành nhận |
| tieu_de | NVARCHAR(300) | NN  | Tiêu đề chỉ đạo |
| noi_dung | NVARCHAR(2000) | NN  | Nội dung chỉ đạo vận hành |
| muc_do_uu_tien | VARCHAR(20) | NN , DF 'BINH_THUONG'  <br>CK IN ('THAP',  <br>'BINH_THUONG','CAO',  <br>'KHAN_CAP') | Mức độ ưu tiên |
| trang_thai | VARCHAR(20) | NN , DF 'DA_GUI'  <br>CK IN ('NHAP',  <br>'DA_GUI',  <br>'DA_DOC') | Trạng thái chỉ đạo |
| ngay_gui | DATETIME | NN DF CURRENT_TIMESTAMP | Ngày gửi |
| ngay_doc | DATETIME | CK ngay_doc >= ngay_gui | Ngày người nhận đọc |