export function maskSensitiveData(contractText) {
    if (!contractText) return ""; // 빈 텍스트 에러 방지
    
    let maskedText = contractText;
    maskedText = maskedText.replace(/(\d{6})\s*-\s*([1-4]\d{6})/g, '$1-*******');
    maskedText = maskedText.replace(/(010)\s*-\s*(\d{4})\s*-\s*(\d{4})/g, '$1-****-$3');
    maskedText = maskedText.replace(/(\d{3,6})\s*-\s*(\d{2,6})\s*-\s*(\d{4,6})/g, '***-****-****');
    maskedText = maskedText.replace(/([0-9]{1,4})호/g, '***호');

    return maskedText;
}