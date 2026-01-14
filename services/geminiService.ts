
import { GoogleGenAI } from "@google/genai";

// Initialization moved inside functions to ensure process.env.API_KEY is current

export const generateSRSContent = async (featureName: string) => {
  // Create a new GoogleGenAI instance right before making an API call to ensure it uses the most up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Hãy đóng vai một BA chuyên nghiệp. Soạn thảo tài liệu "ĐẶC TẢ YÊU CẦU PHẦN MỀM" (SRS) cho chức năng "${featureName}".

YÊU CẦU HỆ THỐNG:
- Phân tách tuyệt đối 2 vai trò: ADMIN (Quản trị) và USER (Thao tác).
- Admin: Cấu hình hệ thống, Quản lý định mức Quota, Phân quyền Folder, Giám sát an ninh.
- User: Sử dụng tài nguyên được cấp, Upload/Download/Xem file theo quyền hạn được Admin thiết lập.

NỘI DUNG TÀI LIỆU:
1. MÔ TẢ TỔNG QUAN: Mục tiêu của module ${featureName}.
2. QUYỀN HẠN CHI TIẾT: So sánh rõ rệt khả năng của Admin vs User.
3. CÁC TÍNH NĂNG CỐT LÕI: Mô tả luồng nghiệp vụ của Upload, Download, Preview và Mapping.
4. YÊU CẦU PHI CHỨC NĂNG: Bảo mật dữ liệu, Tốc độ phản hồi.
5. PHÊ DUYỆT TÀI LIỆU.

Văn phong: Tiếng Việt, chuyên nghiệp, súc tích, trình bày Markdown đẹp.`,
      config: { temperature: 0.2 }
    });
    return response.text;
  } catch (error) {
    return "# Lỗi\nKhông thể tạo tài liệu SRS vào lúc này.";
  }
};

export const generateBRDContent = async (featureName: string) => {
  // Create a new GoogleGenAI instance right before making an API call to ensure it uses the most up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Hãy đóng vai một Chuyên gia tư vấn giải pháp. Soạn thảo tài liệu "YÊU CẦU NGHIỆP VỤ" (BRD) cho chức năng "${featureName}".

YÊU CẦU NỘI DUNG:
- Nhấn mạnh vào GIÁ TRỊ KINH DOANH khi sử dụng mô hình 2 vai trò Admin/User để quản lý dữ liệu.
- Các mục chính:
  I. BỐI CẢNH DỰ ÁN: Sự cần thiết của quản lý tệp tin tập trung.
  II. MỤC TIÊU CHIẾN LƯỢC: Bảo vệ tài sản số, Tối ưu chi phí hạ tầng.
  III. PHÂN TÍCH ĐỐI TƯỢNG: Tại sao cấu trúc Admin/User là tối ưu cho doanh nghiệp?
  IV. CHỈ SỐ THÀNH CÔNG (KPI): Hiệu suất làm việc, Mức độ rò rỉ dữ liệu (0%).
  V. KẾ HOẠCH TRIỂN KHAI.
  VI. XÁC NHẬN.

Văn phong: Tiếng Việt, trang trọng, hướng tới ban lãnh đạo (C-level).`,
      config: { temperature: 0.3 }
    });
    return response.text;
  } catch (error) {
    return "# Lỗi\nKhông thể tạo tài liệu BRD vào lúc này.";
  }
};

export const analyzeUserSecurity = async (userData: any) => {
  // Create a new GoogleGenAI instance right before making an API call to ensure it uses the most up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Phân tích bảo mật cho user: ${JSON.stringify(userData)}. Phản hồi tiếng Việt cực ngắn (dưới 60 từ), chỉ ra 1 rủi ro và 1 hành động khuyến nghị.`,
    });
    return response.text;
  } catch (error) { return "Lỗi phân tích."; }
};

export const suggestUserRole = async (department: string, description: string) => {
  // Create a new GoogleGenAI instance right before making an API call to ensure it uses the most up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Dựa trên phòng ban "${department}" và mô tả công việc "${description}", hãy gợi ý vai trò hệ thống: QUẢN TRỊ VIÊN hay NGƯỜI DÙNG. Giải thích lý do trong 1 câu ngắn gọn tiếng Việt.`,
    });
    return response.text;
  } catch (error) { return "Không thể gợi ý."; }
};
