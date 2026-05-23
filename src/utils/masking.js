export function maskSensitiveData(contractText) {
    if (!contractText) return ""; 
    let maskedText = contractText;
    
    // 1. 기존 식별정보 마스킹
    maskedText = maskedText.replace(/(\d{6})\s*-\s*([1-4]\d{6})/g, '$1-*******');
    maskedText = maskedText.replace(/(010)\s*-\s*(\d{4})\s*-\s*(\d{4})/g, '$1-****-$3');
    maskedText = maskedText.replace(/(\d{3,6})\s*-\s*(\d{2,6})\s*-\s*(\d{4,6})/g, '***-****-****');
    maskedText = maskedText.replace(/([0-9]{1,4})호/g, '***호');

    // 2. 🚨 이름 마스킹 정규식 고도화 ('성명', '연락처' 등 무시)
    // '임대인 성명:', '임차인:' 등의 구조 뒤에 오는 진짜 이름(2~4글자)만 캡처합니다.
    const nameKeywords = /(?:임대인|임차인|대리인|매도인|매수인)?\s*(?:성명|이름)\s*[:\s]+\s*([가-힣]{2,4})/g;
    
    maskedText = maskedText.replace(nameKeywords, (match, name) => {
        let maskedName = "";
        if (name.length === 2) {
            maskedName = name[0] + "*";
        } else if (name.length > 2) {
            const firstChar = name[0];
            const lastChar = name[name.length - 1];
            const middleStars = "*".repeat(name.length - 2);
            maskedName = firstChar + middleStars + lastChar;
        }
        return match.replace(name, maskedName);
    });

    return maskedText;
}
