function setDocType(type) {
    currentDocType = type;
    const pvLabel = document.getElementById('pvCurrentTypeLabel');
    if (pvLabel) pvLabel.innerText = type;
    
    const mobileLabel = document.getElementById('mobileCurrentDocLabel');
    if (mobileLabel) mobileLabel.innerText = type;
    
    ['QT', 'DO', 'RE'].forEach(t => {
        const btn = document.getElementById(`tab-${t}`);
        if (btn) {
            if (t === type) {
                btn.className = "flex-1 md:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all bg-blue-600 text-white shadow-md shadow-blue-600/30";
            } else {
                btn.className = "flex-1 md:flex-none px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all text-slate-400 hover:text-white hover:bg-slate-900";
            }
        }
    });

    const docNoInput = document.getElementById('docNo');
    const dateStr = new Date().toISOString().slice(2, 7).replace('-', '');
    if (docNoInput) docNoInput.value = `${type}${dateStr}-001`;

    const extraContainer = document.getElementById('metaExtraField');
    if (extraContainer) {
        if (type === 'QT') {
            extraContainer.innerHTML = `
                <label class="font-medium text-slate-400">กำหนดยืนราคา</label>
                <input type="text" id="docValidity" value="${DOCL[docLang].t.QT.def}" class="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" oninput="updatePreview()">
            `;
        } else if (type === 'DO') {
            extraContainer.innerHTML = `
                <label class="font-medium text-slate-400">อ้างอิงใบเสนอราคา / เลขสั่งซื้อ</label>
                <input type="text" id="docRef" value="QT${dateStr}-001" class="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" oninput="updatePreview()">
            `;
        } else if (type === 'RE') {
            extraContainer.innerHTML = `
                <label class="font-medium text-slate-400">ระยะเวลารับประกันงานซ่อม</label>
                <input type="text" id="docWarranty" value="${DOCL[docLang].t.RE.def}" class="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" oninput="updatePreview()">
            `;
        }
    }

    updatePreview();
    applyUI();
}