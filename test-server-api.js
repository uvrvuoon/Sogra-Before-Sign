import "dotenv/config";

// 로컬 테스트용 간단한 요청
const testData = {
  maskedText: `
[부동산 임대차 계약서]
- 소재지: 대전광역시 유성구 궁동 123-45 청년빌라 ***호
- 건물 형태: 다가구주택
- 임대인 성명: 홍*동 (주민등록번호: 650212-*******)
- 임대인 연락처: 010-****-5432
- 입금 계좌: 카카오뱅크 ***-****-****
- 임차인 성명: 김*수 (주민등록번호: 990101-*******)

3. 특약사항 (중요)
- 본 건물은 등기부등본상 새마을금고에 융자(근저당) 1억 5천만 원이 설정된 상태임.
- 퇴실 시 전문 청소업체 비용 15만 원을 지불하며, 보증금 반환은 다음 세입자가 구해지는 조건으로 한다.
  `
};

console.log("🚀 Server API 테스트 시작...");
console.log("📤 보내는 데이터:");
console.log(JSON.stringify(testData, null, 2));

try {
  const response = await fetch("http://localhost:3000/api/analyze-contract", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(testData),
  });

  console.log("\n📡 응답 상태:", response.status);

  if (!response.ok) {
    const errorData = await response.json();
    console.error("❌ API 에러:", errorData);
    process.exit(1);
  }

  const result = await response.json();
  console.log("\n✅ AI 분석 결과:");
  console.log(JSON.stringify(result, null, 2));

  process.exit(0);
} catch (error) {
  console.error("❌ 요청 실패:", error.message);
  console.log("💡 서버가 실행 중인지 확인하세요: node src/server.js");
  process.exit(1);
}
