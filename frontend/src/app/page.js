"use client";

import { useState } from 'react';
import { maskSensitiveData } from '@/utils/masking'; 

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [maskedText, setMaskedText] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState(null); // 💡 객체 형태{}로 받기 위해 초기값을 null로 변경
  const [isLoading, setIsLoading] = useState(false);

  // 1단계: 비식별화 처리
  const handleMaskingClick = () => {
    if (!inputText.trim()) {
      alert("계약서 내용을 입력해주세요.");
      return;
    }
    const safeText = maskSensitiveData(inputText);
    setMaskedText(safeText);
    setAiAnalysis(null); 
  };

  // 2단계: 백엔드 찐 API로 전송 및 파싱
  const handleSendToAIClick = async () => {
    if (!maskedText) return;

    setIsLoading(true);
    setAiAnalysis(null);

    try {
      // 💡 [중요] 친구 핫스팟 주소와 포트(3000)를 정확히 적어주세요!
      const response = await fetch('http://localhost:5000/api/analyze-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ maskedText: maskedText }), 
      });

      if (!response.ok) {
        throw new Error("서버 응답에 실패했습니다.");
      }

      const data = await response.json();
      console.log("📡 백엔드에서 온 찐 데이터:", data);
      
      // 💡 친구가 만든 JSON 포맷(위험도, 요약, 체크리스트)을 상태에 통째로 저장합니다.
      setAiAnalysis(data);

    } catch (error) {
      console.error("AI 전송 에러:", error);
      // 에러가 났을 때만 데모 데이터가 나오도록 안전장치 설정
      setAiAnalysis({
        "위험도": "중간",
        "요약": "❌ 현재 실제 백엔드 연동에 실패했습니다. (Gemini API 키 또는 포트 확인 필요)",
        "체크리스트": ["친구 컴퓨터의 .env에 GEMINI_API_KEY가 있는지 확인하세요.", "동일한 핫스팟 와이파이인지 다시 확인하세요."]
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: '650px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '35px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '10px' }}>집계약 안심금고 🔒</h1>
        <p style={{ color: '#666', fontSize: '13.5px', letterSpacing: '-0.3px', whiteSpace: 'nowrap', margin: '0 auto' }}>
          AI 분석 전, 프론트 단에서 개인정보를 선제적으로 비식별화하여 안전하게 전월세 계약을 점검합니다.
        </p>
      </div>

      {/* 입력창 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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

      {/* 1차 결과 창 */}
      {maskedText && (
        <div style={{ marginTop: '35px', padding: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#1e293b', marginBottom: '12px' }}>
            🔒 프론트엔드 비식별화 처리 결과 (AI 전송 대기 데이터)
          </h3>
          <div style={{ padding: '15px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '14px', color: '#000', marginBottom: '20px' }}>
            {maskedText}
          </div>
          <button
            onClick={handleSendToAIClick}
            disabled={isLoading}
            style={{ width: '100%', padding: '14px', background: isLoading ? '#94a3b8' : '#059669', color: '#fff', border: 'none', borderRadius: '10px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px' }}
          >
            {isLoading ? "🤖 Gemini AI가 계약서를 분석 중입니다..." : "2단계: 비식별화된 데이터로 AI 분석 요청하기 🚀"}
          </button>
        </div>
      )}

      {/* 2차 결과: 친구의 백엔드 JSON을 이쁘게 렌더링 */}
      {aiAnalysis && (
        <div style={{ marginTop: '25px', padding: '20px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1e40af', marginBottom: '15px' }}>
            🤖 AI 안심 계약 분석 리포트 결과
          </h3>
          
          <div style={{ padding: '15px', background: '#fff', border: '1px solid #93c5fd', borderRadius: '6px', fontSize: '14px', color: '#1e293b', lineHeight: '1.6' }}>
            {/* 위험도 라벨 배지 */}
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>🚨 종합 위험도: </strong> 
              <span style={{
                padding: '3px 8px', borderRadius: '5px', fontWeight: 'bold', color: '#fff',
                background: aiAnalysis.위험도 === "높음" ? '#ef4444' : aiAnalysis.위험도 === "중간" ? '#f59e0b' : '#10b981'
              }}>
                {aiAnalysis.위험도}
              </span>
            </p>

            {/* 요약 */}
            <p style={{ margin: '0 0 15px 0' }}><strong>📝 분석 요약:</strong> {aiAnalysis.요약}</p>
            
            {/* 체크리스트 */}
            <strong style={{ display: 'block', marginBottom: '8px' }}>📌 계약 시 필수 체크리스트:</strong>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {aiAnalysis.체크리스트?.map((item, index) => (
                <li key={index} style={{ marginBottom: '6px' }}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}