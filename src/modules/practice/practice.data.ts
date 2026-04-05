import type { PracticeScenario } from "@/modules/practice/practice.types";

export const practiceScenarios: PracticeScenario[] = [
  {
    id: "facebook-cold-traffic-diagnostic",
    slug: "facebook-cold-traffic-diagnostic",
    title: "Facebook Ads Cold Traffic Diagnostic",
    summary:
      "Phân tích một campaign cold traffic đang có CPM tăng, CTR giảm và ROAS tụt để chọn hướng tối ưu đúng thứ tự.",
    platform: "FACEBOOK_ADS",
    difficulty: "BEGINNER",
    durationMinutes: 12,
    passingScore: 70,
    tags: ["CTR", "CPM", "ROAS", "Creative", "Audience"],
    recommendedFor: "Người mới cần luyện tư duy đọc chỉ số trước khi scale ngân sách.",
    objective:
      "Chọn được action ưu tiên đầu tiên dựa trên data thay vì chỉnh quá nhiều biến cùng lúc.",
    context:
      "Một campaign conversion cho khóa học Facebook Ads đang chạy 5 ngày. Team báo đơn giảm rõ rệt nhưng chưa biết nên sửa creative, audience hay landing page trước.",
    constraints: [
      "Không tăng thêm ngân sách trong 48 giờ tới.",
      "Chỉ được ưu tiên một nhánh tối ưu chính trong vòng kiểm thử tiếp theo.",
      "Landing page vừa được dev xác nhận không có lỗi tracking mới.",
    ],
    metrics: [
      {
        label: "CTR",
        value: "0.78%",
        note: "Giảm từ 1.34% của 7 ngày trước.",
      },
      {
        label: "CPM",
        value: "118,000đ",
        note: "Tăng 27% so với tuần trước.",
      },
      {
        label: "CPC",
        value: "15,100đ",
        note: "Tăng mạnh do CTR giảm nhanh hơn CPM tăng.",
      },
      {
        label: "Conversion Rate",
        value: "5.9%",
        note: "Gần như giữ nguyên ở landing page.",
      },
      {
        label: "ROAS",
        value: "1.42",
        note: "Dưới ngưỡng an toàn 2.0 của campaign này.",
      },
    ],
    questions: [
      {
        id: "fb-q1",
        prompt: "Action ưu tiên đầu tiên nên là gì?",
        description:
          "Bạn cần chọn hướng xử lý có khả năng tác động đúng vào nút thắt lớn nhất theo bộ chỉ số hiện tại.",
        options: [
          {
            id: "fb-q1-a",
            label: "Tăng ngân sách 20% để kéo thêm Conversion volume.",
            explanation: "Sai. Khi CTR và ROAS đang xấu đi, tăng ngân sách chỉ phóng to vấn đề hiện tại.",
            isCorrect: false,
          },
          {
            id: "fb-q1-b",
            label: "Làm mới creative angle và hook trước, sau đó giữ audience ổn định để đo.",
            explanation:
              "Đúng. CTR giảm là tín hiệu rất rõ ở lớp creative/message, trong khi Conversion Rate ở landing page chưa xấu đi nhiều.",
            isCorrect: true,
          },
          {
            id: "fb-q1-c",
            label: "Đổi luôn landing page để tăng Conversion Rate.",
            explanation:
              "Sai. Landing page chưa phải điểm gãy chính vì Conversion Rate vẫn khá ổn so với baseline.",
            isCorrect: false,
          },
          {
            id: "fb-q1-d",
            label: "Tắt toàn bộ campaign và launch lại từ đầu.",
            explanation:
              "Sai. Đây là phản ứng quá mạnh khi vẫn còn đủ data để chẩn đoán và test có kiểm soát.",
            isCorrect: false,
          },
        ],
      },
      {
        id: "fb-q2",
        prompt: "Metric nào củng cố mạnh nhất giả thuyết creative fatigue?",
        options: [
          {
            id: "fb-q2-a",
            label: "CTR giảm mạnh trong khi Conversion Rate landing page gần như đi ngang.",
            explanation:
              "Đúng. Đây là pattern thường thấy khi vấn đề nằm ở thông điệp/quảng cáo hơn là trang đích.",
            isCorrect: true,
          },
          {
            id: "fb-q2-b",
            label: "ROAS giảm vì chắc chắn Pixel bị lỗi.",
            explanation:
              "Sai. ROAS giảm không tự động đồng nghĩa Pixel lỗi, nhất là khi không có dấu hiệu tracking bất thường.",
            isCorrect: false,
          },
          {
            id: "fb-q2-c",
            label: "CPC tăng nghĩa là audience target đã sai hoàn toàn.",
            explanation:
              "Sai. CPC tăng ở đây chủ yếu bị kéo bởi CTR giảm, chưa đủ để kết luận audience sai hoàn toàn.",
            isCorrect: false,
          },
          {
            id: "fb-q2-d",
            label: "CPM tăng là bằng chứng duy nhất cho thấy creative đã cũ.",
            explanation:
              "Sai. CPM tăng có thể đến từ nhiều nguyên nhân, không phải chỉ riêng creative fatigue.",
            isCorrect: false,
          },
        ],
      },
      {
        id: "fb-q3",
        prompt: "Khi launch round test tiếp theo, cách setup nào hợp lý nhất cho MVP practice này?",
        options: [
          {
            id: "fb-q3-a",
            label: "Đổi creative, audience, bid strategy và landing page cùng lúc để ra kết quả nhanh.",
            explanation: "Sai. Đổi quá nhiều biến cùng lúc làm mất khả năng đọc nguyên nhân thật.",
            isCorrect: false,
          },
          {
            id: "fb-q3-b",
            label: "Giữ audience và landing page, chỉ test 2-3 creative angle mới với hook khác nhau.",
            explanation:
              "Đúng. Cách này giúp cô lập biến creative, phù hợp với giả thuyết đang mạnh nhất.",
            isCorrect: true,
          },
          {
            id: "fb-q3-c",
            label: "Nhân đôi ad set cũ và tăng budget cho tất cả ads đang chạy.",
            explanation:
              "Sai. Làm vậy không tạo ra learning mới nếu creative gốc đang yếu đi.",
            isCorrect: false,
          },
          {
            id: "fb-q3-d",
            label: "Chuyển objective sang Traffic để kéo CTR lên trước.",
            explanation:
              "Sai. Chuyển objective sẽ làm lệch intent và làm dữ liệu khó so sánh với campaign conversion.",
            isCorrect: false,
          },
        ],
      },
    ],
    reviewChecklist: [
      "Đọc chỉ số theo thứ tự: CTR -> CPC -> Conversion Rate -> ROAS.",
      "Nếu CTR gãy còn Conversion Rate giữ ổn định, ưu tiên kiểm tra creative/message trước.",
      "Không đổi nhiều biến cùng lúc khi đang chẩn đoán cold traffic.",
    ],
  },
  {
    id: "tiktok-creative-fatigue-rescue",
    slug: "tiktok-creative-fatigue-rescue",
    title: "TikTok Ads Creative Fatigue Rescue",
    summary:
      "Ra quyết định cứu một ad group TikTok Ads khi Hook Rate giảm nhanh, Frequency tăng và CPA vượt target.",
    platform: "TIKTOK_ADS",
    difficulty: "INTERMEDIATE",
    durationMinutes: 15,
    passingScore: 75,
    tags: ["Hook Rate", "Frequency", "CPA", "Creative Testing", "Retention"],
    recommendedFor: "Người đã chạy TikTok Ads cơ bản và muốn luyện tư duy tối ưu creative.",
    objective:
      "Biết phân biệt vấn đề do creative fatigue với vấn đề do funnel hoặc target sai.",
    context:
      "Một ad group promote workshop TikTok Ads đã chạy ổn 10 ngày. 3 ngày gần đây team sales báo lead vẫn có nhưng CPA tăng quá ngưỡng cho phép.",
    constraints: [
      "Không được dừng toàn bộ account trong ngày sale hiện tại.",
      "Phải giữ lead volume ở mức tối thiểu 70% so với hôm qua.",
      "Creative team chỉ có thể xuất 2 variation mới trong ngày.",
    ],
    metrics: [
      {
        label: "Hook Rate",
        value: "18%",
        note: "Giảm từ 31% trong 5 ngày trước.",
      },
      {
        label: "CTR",
        value: "0.91%",
        note: "Giảm đồng thời với Hook Rate.",
      },
      {
        label: "CPA",
        value: "214,000đ",
        note: "Vượt target 32%.",
      },
      {
        label: "Frequency",
        value: "2.9",
        note: "Tăng nhanh với cùng nhóm audience remarketing mở rộng.",
      },
      {
        label: "Landing Page CVR",
        value: "9.8%",
        note: "Chỉ giảm nhẹ so với baseline 10.4%.",
      },
    ],
    questions: [
      {
        id: "tt-q1",
        prompt: "Yếu tố nào đang là tín hiệu mạnh nhất cho thấy nên ưu tiên refresh creative?",
        options: [
          {
            id: "tt-q1-a",
            label: "Landing Page CVR giảm nhẹ 0.6 điểm.",
            explanation: "Sai. Mức giảm này chưa đủ lớn để coi landing page là điểm gãy chính.",
            isCorrect: false,
          },
          {
            id: "tt-q1-b",
            label: "Hook Rate và CTR cùng giảm trong khi Frequency tăng lên đáng kể.",
            explanation:
              "Đúng. Đây là cụm dấu hiệu kinh điển của creative fatigue hoặc message fatigue trên TikTok Ads.",
            isCorrect: true,
          },
          {
            id: "tt-q1-c",
            label: "CPA tăng thì chắc chắn cần đổi audience trước.",
            explanation:
              "Sai. CPA tăng là hệ quả, không tự động chỉ ra audience là nguyên nhân gốc.",
            isCorrect: false,
          },
          {
            id: "tt-q1-d",
            label: "Cứ giữ nguyên creative và giảm bid là đủ.",
            explanation:
              "Sai. Giảm bid không giải quyết được vấn đề khi creative đã mất khả năng giữ attention.",
            isCorrect: false,
          },
        ],
      },
      {
        id: "tt-q2",
        prompt: "Với constraint hiện tại, phương án test nào hợp lý nhất?",
        options: [
          {
            id: "tt-q2-a",
            label: "Tạo 2 variation mới với hook khác nhau, giữ CTA và landing page như cũ để so sánh sạch.",
            explanation:
              "Đúng. Đây là cách tạo learning nhanh nhất trong điều kiện resource creative hạn chế.",
            isCorrect: true,
          },
          {
            id: "tt-q2-b",
            label: "Đổi cùng lúc cả hook, offer, audience và landing page để tiết kiệm thời gian.",
            explanation:
              "Sai. Điều này phá hỏng khả năng đọc nguyên nhân và khiến learning không dùng lại được.",
            isCorrect: false,
          },
          {
            id: "tt-q2-c",
            label: "Tắt ad group hiện tại rồi chờ ngày mai creative xong mới chạy lại.",
            explanation:
              "Sai. Constraint yêu cầu vẫn phải giữ ít nhất 70% lead volume trong ngày sale.",
            isCorrect: false,
          },
          {
            id: "tt-q2-d",
            label: "Chuyển budget sang ad group khác dù chưa có creative mới để tránh lãng phí.",
            explanation:
              "Sai. Chuyển budget mù có thể giữ volume nhưng không tạo ra insight để cứu ad group đang xấu.",
            isCorrect: false,
          },
        ],
      },
      {
        id: "tt-q3",
        prompt: "Nếu variation mới giúp Hook Rate hồi phục nhưng CPA chưa về target, bước đọc tiếp theo là gì?",
        options: [
          {
            id: "tt-q3-a",
            label: "Kiểm tra lại click quality và bước chuyển đổi sau click trước khi kết luận campaign ổn.",
            explanation:
              "Đúng. Hook/CTR hồi phục chưa đủ, vẫn cần xem chất lượng traffic và hành vi sau click.",
            isCorrect: true,
          },
          {
            id: "tt-q3-b",
            label: "Tăng ngân sách ngay vì Hook Rate đã đẹp.",
            explanation:
              "Sai. CPA chưa về target thì scale ngay sẽ làm rủi ro tăng mạnh hơn.",
            isCorrect: false,
          },
          {
            id: "tt-q3-c",
            label: "Không cần xem thêm metric nào khác vì creative đã sửa xong.",
            explanation:
              "Sai. Practice của phase này là đọc flow đầy đủ chứ không dừng ở một chỉ số đẹp.",
            isCorrect: false,
          },
          {
            id: "tt-q3-d",
            label: "Kết luận audience sai hoàn toàn và thay toàn bộ target ngay.",
            explanation:
              "Sai. Chưa đủ bằng chứng để thay toàn bộ target khi mới chỉ thấy CPA chưa hồi đủ.",
            isCorrect: false,
          },
        ],
      },
    ],
    reviewChecklist: [
      "TikTok Ads nên ưu tiên đọc Hook Rate và CTR trước khi đụng vào bid.",
      "Frequency tăng cùng Hook Rate giảm là tín hiệu fatigue khá mạnh.",
      "Creative test tốt cần giữ nguyên phần còn lại của funnel để so sánh.",
    ],
  },
  {
    id: "cross-platform-budget-allocation",
    slug: "cross-platform-budget-allocation",
    title: "Cross-platform Budget Allocation",
    summary:
      "Quyết định phân bổ ngân sách giữa Facebook Ads và TikTok Ads khi hai kênh cho chất lượng lead khác nhau.",
    platform: "CROSS_PLATFORM",
    difficulty: "ADVANCED",
    durationMinutes: 18,
    passingScore: 80,
    tags: ["ROAS", "CPL", "Attribution", "Budget Allocation", "Lead Quality"],
    recommendedFor: "Người đã chạy đa kênh và muốn luyện tư duy phân bổ ngân sách theo chất lượng.",
    objective:
      "Không nhìn mỗi CPL bề mặt mà biết kết hợp chất lượng lead, close rate và ROAS thực tế.",
    context:
      "Team đang chạy đồng thời Facebook Ads và TikTok Ads cho một khóa học premium. CFO yêu cầu trong 24 giờ phải đưa ra đề xuất phân bổ ngân sách tuần tới.",
    constraints: [
      "Tổng ngân sách không đổi.",
      "Không tắt hẳn một kênh vì team brand vẫn cần hiện diện đa kênh.",
      "Sale team chỉ chấp nhận phương án nếu giải thích được tác động tới lead quality.",
    ],
    metrics: [
      {
        label: "Facebook Ads CPL",
        value: "126,000đ",
        note: "Cao hơn TikTok Ads nhưng lead quality tốt hơn.",
      },
      {
        label: "TikTok Ads CPL",
        value: "88,000đ",
        note: "Rẻ hơn rõ rệt ở bề mặt.",
      },
      {
        label: "Facebook Ads Close Rate",
        value: "11.2%",
        note: "Lead từ kênh này có intent cao hơn.",
      },
      {
        label: "TikTok Ads Close Rate",
        value: "5.1%",
        note: "Volume lớn nhưng chất lượng không đồng đều.",
      },
      {
        label: "Blended ROAS",
        value: "2.36",
        note: "Ổn nhưng còn dư địa tối ưu phân bổ.",
      },
    ],
    questions: [
      {
        id: "cp-q1",
        prompt: "Nếu chỉ nhìn CPL để cắt budget Facebook Ads mạnh tay, rủi ro lớn nhất là gì?",
        options: [
          {
            id: "cp-q1-a",
            label: "Có thể giảm lead volume nhưng tăng hiệu quả chốt đơn thực tế.",
            explanation:
              "Sai. Với close rate chênh lớn như hiện tại, cắt mạnh Facebook Ads có thể làm blended hiệu quả đi xuống chứ không chắc tăng lên.",
            isCorrect: false,
          },
          {
            id: "cp-q1-b",
            label: "Bỏ qua chất lượng lead và kéo blended ROAS xấu đi dù CPL trung bình nhìn đẹp hơn.",
            explanation:
              "Đúng. Đây là lỗi rất thường gặp khi chỉ nhìn cost bề mặt mà không nhìn revenue quality.",
            isCorrect: true,
          },
          {
            id: "cp-q1-c",
            label: "Không có rủi ro nào vì CPL luôn là chỉ số quan trọng nhất.",
            explanation:
              "Sai. CPL chỉ là một lớp chi phí đầu vào, chưa phản ánh chất lượng cuối funnel.",
            isCorrect: false,
          },
          {
            id: "cp-q1-d",
            label: "Pixel của Facebook Ads sẽ học lại từ đầu ngay lập tức.",
            explanation:
              "Sai. Dù learning có thể bị ảnh hưởng, đây không phải rủi ro chính nhất trong ngữ cảnh này.",
            isCorrect: false,
          },
        ],
      },
      {
        id: "cp-q2",
        prompt: "Phương án phân bổ ngân sách nào hợp lý nhất cho tuần tới?",
        options: [
          {
            id: "cp-q2-a",
            label: "Chuyển gần như toàn bộ budget sang TikTok Ads vì CPL thấp hơn nhiều.",
            explanation:
              "Sai. Cách này tối ưu bề mặt chi phí nhưng bỏ qua lead quality và close rate.",
            isCorrect: false,
          },
          {
            id: "cp-q2-b",
            label: "Giữ ngân sách đều 50/50 để tránh tranh cãi nội bộ.",
            explanation:
              "Sai. Đây là quyết định an toàn nhưng thiếu logic vận hành theo data.",
            isCorrect: false,
          },
          {
            id: "cp-q2-c",
            label: "Tăng có kiểm soát cho Facebook Ads và vẫn giữ TikTok Ads ở vai trò volume fill, sau đó theo dõi blended ROAS + close rate.",
            explanation:
              "Đúng. Đây là phương án cân bằng giữa revenue quality và volume đa kênh.",
            isCorrect: true,
          },
          {
            id: "cp-q2-d",
            label: "Cắt đều 20% ở cả hai kênh để bảo toàn ngân sách.",
            explanation:
              "Sai. Tổng ngân sách không đổi, nên cắt đều không giải quyết bài toán phân bổ.",
            isCorrect: false,
          },
        ],
      },
      {
        id: "cp-q3",
        prompt: "KPI nào nên được theo dõi sát nhất sau khi đổi budget allocation?",
        options: [
          {
            id: "cp-q3-a",
            label: "Chỉ cần CPL tổng là đủ.",
            explanation:
              "Sai. CPL tổng không nói lên chất lượng lead hay revenue cuối cùng.",
            isCorrect: false,
          },
          {
            id: "cp-q3-b",
            label: "Blended ROAS, close rate theo kênh và lead quality feedback từ sales.",
            explanation:
              "Đúng. Đây là bộ chỉ số sát với bài toán phân bổ ngân sách đa kênh.",
            isCorrect: true,
          },
          {
            id: "cp-q3-c",
            label: "Chỉ cần CPM của từng kênh.",
            explanation:
              "Sai. CPM là chi phí media, không đủ để quyết định hiệu quả cuối funnel.",
            isCorrect: false,
          },
          {
            id: "cp-q3-d",
            label: "Frequency của TikTok Ads là chỉ số duy nhất phải giữ.",
            explanation:
              "Sai. Frequency có ích nhưng không phải KPI sát nhất cho allocation decision ở đây.",
            isCorrect: false,
          },
        ],
      },
    ],
    reviewChecklist: [
      "Budget allocation đa kênh phải nhìn cả CPL và chất lượng lead.",
      "Close rate và revenue quality là lớp xác nhận quan trọng cho quyết định scale.",
      "Blended ROAS nên đi cùng feedback từ sales, không chỉ dựa vào ad platform report.",
    ],
  },
];
