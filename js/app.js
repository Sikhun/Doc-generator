function buildDocumentHTML(type) {
    // ป้องกัน Error กรณีหา Element ไม่เจอ
    const getVal = (id, fallback = '') => {
        const el = document.getElementById(id);
        return el ? el.value : fallback;
    };

    const shopName = getVal('shopName') || (SHOP_DEF[docLang] ? SHOP_DEF[docLang].name : 'Just IT Solution');
    const shopAddress = getVal('shopAddress') || (SHOP_DEF[docLang] ? SHOP_DEF[docLang].address : '-');
    const shopTax = getVal('shopTaxId');
    const shopBank = getVal('shopBank') || '-';

    const custName = getVal('custName') || '-';
    const custAddress = getVal('custAddress') || '-';
    
    const dateStr = new Date().toISOString().slice(2, 7).replace('-', '');
    const docNo = getVal('docNo') || `${type}${dateStr}-001`;
    const docDate = getVal('docDate') || new Date().toISOString().split('T')[0];
    
    const _pv = getVal('paymentType', 'transfer');
    const paymentType = (DOCL[docLang] && DOCL[docLang].pays && DOCL[docLang].pays[_pv]) ? DOCL[docLang].pays[_pv] : _pv;
    const userNotes = getVal('customNotes');

    const L = DOCL[docLang] || DOCL.th;
    const T = L.t[type] || L.t.QT;
    const docTitle = T.title, docSubTitle = T.sub || '', metaLabel1 = T.meta;
    
    const _f = document.getElementById({QT:'docValidity',DO:'docRef',RE:'docWarranty'}[type]);
    const metaVal1 = _f ? _f.value : T.def;
    const termsText = userNotes || T.terms;
    const signLeftLabel = T.sl, signRightLabel = T.sr;

    let subtotal = 0;
    let rowsHTML = '';
    
    if (itemsList && itemsList.length > 0) {
        itemsList.forEach((item, idx) => {
            const lineTotal = (item.qty || 0) * (item.price || 0);
            subtotal += lineTotal;
            const isNegative = lineTotal < 0;
            rowsHTML += `
                <tr style="border-bottom: 1px solid #e2e8f0; height: 36px;">
                    <td style="padding: 6px 8px; text-align: center; border-right: 1px solid #e2e8f0; border-left: 1px solid #e2e8f0;">${idx + 1}</td>
                    <td style="padding: 6px 10px; border-right: 1px solid #e2e8f0;">
                        <div style="font-weight: 700; color: ${isNegative ? '#dc2626' : '#0f172a'}; line-height: 1.3;">${item.title || '-'}</div>
                        ${item.detail ? `<div style="font-size: 10px; color: #64748b; margin-top: 2px;">${item.detail}</div>` : ''}
                    </td>
                    <td style="padding: 6px 8px; text-align: center; border-right: 1px solid #e2e8f0;">${item.qty || 0}</td>
                    <td style="padding: 6px 10px; text-align: right; border-right: 1px solid #e2e8f0; color: ${isNegative ? '#dc2626' : '#0f172a'};">${typeof formatMoney === 'function' ? formatMoney(item.price || 0) : item.price}</td>
                    <td style="padding: 6px 10px; text-align: right; border-right: 1px solid #e2e8f0; font-weight: 600; color: ${isNegative ? '#dc2626' : '#0f172a'};">${typeof formatMoney === 'function' ? formatMoney(lineTotal) : lineTotal}</td>
                </tr>
            `;
        });
    }

    const minRows = 4;
    const currentLen = itemsList ? itemsList.length : 0;
    for (let i = currentLen; i < minRows; i++) {
        rowsHTML += `
            <tr style="border-bottom: 1px solid #f1f5f9; height: 32px;">
                <td style="border-right: 1px solid #e2e8f0; border-left: 1px solid #e2e8f0;"></td>
                <td style="border-right: 1px solid #e2e8f0;"></td>
                <td style="border-right: 1px solid #e2e8f0;"></td>
                <td style="border-right: 1px solid #e2e8f0;"></td>
                <td style="border-right: 1px solid #e2e8f0;"></td>
            </tr>
        `;
    }

    const discount = parseFloat(getVal('discountAmount', '0')) || 0;
    const vatType = getVal('vatType', 'none');
    
    const netAmount = subtotal - discount;
    let vatAmount = 0;
    let grandTotal = netAmount;

    if (vatType === 'add') {
        vatAmount = netAmount * 0.07;
        grandTotal = netAmount + vatAmount;
    }

    let vatTableRows = '';
    let rowspanVal = 2;

    if (vatType === 'add') {
        rowspanVal = 3;
        vatTableRows = `
            <tr>
                <td style="border: 1px solid #e2e8f0; padding: 6px 10px; text-align: right; color: #475569; height: 26px;">${L.vat}</td>
                <td style="border: 1px solid #e2e8f0; padding: 6px 10px; text-align: right; font-weight: 600; color: #0f172a;">${typeof formatMoney === 'function' ? formatMoney(vatAmount) : vatAmount}</td>
            </tr>
        `;
    }

    const bahtTxt = typeof moneyText === 'function' ? moneyText(grandTotal) : grandTotal;

    return `
        <div style="display: flex; flex-direction: column; justify-content: space-between; min-height: 100%;">
            <div>
                <!-- Header Section -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px;">
                    <div style="width: 65%;">
                        <h1 style="font-size: 18px; font-weight: 700; color: #0f172a; line-height: 1.2;" class="heading-font">${shopName}</h1>
                        <p style="font-size: 11px; color: #475569; white-space: pre-line; margin-top: 6px; line-height: 1.5;">${shopAddress}</p>
                        ${shopTax ? `<p style="font-size: 11px; color: #64748b; margin-top: 4px;">${L.tax}${shopTax}</p>` : ''}
                    </div>
                    <div style="width: 35%; text-align: right;">
                        <h2 style="font-size: 20px; font-weight: 800; color: #1e3a8a; line-height: 1;" class="heading-font">${docTitle}</h2>
                        ${docSubTitle ? `<p style="font-size: 10px; font-weight: 700; color: #64748b; letter-spacing: 1px; margin-top: 3px;">${docSubTitle}</p>` : ''}
                        <div style="margin-top: 10px; display: inline-block; background-color: #f8fafc; padding: 6px 12px; border-radius: 8px; text-align: right; border: 1px solid #e2e8f0;">
                            <p style="font-size: 11px; font-weight: 700; color: #1e293b; margin: 0;">${L.no} <span style="color: #1e40af;">${docNo}</span></p>
                            <p style="font-size: 10px; color: #64748b; margin-top: 2px;">${L.date} ${typeof fmtDate === 'function' ? fmtDate(docDate) : docDate}</p>
                        </div>
                    </div>
                </div>

                <!-- Customer Section -->
                <div style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 16px; margin-bottom: 20px; font-size: 11px;">
                    <div style="grid-column: span 7; background-color: #f8fafc; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0;">
                        <p style="font-weight: 700; color: #1e3a8a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;" class="heading-font">${L.cust}</p>
                        <p style="font-weight: 700; color: #0f172a; font-size: 12px; margin: 0;">${custName}</p>
                        <p style="color: #475569; line-height: 1.5; margin-top: 4px; white-space: pre-line;">${custAddress}</p>
                    </div>
                    <div style="grid-column: span 5; background-color: #f8fafc; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; justify-content: space-between;">
                        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
                            <span style="color: #64748b;">${metaLabel1}</span>
                            <span style="font-weight: 600; color: #0f172a;">${metaVal1}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
                            <span style="color: #64748b;">${L.pay}</span>
                            <span style="font-weight: 600; color: #0f172a;">${paymentType}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #64748b;">${L.bank}</span>
                            <span style="font-weight: 600; color: #0f172a; font-size: 10px; text-align: right;">${shopBank}</span>
                        </div>
                    </div>
                </div>

                <!-- Items & Summary Table -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; table-layout: fixed;">
                    <thead>
                        <tr style="background-color: #0f172a; color: #ffffff; height: 32px;">
                            <th style="width: 8%; padding: 6px; text-align: center; border: 1px solid #0f172a;">#</th>
                            <th style="width: 48%; padding: 6px 10px; text-align: left; border: 1px solid #0f172a;">${L.h[1]}</th>
                            <th style="width: 12%; padding: 6px; text-align: center; border: 1px solid #0f172a;">${L.h[2]}</th>
                            <th style="width: 16%; padding: 6px 10px; text-align: right; border: 1px solid #0f172a;">${L.h[3]}</th>
                            <th style="width: 16%; padding: 6px 10px; text-align: right; border: 1px solid #0f172a;">${L.h[4]}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHTML}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" rowspan="${rowspanVal}" style="border: 1px solid #e2e8f0; background-color: #f8fafc; padding: 10px; text-align: center; vertical-align: middle;">
                                <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; min-height: 40px;">
                                    <span style="font-size: 10px; color: #475569; font-weight: 500; display: block; line-height: 1.3;">${L.words}</span>
                                    <span style="font-size: 11px; font-weight: 700; color: #1e3a8a; margin-top: 4px; display: block; line-height: 1.3;">( ${bahtTxt} )</span>
                                </div>
                            </td>
                            <td style="border: 1px solid #e2e8f0; padding: 6px 10px; text-align: right; color: #475569; height: 26px;">${L.sub}</td>
                            <td style="border: 1px solid #e2e8f0; padding: 6px 10px; text-align: right; font-weight: 600; color: #0f172a;">${typeof formatMoney === 'function' ? formatMoney(subtotal) : subtotal}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #e2e8f0; padding: 6px 10px; text-align: right; color: #475569; height: 26px;">${L.disc}</td>
                            <td style="border: 1px solid #e2e8f0; padding: 6px 10px; text-align: right; font-weight: 600; color: #dc2626;">${discount > 0 ? `-${typeof formatMoney === 'function' ? formatMoney(discount) : discount}` : '0.00'}</td>
                        </tr>
                        ${vatTableRows}
                        <tr style="background-color: #f1f5f9; font-weight: 700; height: 36px;">
                            <td colspan="3" style="border: 1px solid #e2e8f0; background-color: #f1f5f9;"></td>
                            <td style="border: 1px solid #e2e8f0; padding: 6px 10px; text-align: right; color: #0f172a; vertical-align: middle;">
                                <div style="line-height: 1.2;">${L.tot}</div>
                                <div style="font-size: 9px; color: #64748b; font-weight: 500;">${L.tot2}</div>
                            </td>
                            <td style="border: 1px solid #e2e8f0; padding: 6px 10px; text-align: right; color: #1e3a8a; font-size: 13px; font-weight: 800; vertical-align: middle;">
                                ${typeof formatMoney === 'function' ? formatMoney(grandTotal) : grandTotal} ${L.cur}
                            </td>
                        </tr>
                    </tfoot>
                </table>

                <!-- Terms & Warranty Block -->
                <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; background-color: #f8fafc; font-size: 10px; color: #475569; margin-bottom: 20px;">
                    <p style="font-weight: 700; color: #0f172a; margin-bottom: 4px;" class="heading-font">${L.terms}</p>
                    <p style="white-space: pre-line; line-height: 1.4; margin: 0;">${termsText}</p>
                </div>
            </div>

            <!-- Signatures Footer -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; padding-top: 12px; border-top: 1px solid #cbd5e1; text-align: center; font-size: 11px;">
                <div>
                    <p style="color: #64748b; font-weight: 500; margin-bottom: 36px;">${L.on} <span style="font-weight: 700; color: #0f172a;">${shopName}</span></p>
                    <div>
                        <p style="color: #0f172a; font-weight: 600;">${L.sign}</p>
                        <p style="font-size: 10px; color: #64748b; margin-top: 4px;">${signLeftLabel}</p>
                        <p style="font-size: 9px; color: #94a3b8; margin-top: 2px;">${L.dl}</p>
                    </div>
                </div>
                <div>
                    <p style="color: #64748b; font-weight: 500; margin-bottom: 36px;">${L.on} <span style="font-weight: 700; color: #0f172a;">${custName}</span></p>
                    <div>
                        <p style="color: #0f172a; font-weight: 600;">${L.sign}</p>
                        <p style="font-size: 10px; color: #64748b; margin-top: 4px;">${signRightLabel}</p>
                        <p style="font-size: 9px; color: #94a3b8; margin-top: 2px;">${L.dl}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}