let currentDocType = 'QT';
let itemsList = [];
let zoomScale = 1.0;
let customerList = [];

let uiLang = localStorage.getItem('it_ui_lang') || 'th';
let docLang = localStorage.getItem('it_doc_lang') || 'th';

const tr = s => uiLang === 'en' ? (UI_EN[s] || s) : s;

window.addEventListener('DOMContentLoaded', () => {
    loadShopInfo();
    loadSavedCustomers();
    const docDateEl = document.getElementById('docDate');
    if (docDateEl) docDateEl.value = new Date().toISOString().split('T')[0];
    
    itemsList = (SAMPLE_ITEMS && SAMPLE_ITEMS[docLang]) ? SAMPLE_ITEMS[docLang].map(x => ({...x})) : [];
    renderItemInputs();
    setDocType('QT');
    styleLang();
    updateDownloadButtonText();

    // 💡 เรียก autoFitZoom() แทน
    autoFitZoom();
});

function autoFitZoom() {
    const viewport = document.querySelector('.preview-viewport');
    if (viewport) {
        // ล็อกค่าสเกลเริ่มต้นตายตัวไว้ที่ 80% (0.8) เลยทันที
        zoomScale = 0.8; 
        applyZoom();
    }
}
function applyZoom() {
    const page = document.getElementById('documentPrintArea');
    if (page) {
        page.style.transform = `scale(${zoomScale})`;
        page.style.transformOrigin = 'top center';
    }
    const zoomText = document.getElementById('zoomLevelText');
    if (zoomText) {
        zoomText.innerText = `${Math.round(zoomScale * 100)}%`;
    }
}

function applyUI() {
    const skip = '#documentPrintArea,#pdfRenderContainer,#modalA4Container,script,style';
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
        if (n.parentElement.closest(skip)) continue;
        if (n._th === undefined) {
            const k = n.nodeValue.trim().replace(/\s+/g, ' ');
            if (!UI_EN[k]) { n._th = null; continue; }
            n._th = n.nodeValue; n._k = k;
            n._lead = n.nodeValue.match(/^\s*/)[0]; n._trail = n.nodeValue.match(/\s*$/)[0];
        }
        if (n._th !== null) n.nodeValue = uiLang === 'en' ? n._lead + UI_EN[n._k] + n._trail : n._th;
    }
    document.querySelectorAll('[placeholder]').forEach(e => {
        if (!e._ph) e._ph = e.placeholder;
        e.placeholder = uiLang === 'en' ? (UI_EN[e._ph] || e._ph) : e._ph;
    });
    document.documentElement.lang = uiLang;
}

function styleLang() {
    const on = 'px-3 py-1.5 rounded-md font-semibold bg-blue-600 text-white', off = 'px-3 py-1.5 rounded-md text-slate-400 hover:text-white';
    ['ui', 'doc'].forEach(k => ['th', 'en'].forEach(l => {
        const el = document.getElementById(`${k}lang-${l}`);
        if (el) el.className = (k === 'ui' ? uiLang : docLang) === l ? on : off;
    }));
}

function setUILang(l) {
    uiLang = l; localStorage.setItem('it_ui_lang', l);
    renderItemInputs(); updateDownloadButtonText();
    setDocLang(l);
}

function setDocLang(l) {
    const o = docLang; docLang = l; localStorage.setItem('it_doc_lang', l);
    const swap = (id, a, b) => { const e = document.getElementById(id); if (e && e.value === a) e.value = b; };
    if (SHOP_DEF[o] && SHOP_DEF[l]) {
        [['shopName','name'],['shopAddress','address'],['shopTaxId','taxId'],['shopBank','bank']].forEach(([id,k]) => swap(id, SHOP_DEF[o][k], SHOP_DEF[l][k]));
    }
    if (SAMPLE_CUST[o] && SAMPLE_CUST[l]) {
        swap('custName', SAMPLE_CUST[o].name, SAMPLE_CUST[l].name); 
        swap('custAddress', SAMPLE_CUST[o].addr, SAMPLE_CUST[l].addr);
    }
    if (DOCL[o] && DOCL[l]) {
        swap('docValidity', DOCL[o].t.QT.def, DOCL[l].t.QT.def); 
        swap('docWarranty', DOCL[o].t.RE.def, DOCL[l].t.RE.def);
    }
    if (SAMPLE_ITEMS[o] && SAMPLE_ITEMS[l] && JSON.stringify(itemsList) === JSON.stringify(SAMPLE_ITEMS[o])) { 
        itemsList = SAMPLE_ITEMS[l].map(x => ({...x})); 
        renderItemInputs(); 
    }
    styleLang(); updatePreview();
}

