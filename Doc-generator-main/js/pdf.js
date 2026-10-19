async function renderPDFOffScreen(docTypeTarget) {
    const renderBox = document.getElementById('pdfRenderContainer');
    renderBox.innerHTML = buildDocumentHTML(docTypeTarget);

    const canvas = await html2canvas(renderBox, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
    });

    renderBox.innerHTML = '';

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

    const dateStr = new Date().toISOString().slice(2, 7).replace('-', '');
    const rawDocNo = document.getElementById('docNo').value || `${docTypeTarget}${dateStr}-001`;
    const filename = `${docTypeTarget}_${rawDocNo}.pdf`;
    
    pdf.save(filename);
}

async function downloadSelectedPDFs() {
    if (!validateForm()) return;

    const chkQT = document.getElementById('chk-QT').checked;
    const chkDO = document.getElementById('chk-DO').checked;
    const chkRE = document.getElementById('chk-RE').checked;

    const selected = [];
    if (chkQT) selected.push('QT');
    if (chkDO) selected.push('DO');
    if (chkRE) selected.push('RE');

    if (selected.length === 0) return;

    const btn = document.getElementById('btnDownloadDynamic');
    btn.disabled = true;

    for (let i = 0; i < selected.length; i++) {
        const type = selected[i];
        btn.innerHTML = `⏳ ${tr('กำลังสร้าง PDF')} (${type}) [${i + 1}/${selected.length}]...`;
        await renderPDFOffScreen(type);
        await new Promise(r => setTimeout(r, 400));
    }

    updateDownloadButtonText();
    btn.disabled = false;
}

function handlePrint() {
    if (!validateForm()) return;
    window.print();
}