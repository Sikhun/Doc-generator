// ฟังก์ชันแปลงตัวเลขเป็นบาทถ้วนภาษาไทย
function bahtText(num) {
    if (isNaN(num) || num === 0) return 'ศูนย์บาทถ้วน';
    if (num < 0) return 'ลบ ' + bahtText(Math.abs(num));

    num = Math.round(num * 100) / 100;
    const str = num.toFixed(2).split('.');
    const baht = str[0];
    const satang = str[1];

    const thaiNum = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
    const thaiUnit = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

    function convertPart(numberStr) {
        let result = '';
        const len = numberStr.length;
        for (let i = 0; i < len; i++) {
            const digit = parseInt(numberStr.charAt(i));
            const unit = len - i - 1;
            if (digit !== 0) {
                if (unit === 1 && digit === 1) result += 'สิบ';
                else if (unit === 1 && digit === 2) result += 'ยี่สิบ';
                else if (unit === 0 && digit === 1 && len > 1) result += 'เอ็ด';
                else result += thaiNum[digit] + thaiUnit[unit];
            }
        }
        return result;
    }

    let text = convertPart(baht) + 'บาท';
    if (parseInt(satang) === 0) {
        text += 'ถ้วน';
    } else {
        text += convertPart(satang) + 'สตางค์';
    }
    return text;
}

// ฟังก์ชันแปลงตัวเลขเป็นภาษาอังกฤษ
function enWords(x) {
    const o = ['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
    const tn = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
    const w = v => v < 20 ? o[v] : v < 100 ? tn[Math.floor(v / 10)] + (v % 10 ? '-' + o[v % 10] : '') : o[Math.floor(v / 100)] + ' Hundred' + (v % 100 ? ' ' + w(v % 100) : '');
    if (x === 0) return 'Zero';
    const r = [];
    for (const [v, nm] of [[1e9,'Billion'],[1e6,'Million'],[1e3,'Thousand']]) if (x >= v) { r.push(w(Math.floor(x / v)) + ' ' + nm); x %= v; }
    if (x > 0) r.push(w(x));
    return r.join(' ');
}

function bahtTextEn(num) {
    const neg = num < 0; num = Math.round(Math.abs(num) * 100) / 100;
    const b = Math.floor(num), st = Math.round((num - b) * 100);
    return (neg ? 'Minus ' : '') + enWords(b) + ' Baht' + (st ? ' and ' + enWords(st) + ' Satang' : '') + ' Only';
}

function moneyText(n) { return docLang === 'en' ? bahtTextEn(n) : bahtText(n); }

function formatMoney(num) {
    return num.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(d) {
    return (docLang === 'en' && d) ? new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : d;
}