function saveCurrentCustomer() {
    const nameEl = document.getElementById('custName');
    const addrEl = document.getElementById('custAddress');
    if (!nameEl) return;
    const name = nameEl.value.trim();
    const addr = addrEl ? addrEl.value.trim() : '';
    if (!name) {
        alert('กรุณากรอกชื่อลูกค้าก่อนทำการบันทึก');
        return;
    }
    let list = JSON.parse(localStorage.getItem('it_saved_customers') || '[]');
    const idx = list.findIndex(c => c.name === name);
    if (idx >= 0) list[idx] = { name, addr };
    else list.push({ name, addr });

    localStorage.setItem('it_saved_customers', JSON.stringify(list));
    alert('บันทึกข้อมูลลูกค้าเข้าสมุดรายชื่อเรียบร้อยแล้ว');
    loadSavedCustomers();
}

function loadSavedCustomers() {
    const list = JSON.parse(localStorage.getItem('it_saved_customers') || '[]');
    customerList = list;
    const container = document.getElementById('savedCustomersContainer');
    const select = document.getElementById('savedCustomersSelect');

    if (!container || !select) return;

    if (list.length === 0) {
        container.classList.add('hidden');
        return;
    }

    container.classList.remove('hidden');
    select.innerHTML = '<option value="">-- เลือกรายชื่อลูกค้าประจำ --</option>';
    list.forEach((c, i) => {
        select.innerHTML += `<option value="${i}">${c.name}</option>`;
    });
}

function loadSelectedCustomer() {
    const select = document.getElementById('savedCustomersSelect');
    if (!select) return;
    const idx = select.value;
    if (idx === '') return;
    const cust = customerList[idx];
    if (cust) {
        const nameEl = document.getElementById('custName');
        const addrEl = document.getElementById('custAddress');
        if (nameEl) nameEl.value = cust.name;
        if (addrEl) addrEl.value = cust.addr;
        updatePreview();
    }
}

function validateForm() {
    const custNameEl = document.getElementById('custName');
    if (!custNameEl || !custNameEl.value.trim()) {
        alert('⚠️ กรุณากรอก "ชื่อลูกค้า / บริษัท" ก่อนพิมพ์หรือดาวน์โหลดเอกสาร');
        return false;
    }
    const validItems = itemsList.filter(item => item.title.trim() !== '' && item.qty > 0);
    if (validItems.length === 0) {
        alert('⚠️ กรุณากรอกรายการสินค้าอย่างน้อย 1 รายการ และจำนวนมากกว่า 0');
        return false;
    }
    return true;
}

function switchMobileView(target) {
    const formSec = document.getElementById('formSection');
    const previewSec = document.getElementById('previewSection');
    const btnForm = document.getElementById('mobileTabBtnForm');
    const btnPreview = document.getElementById('mobileTabBtnPreview');

    if (!formSec || !previewSec) return;

    if (target === 'form') {
        formSec.classList.remove('hidden');
        previewSec.classList.add('hidden');
        previewSec.classList.remove('flex');
        if (btnForm) btnForm.className = "flex-1 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white shadow";
        if (btnPreview) btnPreview.className = "flex-1 py-2 text-xs font-medium rounded-lg bg-slate-800 text-slate-400";
    } else {
        formSec.classList.add('hidden');
        previewSec.classList.remove('hidden');
        previewSec.classList.add('flex');
        if (btnPreview) btnPreview.className = "flex-1 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white shadow";
        if (btnForm) btnForm.className = "flex-1 py-2 text-xs font-medium rounded-lg bg-slate-800 text-slate-400";
    }
}

