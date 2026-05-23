// 파일 위치: src/utils/masking.js

export function maskSensitiveData(contractText) {
    if (!contractText) return "";

    let maskedText = contractText;

    // 1. 이름 마스킹 (콜론 필수로 엄격하게)
    const nameKeywords = /(성명|이름|임대인|임차인|대리인|매도인|매수인|예금주)\s*:\s*([가-힣]{2,4})/g;

    maskedText = maskedText.replace(nameKeywords, (match, keyword, name) => {
        if (name === "계약" || name === "보증" || name === "특약" || name === "금액" || name === "번호" || name === "이름") {
            return match;
        }

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

    // 2. 주민등록번호 마스킹
    maskedText = maskedText.replace(/(\d{6})\s*-\s*(\d{7})/g, '$1-*******');

    // 3. 전화번호/휴대폰 번호 마스킹
    maskedText = maskedText.replace(/(010)\s*-\s*(\d{4})\s*-\s*(\d{4})/g, '$1-****-$3');

    // 4. 계좌번호 마스킹
    maskedText = maskedText.replace(/(\d{3,6})\s*-\s*(\d{2,6})\s*-\s*(\d{2,6})\s*-\s*(\d{3,6})/g, '***-**-**-*****');
    maskedText = maskedText.replace(/(\d{3,6})\s*-\s*(\d{2,6})\s*-\s*(\d{4,6})/g, '***-****-****');

    // 5. 주소 호수 마스킹
    maskedText = maskedText.replace(/([0-9]{1,4})호/g, '***호');

    return maskedText;
}
