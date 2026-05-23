// 파일 위치: 프로젝트 최상위 폴더 (test.js)

// 네가 만든 두 함수를 불러옵니다. 
// (경로나 확장자는 너의 프로젝트 환경에 맞게 조금 수정해!)
import { maskSensitiveData } from './src/utils/masking.js';
import { analyzeContractRisk } from './src/utils/aiAnalyzer.js';

const dummyData = `
[부동산 임대차 계약서]
- 소재지: 대전광역시 유성구 궁동 123-45 청년빌라 302호
- 건물 형태: 다가구주택
- 임대인 성명: 홍길동 (주민등록번호: 650212-1234567)
- 임대인 연락처: 010-9876-5432
- 입금 계좌: 카카오뱅크 3333-12-123456
- 임차인 성명: 김민수 (주민등록번호: 990101-1234567)

3. 특약사항 (중요)
- 본 건물은 등기부등본상 새마을금고에 융자(근저당) 1억 5천만 원이 설정된 상태임.
- 퇴실 시 전문 청소업체 비용 15만 원을 지불하며, 보증금 반환은 다음 세입자가 구해지는 조건으로 한다.
`;

async function runTest() {
    console.log("=========================================");
    console.log("🚀 1. 보안 마스킹 테스트 시작...");
    
    const safeText = maskSensitiveData(dummyData);
    console.log("\n[마스킹 결과 확인]:\n", safeText);
    
    // 육안 검사: 302호 -> ***호, 주민번호 -> *******, 계좌/전화번호가 잘 가려졌는지 확인!

    console.log("\n=========================================");
    console.log("🤖 2. Gemini AI 위험도 분석 시작... (약 3~5초 대기)");

    const aiResult = await analyzeContractRisk(safeText);
    
    console.log("\n[AI 분석 리포트 결과]:");
    console.log(JSON.stringify(aiResult, null, 2));
    console.log("=========================================");
}

runTest();