function setDocType(type) {
    currentDocType = type;
    const pvLabel = document.getElementById('pvCurrentTypeLabel');
    if (pvLabel) pvLabel.innerText = type;
    
    ['QT', 'DO', 'RE'].forEach(t => {
        const btn = document.getElementById(`tab-${t}`);
        if (btn) {
            if (t === type) {
                btn.className = "w-full px-2 py-2 text-xs font-semibold rounded-lg transition-all bg-blue-600 text-white shadow-md text-center truncate";
            } else {
                btn.className = "w-full px-2 py-2 text-xs font-medium rounded-lg transition-all text-slate-400 hover:text-white hover:bg-slate-800 text-center truncate";
            }
        }
    });

    const docNoInput = document.getElementById('docNo');
    const dateStr = new Date().toISOString().slice(2, 7).replace('-', '');
    if (docNoInput) docNoInput.value = `${type}${dateStr}-001`;

    const extraContainer = document.getElementById('metaExtraField');
    if (extraContainer) {
        const langDef = (DOCL[docLang] || DOCL.th).t;
        if (type === 'QT') {
            extraContainer.innerHTML = `
                <label class="font-medium text-slate-400">กำหนดยืนราคา</label>
                <input type="text" id="docValidity" value="${langDef.QT.def}" class="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" oninput="updatePreview()">
            `;
        } else if (type === 'DO') {
            extraContainer.innerHTML = `
                <label class="font-medium text-slate-400">อ้างอิงใบเสนอราคา / เลขสั่งซื้อ</label>
                <input type="text" id="docRef" value="QT${dateStr}-001" class="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" oninput="updatePreview()">
            `;
        } else if (type === 'RE') {
            extraContainer.innerHTML = `
                <label class="font-medium text-slate-400">ระยะเวลารับประกันงานซ่อม</label>
                <input type="text" id="docWarranty" value="${langDef.RE.def}" class="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" oninput="updatePreview()">
            `;
        }
    }

    updatePreview();
    applyUI();
}

function updateDownloadButtonText() {
    const chkQT = document.getElementById('chk-QT');
    const chkDO = document.getElementById('chk-DO');
    const chkRE = document.getElementById('chk-RE');
    if (!chkQT || !chkDO || !chkRE) return;

    const names = [['QT','ใบเสนอราคา'],['DO','ใบส่งของ'],['RE','ใบเสร็จ/ใบรับประกัน']]
        .filter(([k]) => document.getElementById('chk-' + k).checked).map(x => tr(x[1]));
    const btn = document.getElementById('btnDownloadDynamic');
    if (btn) {
        btn.disabled = names.length === 0;
        btn.innerHTML = !names.length ? '⚠️ ' + tr('กรุณาเลือกเอกสารที่ต้องการดาวน์โหลด')
            : names.length === 3 ? '📥 ' + tr('ดาวน์โหลดเอกสารทั้งหมด (3 ใบ)')
            : '📥 ' + tr('ดาวน์โหลด') + ' (' + names.join(uiLang === 'en' ? ' & ' : ' และ ') + ')';
    }
}

