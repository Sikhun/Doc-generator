const SHOP_DEF = {
    th: {
        name: 'Just IT Solution',
        address: '31/383 หมู่ 1 ต.รังสิต อ.ธัญบุรี จ.ปทุมธานี 12110\nโทร: 095-465-9446 | Line ID: it234',
        taxId: '0000000000000',
        bank: 'Donate กสิกรไทย 235-3-50991-0'
    },
    en: {
        name: 'Just IT Solution',
        address: '31/383 Moo 1, Rangsit, Thanyaburi, Pathum Thani 12110\nTel: 095-465-9446 | Line ID: it234',
        taxId: '0000000000000',
        bank: 'Donate Kasikornbank 235-3-50991-0'
    }
};

const SAMPLE_CUST = {
    th: { name: 'คุณสมชาย (บริษัท ไอทีเน็ต จำกัด)', addr: '99/9 ถนนวิภาวดีรังสิต แขวงจอมพล เขตจตุจักร กรุงเทพฯ 10900' },
    en: { name: 'Mr. Somchai (ITNet Co., Ltd.)', addr: '99/9 Vibhavadi Rangsit Rd, Chom Phon, Chatuchak, Bangkok 10900' }
};

const SAMPLE_ITEMS = {
    th: [
        { title: 'ค่าบริการตรวจเช็กและซ่อม Onsite', detail: 'บริการตรวจเช็กอาการเครื่องดับ / ทำความสะอาดชุด Optical', qty: 1, price: 500 },
        { title: 'Power Supply 650W 80+ Bronze', detail: 'S/N: PSU8823901 | ประกันศูนย์ 3 ปี', qty: 1, price: 1850 },
        { title: 'ส่วนลดค่าบริการตรวจเช็ก Onsite', detail: 'หักค่าน้ำมันตรวจเช็กเมื่อตกลงซ่อมเปลี่ยนอะไหล่', qty: 1, price: -500 }
    ],
    en: [
        { title: 'Onsite Inspection & Repair Service', detail: 'System diagnostic / Optical cleaning', qty: 1, price: 500 },
        { title: 'Power Supply 650W 80+ Bronze', detail: 'S/N: PSU8823901 | 3 Years Warranty', qty: 1, price: 1850 },
        { title: 'Onsite Service Discount', detail: 'Fuel discount upon repair confirmation', qty: 1, price: -500 }
    ]
};

const UI_EN = {
    '📄 ใบเสนอราคา (QT)':'📄 Quotation (QT)','🚚 ใบส่งของ (DO)':'🚚 Delivery Order (DO)','🧾 ใบเสร็จ/รับประกัน (RE)':'🧾 Receipt/Warranty (RE)',
    '📝 กรอกข้อมูลเอกสาร':'📝 Fill in details','👁️ ดูตัวอย่าง A4 (':'👁️ A4 Preview (',
    '🌐 ภาษาของเอกสาร':'🌐 Document language','💾 บันทึกร้านค้า':'💾 Save shop','⚡ ตัวอย่าง':'⚡ Sample','🗑️ ล้างข้อมูล':'🗑️ Clear',
    '1. ข้อมูลร้านค้า / ผู้ให้บริการ':'1. Shop / Service provider','บันทึกอัตโนมัติ':'Auto-save','ชื่อร้าน / บริษัท':'Shop / Company name',
    'ที่อยู่ & เบอร์โทรศัพท์':'Address & phone','เลขผู้เสียภาษี':'Tax ID','บัญชีธนาคาร':'Bank account','ถ้ามี':'If any','ธนาคาร / เลขบัญชี':'Bank / account no.',
    '2. ข้อมูลลูกค้า & เอกสาร':'2. Customer & document','เลขที่เอกสาร':'Document no.','วันที่ออกเอกสาร':'Issue date','ชื่อลูกค้า / บริษัท':'Customer / company name',
    'เช่น คุณสมชาย (บริษัท ไอทีเน็ต จำกัด)':'e.g. Mr. Somchai (ITNet Co., Ltd.)','ที่อยู่ / จุดบริการ Onsite / เบอร์โทร':'Address / onsite location / phone',
    'ที่อยู่จัดส่ง หรือ จุดรับบริการ Onsite':'Delivery address or onsite service location','กำหนดยืนราคา':'Price validity',
    'อ้างอิงใบเสนอราคา / เลขสั่งซื้อ':'Quotation ref. / PO no.','ระยะเวลารับประกันงานซ่อม':'Repair warranty period',
    '3. รายการสินค้า & ค่าบริการ':'3. Items & services','+ เพิ่มรายการ':'+ Add item','รายการที่':'Item','ลบ':'Delete',
    'ชื่อสินค้า / งานบริการ':'Product / service name','รายละเอียดเสริม / S/N / ประกัน':'Extra details / S/N / warranty','จำนวน':'Qty',
    'ราคาต่อหน่วย (บาท)':'Unit price (THB)','ส่วนลดท้ายบิล (บาท)':'Overall discount (THB)','วิธีชำระเงิน':'Payment method',
    'โอนเงินผ่านธนาคาร':'Bank transfer','เงินสด':'Cash','เครดิต 30 วัน':'Credit 30 days','4. เงื่อนไขการรับประกัน & หมายเหตุ':'4. Warranty terms & notes',
    '🖨️ สั่งพิมพ์เอกสาร (Print A4)':'🖨️ Print document (A4)','ดาวน์โหลดเอกสาร (PDF)':'Download documents (PDF)','ติ๊กเลือกใบที่ต้องการ':'Tick the ones you need',
    'ใบเสนอราคา':'Quotation','ใบส่งของ':'Delivery Order','ใบเสร็จ/ประกัน':'Receipt/Warranty','ใบเสร็จ/ใบรับประกัน':'Receipt/Warranty',
    '🔍 ขยายเต็มจอ':'🔍 Fullscreen','✕ ปิดหน้าต่าง':'✕ Close','กรุณาเลือกเอกสารที่ต้องการดาวน์โหลด':'Please select documents to download',
    'ดาวน์โหลดเอกสารทั้งหมด (3 ใบ)':'Download all documents (3)','ดาวน์โหลด':'Download','กำลังสร้าง PDF':'Generating PDF',
    'บันทึกข้อมูลร้านค้าลงในเครื่องเรียบร้อยแล้ว!':'Shop info saved on this device!',
    '💾 บันทึกลูกค้า':'💾 Save Customer','👥 เลือกลูกค้าที่เคยบันทึกไว้':'👥 Select Saved Customer',
    'ไม่มี VAT (0%)':'No VAT (0%)','คิด VAT 7%':'Add VAT 7%'
};

