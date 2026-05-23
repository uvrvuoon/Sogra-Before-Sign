// 파일 위치: src/utils/masking.js

export function maskSensitiveData(contractText) {
    if (!contractText) return ""; // 빈 텍스트 에러 방지
    
    let maskedText = contractText;
    
    // 1. 기존 고유식별정보 마스킹
    maskedText = maskedText.replace(/(\d{6})\s*-\s*([1-4]\d{6})/g, '$1-*******');
    maskedText = maskedText.replace(/(010)\s*-\s*(\d{4})\s*-\s*(\d{4})/g, '$1-****-$3');
    maskedText = maskedText.replace(/(\d{3,6})\s*-\s*(\d{2,6})\s*-\s*(\d{4,6})/g, '***-****-****');
    maskedText = maskedText.replace(/([0-9]{1,4})호/g, '***호');

    // 2. 이름 마스킹 (문맥 기반 안전한 마스킹)
    // 계약서 주요 직책/키워드 뒤에 오는 2~4글자 한글을 이름으로 간주
    const nameKeywords = /(성명|이름|임대인|임차인|대리인|매도인|매수인)\s*[:\s]*([가-힣]{2,4})/g;
    
    maskedText = maskedText.replace(nameKeywords, (match, keyword, name) => {
        let maskedName = "";
        
        if (name.length === 2) {
            // 2글자 이름: 이황 -> 이*
            maskedName = name[0] + "*";
        } else if (name.length > 2) {
            // 3~4글자 이름: 홍길동 -> 홍*동, 남궁민수 -> 남**수
            const firstChar = name[0];
            const lastChar = name[name.length - 1];
            const middleStars = "*".repeat(name.length - 2);
            maskedName = firstChar + middleStars + lastChar;
        }

        // 원본 텍스트의 띄어쓰기나 콜론(:) 형태를 그대로 유지하면서 이름 부분만 교체
        return match.replace(name, maskedName);
    });

    return maskedText;
}