function renderItemInputs() {
    const container = document.getElementById('itemInputsContainer');
    if (!container) return;
    container.innerHTML = '';

    itemsList.forEach((item, idx) => {
        const isDiscount = item.price < 0;
        const card = document.createElement('div');
        card.className = `p-3 bg-slate-950 border ${isDiscount ? 'border-red-900/50' : 'border-slate-800'} rounded-xl text-xs space-y-2 relative`;
        card.innerHTML = `
            <div class="flex justify-between items-center font-bold text-slate-400">
                <span class="${isDiscount ? 'text-red-400' : ''}">${tr('รายการที่')} ${idx + 1} ${isDiscount ? '(ส่วนลด)' : ''}</span>
                ${itemsList.length > 1 ? `<button type="button" onclick="removeItemRow(${idx})" class="text-red-400 hover:text-red-300 font-semibold text-xs">ลบ</button>` : ''}
            </div>
            <div>
                <input type="text" placeholder="ชื่อสินค้า / งานบริการ" value="${item.title}" 
                    class="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg font-medium text-white focus:border-blue-500 outline-none" 
                    oninput="itemsList[${idx}].title = this.value; updatePreview();">
            </div>
            <div>
                <input type="text" placeholder="รายละเอียดเสริม / S/N / ประกัน" value="${item.detail || ''}" 
                    class="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 focus:border-blue-500 outline-none" 
                    oninput="itemsList[${idx}].detail = this.value; updatePreview();">
            </div>
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="text-[10px] text-slate-400">จำนวน</label>
                    <input type="number" value="${item.qty}" min="1" 
                        class="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-center text-white focus:border-blue-500 outline-none" 
                        oninput="itemsList[${idx}].qty = parseFloat(this.value) || 0; updatePreview();">
                </div>
                <div>
                    <label class="text-[10px] text-slate-400">ราคาต่อหน่วย (ติดลบ = ส่วนลด)</label>
                    <input type="number" value="${item.price}" 
                        class="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-right ${isDiscount ? 'text-red-400 font-bold' : 'text-white'} focus:border-blue-500 outline-none price-input" 
                        data-index="${idx}"
                        oninput="handlePriceInput(this)">
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    applyUI();
}

function handlePriceInput(el) {
    const idx = parseInt(el.getAttribute('data-index'));
    itemsList[idx].price = parseFloat(el.value) || 0;
    const card = el.closest('.space-y-2').parentElement;
    if (itemsList[idx].price < 0) {
        card.className = "p-3 bg-slate-950 border border-red-900/50 rounded-xl text-xs space-y-2 relative";
        el.classList.add('text-red-400', 'font-bold');
    } else {
        card.className = "p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-2 relative";
        el.classList.remove('text-red-400', 'font-bold');
        el.classList.add('text-white');
    }
    updatePreview();
}

function addItemRow() {
    itemsList.push({ title: '', detail: '', qty: 1, price: 0 });
    renderItemInputs();
    updatePreview();
}

function removeItemRow(idx) {
    itemsList.splice(idx, 1);
    renderItemInputs();
    updatePreview();
}

function buildDocumentHTML(type) {
    const getVal = (id, fallback = '') => {
        const el = document.getElementById(id);
        return el ? el.value : fallback;
    };

    const shopDef = (SHOP_DEF && SHOP_DEF[docLang]) ? SHOP_DEF[docLang] : { name: 'Just IT Solution', address: '-', taxId: '', bank: '-' };
    const shopName = getVal('shopName') || shopDef.name;
    const shopAddress = getVal('shopAddress') || shopDef.address;
    const shopTax = getVal('shopTaxId') || shopDef.taxId;
    const shopBank = getVal('shopBank') || shopDef.bank;

    const custName = getVal('custName') || '-';
    const custAddress = getVal('custAddress') || '-';
    
    const dateStr = new Date().toISOString().slice(2, 7).replace('-', '');
    const docNo = getVal('docNo') || `${type}${dateStr}-001`;
    const docDate = getVal('docDate') || new Date().toISOString().split('T')[0];
    
    const _pv = getVal('paymentType', 'transfer');
    const docLangObj = (DOCL && DOCL[docLang]) ? DOCL[docLang] : DOCL.th;
    const paymentType = (docLangObj.pays && docLangObj.pays[_pv]) ? docLangObj.pays[_pv] : _pv;
    const userNotes = getVal('customNotes');

    const L = docLangObj;
    const T = (L.t && L.t[type]) ? L.t[type] : L.t.QT;
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
                <tr style="border-bottom: 1px solid #cbd5e1;">
                    <td style="padding: 6px 4px; text-align: center; vertical-align: top; width: 6%;">${idx + 1}</td>
                    <td style="padding: 6px 4px; vertical-align: top; width: 48%;">
                        <div style="font-weight: 700; color: ${isNegative ? '#dc2626' : '#0f172a'};">${item.title || '-'}</div>
                        ${item.detail ? `<div style="font-size: 8pt; color: #475569; margin-top: 1px; white-space: pre-line;">${item.detail}</div>` : ''}
                    </td>
                    <td style="padding: 6px 4px; text-align: center; vertical-align: top; width: 10%;">${item.qty || 0}</td>
                    <td style="padding: 6px 4px; text-align: right; vertical-align: top; width: 18%; color: ${isNegative ? '#dc2626' : '#0f172a'};">${typeof formatMoney === 'function' ? formatMoney(item.price || 0) : item.price}</td>
                    <td style="padding: 6px 4px; text-align: right; vertical-align: top; width: 18%; font-weight: 600; color: ${isNegative ? '#dc2626' : '#0f172a'};">${typeof formatMoney === 'function' ? formatMoney(lineTotal) : lineTotal}</td>
                </tr>
            `;
        });
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

    let vatRowHTML = '';
    if (vatType === 'add') {
        vatRowHTML = `
            <tr>
                <td style="padding: 4px; text-align: right; color: #475569; border-bottom: 1px solid #cbd5e1;">${L.vat}</td>
                <td style="padding: 4px; text-align: right; font-weight: 600; color: #0f172a; border-bottom: 1px solid #cbd5e1;">${typeof formatMoney === 'function' ? formatMoney(vatAmount) : vatAmount}</td>
            </tr>
        `;
    }

    const bahtTxt = typeof moneyText === 'function' ? moneyText(grandTotal) : grandTotal;

    return `
    <div style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; font-family: 'Sarabun', sans-serif; font-size: 9pt; color: #0f172a; background: #ffffff; box-sizing: border-box;">
            <div>
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 10px; box-sizing: border-box;">
                    <div style="width: 60%; box-sizing: border-box;">
                        <h1 style="font-size: 15pt; font-weight: 700; color: #0f172a; margin: 0;" class="heading-font">${shopName}</h1>
                        <p style="font-size: 8.5pt; color: #475569; white-space: pre-line; margin: 3px 0 0 0; line-height: 1.25;">${shopAddress}</p>
                        ${shopTax ? `<p style="font-size: 8.5pt; color: #475569; margin: 2px 0 0 0;">${L.tax}${shopTax}</p>` : ''}
                    </div>
                    <div style="width: 38%; text-align: right; box-sizing: border-box;">
                        <h2 style="font-size: 16pt; font-weight: 800; color: #1e3a8a; margin: 0;" class="heading-font">${docTitle}</h2>
                        ${docSubTitle ? `<p style="font-size: 8pt; font-weight: 700; color: #64748b; margin: 1px 0 0 0;">${docSubTitle}</p>` : ''}
                        <div style="margin-top: 4px; font-size: 9.5pt; font-weight: 700; color: #1e293b;">${L.no} <span style="color: #1e40af;">${docNo}</span></div>
                        <div style="font-size: 8.5pt; color: #475569; margin-top: 1px;">${L.date} ${typeof fmtDate === 'function' ? fmtDate(docDate) : docDate}</div>
                    </div>
                </div>

                <!-- Customer & Metadata Info -->
                <div style="display: flex; justify-content: space-between; align-items: stretch; gap: 10px; margin-bottom: 10px; box-sizing: border-box;">
                    <div style="width: 57%; background-color: #f8fafc; padding: 8px 10px; border-radius: 6px; border: 1px solid #cbd5e1; box-sizing: border-box;">
                        <div style="font-weight: 700; color: #1e3a8a; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; margin-bottom: 4px; font-size: 9pt;" class="heading-font">${L.cust}</div>
                        <div style="font-weight: 700; color: #0f172a; font-size: 9.5pt; margin: 0;">${custName}</div>
                        <div style="color: #475569; line-height: 1.3; margin-top: 2px; white-space: pre-line; font-size: 8.5pt;">${custAddress}</div>
                    </div>
                    <div style="width: 41%; background-color: #f8fafc; padding: 8px 10px; border-radius: 6px; border: 1px solid #cbd5e1; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
                        <div style="display: flex; justify-content: space-between; padding-bottom: 2px; border-bottom: 1px solid #e2e8f0; font-size: 8.5pt;">
                            <span style="color: #64748b;">${metaLabel1}</span>
                            <span style="font-weight: 600; color: #0f172a;">${metaVal1}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 2px 0; border-bottom: 1px solid #e2e8f0; font-size: 8.5pt;">
                            <span style="color: #64748b;">${L.pay}</span>
                            <span style="font-weight: 600; color: #0f172a;">${paymentType}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding-top: 2px; font-size: 8.5pt;">
                            <span style="color: #64748b;">${L.bank}</span>
                            <span style="font-weight: 600; color: #0f172a; font-size: 8pt; text-align: right;">${shopBank}</span>
                        </div>
                    </div>
                </div>

                <!-- Items Table -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 8.5pt; box-sizing: border-box;">
                    <thead>
                        <tr style="background-color: #0f172a; color: #ffffff; height: 26px;">
                            <th style="padding: 4px; text-align: center; border: 1px solid #0f172a; width: 6%;">#</th>
                            <th style="padding: 4px 8px; text-align: left; border: 1px solid #0f172a; width: 48%;">${L.h[1]}</th>
                            <th style="padding: 4px; text-align: center; border: 1px solid #0f172a; width: 10%;">${L.h[2]}</th>
                            <th style="padding: 4px 8px; text-align: right; border: 1px solid #0f172a; width: 18%;">${L.h[3]}</th>
                            <th style="padding: 4px 8px; text-align: right; border: 1px solid #0f172a; width: 18%;">${L.h[4]}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHTML}
                    </tbody>
                </table>

                <!-- Summary & Baht Text Section -->
                <div style="display: flex; justify-content: space-between; align-items: stretch; margin-bottom: 12px; gap: 10px; box-sizing: border-box;">
                    <div style="width: 53%; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; box-sizing: border-box;">
                        <div style="font-size: 8pt; color: #475569; font-weight: 500; width: 100%;">${L.words}</div>
                        <div style="font-size: 9pt; font-weight: 700; color: #1e3a8a; margin-top: 4px; width: 100%;">( ${bahtTxt} )</div>
                    </div>
                    <div style="width: 45%; box-sizing: border-box;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 8.5pt;">
                            <tr>
                                <td style="padding: 4px; text-align: right; color: #475569; border-bottom: 1px solid #cbd5e1;">${L.sub}</td>
                                <td style="padding: 4px; text-align: right; font-weight: 600; color: #0f172a; border-bottom: 1px solid #cbd5e1;">${typeof formatMoney === 'function' ? formatMoney(subtotal) : subtotal}</td>
                            </tr>
                            <tr>
                                <td style="padding: 4px; text-align: right; color: #475569; border-bottom: 1px solid #cbd5e1;">${L.disc}</td>
                                <td style="padding: 4px; text-align: right; font-weight: 600; color: #dc2626; border-bottom: 1px solid #cbd5e1;">${discount > 0 ? `-${typeof formatMoney === 'function' ? formatMoney(discount) : discount}` : '0.00'}</td>
                            </tr>
                            ${vatRowHTML}
                            <tr style="background-color: #f1f5f9; font-weight: 700;">
                                <td style="padding: 6px 4px; text-align: right; color: #0f172a; border-top: 2px solid #0f172a;">
                                    <div>${L.tot}</div>
                                    <div style="font-size: 7pt; color: #64748b; font-weight: 500;">${L.tot2}</div>
                                </td>
                                <td style="padding: 6px 4px; text-align: right; color: #1e3a8a; font-size: 10pt; font-weight: 800; border-top: 2px solid #0f172a;">
                                    ${typeof formatMoney === 'function' ? formatMoney(grandTotal) : grandTotal} ${L.cur}
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>

                <!-- Terms & Conditions -->
                <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 10px; background-color: #f8fafc; font-size: 8pt; color: #475569; box-sizing: border-box;">
                    <div style="font-weight: 700; color: #0f172a; margin-bottom: 2px;" class="heading-font">${L.terms}</div>
                    <div style="white-space: pre-line; line-height: 1.35;">${termsText}</div>
                </div>
            </div>

            <!-- Signatures Footer -->
            <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #cbd5e1; text-align: center; font-size: 8.5pt; box-sizing: border-box; margin-top: 10px;">
                <div style="width: 46%; box-sizing: border-box;">
                    <div style="color: #475569; font-weight: 500; margin-bottom: 25px;">${L.on} <span style="font-weight: 700; color: #0f172a;">${shopName}</span></div>
                    <div>
                        <div style="color: #0f172a; font-weight: 600;">${L.sign}</div>
                        <div style="font-size: 8pt; color: #475569; margin-top: 2px;">${signLeftLabel}</div>
                        <div style="font-size: 7.5pt; color: #94a3b8; margin-top: 1px;">${L.dl}</div>
                    </div>
                </div>
                <div style="width: 46%; box-sizing: border-box;">
                    <div style="color: #475569; font-weight: 500; margin-bottom: 25px;">${L.on} <span style="font-weight: 700; color: #0f172a;">${custName}</span></div>
                    <div>
                        <div style="color: #0f172a; font-weight: 600;">${L.sign}</div>
                        <div style="font-size: 8pt; color: #475569; margin-top: 2px;">${signRightLabel}</div>
                        <div style="font-size: 7.5pt; color: #94a3b8; margin-top: 1px;">${L.dl}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function updatePreview() {
    const printArea = document.getElementById('documentPrintArea');
    if (printArea) {
        printArea.innerHTML = buildDocumentHTML(currentDocType);
    }
}

function adjustZoom(delta) {
    zoomScale = Math.max(0.5, Math.min(1.5, zoomScale + delta));
    applyZoom();
}

function resetZoom() {
    zoomScale = 1.0;
    applyZoom();
}

function openFullscreenPreview() {
    const modal = document.getElementById('fullscreenModal');
    const container = document.getElementById('modalA4Container');
    const srcDoc = document.getElementById('documentPrintArea');
    if (!modal || !container || !srcDoc) return;
    
    container.innerHTML = '';
    const clone = srcDoc.cloneNode(true);
    clone.style.transform = 'none';
    container.appendChild(clone);
    
    modal.classList.remove('hidden');
}

function closeFullscreenPreview() {
    const modal = document.getElementById('fullscreenModal');
    if (modal) modal.classList.add('hidden');
}

function saveShopInfo() {
    const shopData = {
        name: document.getElementById('shopName') ? document.getElementById('shopName').value : '',
        address: document.getElementById('shopAddress') ? document.getElementById('shopAddress').value : '',
        taxId: document.getElementById('shopTaxId') ? document.getElementById('shopTaxId').value : '',
        bank: document.getElementById('shopBank') ? document.getElementById('shopBank').value : ''
    };
    localStorage.setItem('it_doc_shop_info', JSON.stringify(shopData));
    alert(tr('บันทึกข้อมูลร้านค้าลงในเครื่องเรียบร้อยแล้ว!'));
}

function loadShopInfo() {
    const saved = localStorage.getItem('it_doc_shop_info');
    const data = saved ? JSON.parse(saved) : (SHOP_DEF[docLang] || SHOP_DEF.th);
    
    const nameEl = document.getElementById('shopName');
    const addrEl = document.getElementById('shopAddress');
    const taxEl = document.getElementById('shopTaxId');
    const bankEl = document.getElementById('shopBank');

    if (nameEl) nameEl.value = data.name || '';
    if (addrEl) addrEl.value = data.address || '';
    if (taxEl) taxEl.value = data.taxId || '';
    if (bankEl) bankEl.value = data.bank || '';
}

function loadSampleData() {
    const custNameEl = document.getElementById('custName');
    const custAddrEl = document.getElementById('custAddress');
    if (custNameEl && SAMPLE_CUST[docLang]) custNameEl.value = SAMPLE_CUST[docLang].name;
    if (custAddrEl && SAMPLE_CUST[docLang]) custAddrEl.value = SAMPLE_CUST[docLang].addr;
    
    if (SAMPLE_ITEMS && SAMPLE_ITEMS[docLang]) {
        itemsList = SAMPLE_ITEMS[docLang].map(x => ({...x}));
    }
    renderItemInputs();
    updatePreview();
}

function resetCustomerForm() {
    const custNameEl = document.getElementById('custName');
    const custAddrEl = document.getElementById('custAddress');
    const discEl = document.getElementById('discountAmount');
    const vatEl = document.getElementById('vatType');
    const selectEl = document.getElementById('savedCustomersSelect');

    if (custNameEl) custNameEl.value = '';
    if (custAddrEl) custAddrEl.value = '';
    if (discEl) discEl.value = '0';
    if (vatEl) vatEl.value = 'none';
    if (selectEl) selectEl.value = '';

    itemsList = [{ title: '', detail: '', qty: 1, price: 0 }];
    renderItemInputs();
    updatePreview();
}