const DOCL = {
    th: { shopFb:'ชื่อร้านค้า', tax:'เลขประจำตัวผู้เสียภาษี:', no:'เลขที่:', date:'วันที่:', cust:'ชื่อลูกค้า / บริษัท:', pay:'การชำระเงิน:', bank:'ธนาคาร:',
        h:['#','รายการสินค้า / ค่าบริการ','จำนวน','ราคา/หน่วย','จำนวนเงิน'], words:'จำนวนเงินตัวหนังสือ / Thai Baht Text',
        sub:'รวมเป็นเงิน (Subtotal)', disc:'ส่วนลด (Discount)', vat:'ภาษีมูลค่าเพิ่ม (VAT 7%)', tot:'รวมทั้งสิ้น', tot2:'(Grand Total)', cur:'บาท', terms:'เงื่อนไขและการรับประกัน (Terms & Conditions):',
        on:'ในนาม', sign:'ลงชื่อ..........................................................', dl:'วันที่ ..... / ..... / .........',
        pays:{ transfer:'โอนเงินผ่านบัญชีธนาคาร', cash:'เงินสด', credit:'เครดิต 30 วัน' },
        t:{ QT:{ title:'ใบเสนอราคา', sub:'QUOTATION', meta:'กำหนดยืนราคา:', def:'7 วัน', terms:'1. ราคานี้ยืนยันตามระยะเวลาที่กำหนดด้านบน\n2. กำหนดชำระเงินเมื่อติดตั้ง/ส่งมอบงานเสร็จสิ้น', sl:'( ผู้เสนอราคา / ช่างผู้ให้บริการ )', sr:'( ผู้อนุมัติสั่งซื้อ / ผู้รับบริการ )' },
            DO:{ title:'ใบส่งของ / ใบแจ้งหนี้', sub:'DELIVERY ORDER', meta:'อ้างอิงใบเสนอราคา:', def:'-', terms:'1. กรุณาตรวจสอบสภาพสินค้า/อุปกรณ์ทันทีที่ได้รับ\n2. สินค้ารับประกันตามเงื่อนไขที่ระบุในรายการ', sl:'( ผู้ส่งมอบของ / ช่าง )', sr:'( ผู้รับมอบสินค้า / ลูกค้า )' },
            RE:{ title:'ใบเสร็จรับเงิน / ใบรับประกัน', sub:'RECEIPT / WARRANTY', meta:'ประกันงานซ่อม:', def:'30 วัน (อาการเดิม)', terms:'1. ได้รับชำระเงินถูกต้องเรียบร้อยแล้ว\n2. งานบริการ Onsite/งานซ่อม รับประกันอาการเดิมนับจากวันที่ออกบิล\n3. ไม่ครอบคลุมกรณี ตกน้ำ, ไฟไหม้, คราบไหม้/ช็อต หรือการแกะดัดแปลง', sl:'( ผู้รับเงิน / ช่างผู้ให้บริการ )', sr:'( ผู้ชำระเงิน / ลูกค้า )' } } },
    en: { shopFb:'Shop Name', tax:'Tax ID:', no:'No.:', date:'Date:', cust:'Customer / Company:', pay:'Payment:', bank:'Bank:',
        h:['#','Description','Qty','Unit Price','Amount'], words:'Amount in Words',
        sub:'Subtotal', disc:'Discount', vat:'VAT 7%', tot:'Total', tot2:'(Grand Total)', cur:'THB', terms:'Terms & Conditions:',
        on:'On behalf of', sign:'Signature: ....................................................', dl:'Date ..... / ..... / .........',
        pays:{ transfer:'Bank Transfer', cash:'Cash', credit:'Credit 30 days' },
        t:{ QT:{ title:'QUOTATION', sub:'', meta:'Valid for:', def:'7 days', terms:'1. This quotation is valid for the period stated above.\n2. Payment is due upon completion of installation / delivery.', sl:'( Quoted by / Service Technician )', sr:'( Authorized Buyer / Customer )' },
            DO:{ title:'DELIVERY ORDER / INVOICE', sub:'', meta:'Quotation ref.:', def:'-', terms:'1. Please inspect the goods/equipment immediately upon receipt.\n2. Goods are covered by the warranty terms stated in the item list.', sl:'( Delivered by / Technician )', sr:'( Received by / Customer )' },
            RE:{ title:'RECEIPT / WARRANTY', sub:'', meta:'Repair warranty:', def:'30 days (same issue)', terms:'1. Payment received in full.\n2. Onsite service / repair work is warranted for the same issue from the invoice date.\n3. Not covered: water damage, fire, burn marks/short circuit, or unauthorized opening/modification.', sl:'( Received by / Service Technician )', sr:'( Paid by / Customer )' } } }
};