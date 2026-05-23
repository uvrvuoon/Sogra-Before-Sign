"use client";

import { useState } from 'react';
import { maskSensitiveData } from '@/utils/masking'; 

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [maskedText, setMaskedText] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState(""); // AI 분석 결과를 담을 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 애니메이션용 상태

  // 1단계: 프론트엔드 단에서 선제적으로 비식별화 처리
  const handleMaskingClick = () => {
    if (!inputText.trim()) {
      alert("계약서 내용을 입력해주세요.");
      return;
    }
    const safeText = maskSensitiveData(inputText);
    setMaskedText(safeText);
    setAiAnalysis(""); // 새 텍스트를 검사할 때 이전 AI 결과는 초기화
  };

  // 2단계: 마스킹된 안전한 데이터를 백엔드 AI API로 전송
  // 2단계: 마스킹된 안전한 데이터를 백엔드 AI API로 전송
  const handleSendToAIClick = async () => {
    if (!maskedText) return;

    setIsLoading(true);
    setAiAnalysis("");

    try {
      // 💡 [수정 1] 친구가 3000번 포트로 테스트했다면 백엔드가 3000번일 확률이 높습니다.
      // 만약 포트 충돌로 친구가 백엔드 포트를 바꿨다면 (예: 5000번), 여기 주소도 5000으로 적어주셔야 합니다!
      const response = await fetch('http://118.235.95.186:3000/api/analyze-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 💡 [수정 2] 핵심! contractText 대신 친구가 백엔드에 짜둔 maskedText 이름으로 맞춰서 보냅니다.
        body: JSON.stringify({ maskedText: maskedText }), 
      });

      if (!response.ok) {
        throw new Error("서버 응답에 실패했습니다.");
      }

      const data = await response.json();
      
      // 💡 [수정 3] 친구 백엔드가 응답(json)으로 보내주는 결과 필드명을 받아 적습니다.
      // 보통은 data.analysis나 data.result 일 테니, 안 나오면 친구에게 "AI 결과 필드 이름이 뭐야?"라고 물어보세요!
      setAiAnalysis(data.analysis || data.result || "분석 완료: 안전한 계약서입니다.");

    } catch (error) {
      console.error("AI 전송 에러:", error);
      setAiAnalysis("❌ 현재 백엔드 서버와 연결이 안 되었습니다. 서버 구동 상태나 API 주소를 확인해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: '650px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '35px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '10px' }}>집계약 안심금고 🔒</h1>
        <p style={{ 
  color: '#666', 
  fontSize: '13.5px',       // 💡 글씨 크기를 아주 살짝 줄이고
  letterSpacing: '-0.3px',  // 💡 자간을 촘촘하게 좁혀서
  whiteSpace: 'nowrap',    // 💡 강제로 절대 줄바꿈이 안 일어나도록 고정합니다!
  margin: '0 auto'
}}>
  AI 분석 전, 프론트 단계에서 개인정보를 선제적으로 비식별화하여 안전하게 전월세 계약을 점검합니다.
</p>
      </div>

      {/* 입력창 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label style={{ fontSize: '16px', fontWeight: '600', color: '#fff' }}>계약서 텍스트 입력</label>
        <textarea
          rows={10}
          style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box', background: '#ffffff', color: '#000000', fontSize: '14px', lineHeight: '1.5' }}
          placeholder="여기에 전월세 특약 사항이나 계약서 내용을 붙여넣으세요."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <button
          onClick={handleMaskingClick}
          style={{ width: '100%', padding: '14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
        >
          1단계: 개인정보 안전하게 가리기
        </button>
      </div>

      {/* 1차 결과: 마스킹 확인 창 및 AI 전송 버튼 */}
      {maskedText && (
        <div style={{ marginTop: '35px', padding: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#1e293b', marginBottom: '12px' }}>
            🔒 프론트엔드 비식별화 처리 결과 (AI 전송 대기 데이터)
          </h3>
          <div style={{ padding: '15px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '14px', color: '#000', marginBottom: '20px' }}>
            {maskedText}
          </div>

          {/* 대망의 AI 전송 버튼 */}
          <button
            onClick={handleSendToAIClick}
            disabled={isLoading}
            style={{ width: '100%', padding: '14px', background: isLoading ? '#94a3b8' : '#059669', color: '#fff', border: 'none', borderRadius: '10px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px' }}
          >
            {isLoading ? "🤖 AI가 계약서를 정밀 분석 중입니다..." : "2단계: 비식별화된 데이터로 AI 분석 요청하기 🚀"}
          </button>
        </div>
      )}

      {/* 2차 결과: 찐 AI 분석 결과 창 */}
      {aiAnalysis && (
        <div style={{ marginTop: '25px', padding: '20px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#1e40af', marginBottom: '12px' }}>
            🤖 AI 안심 계약 분석 리포트 결과
          </h3>
          <div style={{ padding: '15px', background: '#fff', border: '1px solid #93c5fd', borderRadius: '6px', whiteSpace: 'pre-wrap', fontSize: '14px', color: '#1e293b', lineHeight: '1.6' }}>
            {aiAnalysis}
          </div>
        </div>
      )}
    </main>
  );
}