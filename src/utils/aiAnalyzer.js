// 파일 위치: src/utils/aiAnalyzer.js

import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.API_KEY;

export async function analyzeContractRisk(maskedContractText) {
    // 💡 gpt-4o-mini에 대응하는 빠르고 가성비 좋은 gemini-1.5-flash 모델 엔드포인트
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    // 해커톤 핵심: AI를 부동산/보안 전문가로 가스라이팅하는 시스템 프롬프트
    const systemPrompt = `
    너는 대한민국 20대 청년을 위한 '전월세 계약 전문 법률/보안 조수'야.
    사용자가 입력한 계약서 텍스트(개인정보는 이미 마스킹됨)를 분석해서 무조건 아래 JSON 형식으로만 답변해. 다른 말은 절대 추가하지 마.
    
    {
      "riskLevel": "안전 | 주의 | 위험",
      "summary": "어떤 점이 위험한지 3줄 이내 요약",
      "checklist": ["계약 전 반드시 확인해야 할 행동 1", "행동 2", "행동 3"]
    }
    
    분석 기준:
    1. '근저당', '융자', '말소' 등의 단어가 있으면 무조건 '주의' 이상.
    2. '다가구 주택'일 경우 '선순위 보증금' 확인을 체크리스트에 추가.
    3. 수리비를 임차인에게 전가하거나 퇴실 시 과도한 청구 조항이 있으면 '위험'.
    4. 마스킹된 기호(***)에 대해서는 언급하지 마.
    `;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // 시스템 프롬프트 설정 (Gemini 규격)
                system_instruction: {
                    parts: [{ text: systemPrompt }]
                },
                // 사용자 입력 메시지
                contents: [
                    {
                        role: "user",
                        parts: [{ text: `다음 계약서를 분석해줘: \n\n${maskedContractText}` }]
                    }
                ],
                // 생성 제어 설정
                generationConfig: {
                    temperature: 0.2, // 창의성을 낮추어 사실 기반의 정제된 답변 유도
                    responseMimeType: "application/json" // JSON 형태의 응답을 강제
                }
            })
        });

        const data = await response.json();

        // HTTP 상태 코드 체크 (API 키 오류 또는 할당량 초과 등)
        if (!response.ok) {
            throw new Error(`Gemini API Error: ${data.error?.message || response.statusText}`);
        }
        
        // Gemini API의 응답 구조에서 JSON 문자열 텍스트를 추출
        const jsonText = data.candidates[0].content.parts[0].text;
        
        // JSON 문자열을 객체로 파싱하여 프론트엔드로 반환
        return JSON.parse(jsonText); 

    } catch (error) {
        console.error("AI 분석 중 에러 발생:", error);
        return {
            riskLevel: "에러",
            summary: "AI 서버와 통신하는 데 문제가 발생했습니다.",
            checklist: ["잠시 후 다시 시도해주세요."]
        };
    }
}
