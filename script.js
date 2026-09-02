// =========================================================
// SCRIPT.JS - ระบบสไลด์ภาพข่าวสาร (Automatic News Slider)
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
    const track = document.getElementById("slider-track");
    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const dots = document.querySelectorAll(".dot");
    const sliderContainer = document.querySelector(".slider-container");

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoSlideInterval;

    // ฟังก์ชันเปลี่ยนภาพตาม Index (เลื่อนภาพไปด้านซ้ายตามลำดับ)
    function updateSlider(index) {
        if (index < 0) {
            currentIndex = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        // เลื่อนภาพไปทางซ้ายด้วย transform
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // เปลี่ยนสถานะจุด Dot ให้สัมพันธ์กับภาพปัจจุบัน
        dots.forEach(dot => dot.classList.remove("active"));
        if (dots[currentIndex]) {
            dots[currentIndex].classList.add("active");
        }
    }

    // เริ่มการสไลด์ภาพอัตโนมัติ (ทุกๆ 3.5 วินาที)
    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
            updateSlider(currentIndex + 1);
        }, 3500);
    }

    // หยุดการสไลด์ภาพอัตโนมัติ
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    // เมื่อกดปุ่มขวา (ถัดไป)
    nextBtn.addEventListener("click", () => {
        updateSlider(currentIndex + 1);
        startAutoSlide(); // รีเซ็ตเวลานับถอยหลังใหม่
    });

    // เมื่อกดปุ่มซ้าย (ย้อนกลับ)
    prevBtn.addEventListener("click", () => {
        updateSlider(currentIndex - 1);
        startAutoSlide(); // รีเซ็ตเวลานับถอยหลังใหม่
    });

    // เมื่อกดจุด Dot บอกตำแหน่ง
    dots.forEach(dot => {
        dot.addEventListener("click", function () {
            const index = parseInt(this.getAttribute("data-index"));
            updateSlider(index);
            startAutoSlide();
        });
    });

    // หยุดสไลด์อัตโนมัติเมื่อผู้ใช้วางเมาส์เหนือรูปภาพ และเล่นต่อเมื่อนำเมาส์ออก
    sliderContainer.addEventListener("mouseenter", stopAutoSlide);
    sliderContainer.addEventListener("mouseleave", startAutoSlide);

    // เริ่มทำงานระบบสไลด์ภาพ
    startAutoSlide();
});

// =========================================================
// SCRIPT.JS - ระบบสลับหน้า & ตัวละครผู้บริหาร Interactive + ปุ่มเลื่อน
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    // --- 1. ข้อมูลผู้บริหารทั้ง 8 ท่าน ---
    const executivesData = [
        {
            name: "นายสมมิทธิ์ ทิพยมณฑล",
            role: "ผู้รับใบอนุญาตและผู้จัดการ",
            image: "exec_1.png"
        },
        {
            name: "นายฉลวย พันธ์ทอง",
            role: "ผู้อำนวยการ",
            image: "exec_2.png"
        },
        {
            name: "นายศิรภพ เจริญกุศล",
            role: "รองผู้อำนวยการฝ่ายส่งเสริมการศึกษา",
            image: "exec_3.png"
        },
        {
            name: "นายประสิทธิ์ ชูดวง",
            role: "รองผู้อำนวยการฝ่ายกิจการนักศึกษา",
            image: "exec_4.png"
        },
        {
            name: "นายครรชิต เมฆขลา",
            role: "รองผู้อำนวยการฝ่ายวิชาการ",
            image: "exec_5.png"
        },
        {
            name: "นางวิมพ์ภากุล เตรียมสันติภาพ",
            role: "รองผู้จัดการฝ่ายบริหาร",
            image: "exec_6.png"
        },
        {
            name: "นายอุทัย ศรีสุวรรณ์",
            role: "รองผู้จัดการฝ่ายอาคารสถานที่และงานบริการ",
            image: "exec_7.png"
        },
        {
            name: "นายอุดมเดช ต.เจริญ",
            role: "ที่ปรึกษาฝ่ายอาคารสถานที่และงานบริการ",
            image: "exec_8.png"
        }
    ];

    let currentExecIndex = 0;

    // Element References
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".page-section");
    const backHomeBtn = document.getElementById("back-home-btn");
    const staffBackHomeBtn = document.getElementById("staff-back-home-btn");
    const studentBackHomeBtn = document.getElementById("student-back-home-btn");

    const execNameEl = document.getElementById("exec-name");
    const execRoleEl = document.getElementById("exec-role");
    const execWrapperEl = document.getElementById("exec-character-wrapper");
    const execPrevBtn = document.getElementById("exec-prev-btn");
    const execNextBtn = document.getElementById("exec-next-btn");

    // --- 2. ฟังก์ชันสลับหน้า (SPA Navigation) ---
    function switchPage(targetId) {
        sections.forEach(sec => sec.classList.remove("active"));
        navLinks.forEach(link => link.classList.remove("active"));

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add("active");
        }

        const activeLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add("active");
        }

        // ปรับแต่ง Theme สีของ Body ตามหน้า
        document.body.classList.remove("light-theme", "light-student-theme");
        if (targetId === "staff-section") {
            document.body.classList.add("light-theme");
        } else if (targetId === "student-section") {
            document.body.classList.add("light-student-theme");
        }
    }

    // คลิกเมนูเพื่อสลับหน้า
    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("data-target");
            switchPage(targetId);
        });
    });

    // ปุ่มกลับหน้าหลัก
    [backHomeBtn, staffBackHomeBtn, studentBackHomeBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener("click", () => switchPage("home-section"));
        }
    });

    // --- 3. ฟังก์ชันเรนเดอร์และเลื่อนตัวละครผู้บริหาร ---
    function renderExecutives() {
        if (!execWrapperEl) return;
        execWrapperEl.innerHTML = "";

        executivesData.forEach((item, index) => {
            const charDiv = document.createElement("div");
            charDiv.className = `exec-char-item ${index === currentExecIndex ? 'active' : ''}`;
            charDiv.innerHTML = `<img src="${item.image}" alt="${item.name}">`;

            charDiv.addEventListener("click", () => {
                updateExecDisplay(index);
            });

            execWrapperEl.appendChild(charDiv);
        });
    }

    function updateExecDisplay(index) {
        if (index < 0) {
            currentExecIndex = executivesData.length - 1;
        } else if (index >= executivesData.length) {
            currentExecIndex = 0;
        } else {
            currentExecIndex = index;
        }

        const exec = executivesData[currentExecIndex];
        if (execNameEl && execRoleEl) {
            const infoBox = document.getElementById("exec-info-box");
            infoBox.classList.remove("fade-in");
            void infoBox.offsetWidth; // Trigger Reflow
            infoBox.classList.add("fade-in");

            execNameEl.textContent = exec.name;
            execRoleEl.textContent = exec.role;
        }

        const items = document.querySelectorAll(".exec-char-item");
        items.forEach((item, idx) => {
            item.classList.toggle("active", idx === currentExecIndex);
        });
    }

    // Event ปุ่มซ้าย-ขวา ผู้บริหาร
    if (execPrevBtn) {
        execPrevBtn.addEventListener("click", () => updateExecDisplay(currentExecIndex - 1));
    }
    if (execNextBtn) {
        execNextBtn.addEventListener("click", () => updateExecDisplay(currentExecIndex + 1));
    }

    // เริ่มต้นแสดงผลผู้บริหาร
    renderExecutives();
});

// =========================================================
// SCRIPT.JS - ระบบจัดการข้อมูลบุคลากร (Staff Interactive & Theme Toggle)
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    // 1. ข้อมูลบุคลากรตัวอย่าง
    const staffData = [
        {
            name: "นายภราดร ทองศิริ",
            role: "หัวหน้าสาขาวิชาเทคนิคเครื่องกล",
            dept: "เทคนิคเครื่องกล",
            image: "staff_1.png"
        },
        {
            name: "นายพิภพ ปัญญาฟู",
            role: "หัวหน้าสาขาวิชาไฟฟ้าและอิเล็กทรอนิกส์",
            dept: "ไฟฟ้าและอิเล็กทรอนิกส์",
            image: "staff_2.png"
        },
        {
            name: "นางสาวมยุลีย์ พงษ์บุพศิริกุล",
            role: "หัวหน้าสาขาวิชาเทคโนโลยีสารสนเทศ",
            dept: "เทคโนโลยีสารสนเทศ",
            image: "staff_3.png"
        },
        {
            name: "นายณัฐพล อุ่นภักดิ์",
            role: "หัวหน้าสาขาวิชาบริหารธุรกิจ",
            dept: "บริหารธุรกิจ",
            image: "staff_4.png"
        },
        {
            name: "นางสาวจริยา คำปัน",
            role: "หัวหน้าสาขาวิชาการท่องเที่ยวและโรงแรม",
            dept: "การท่องเที่ยวและการโรงแรม",
            image: "staff_5.png"
        },
        {
            name: "นายวิสูตร์ ปันนา",
            role: "หัวหน้าสาขาวิชาก่อสร้างและสถาปัตยกรรม",
            dept: "ก่อสร้างและสถาปัตยกรรม",
            image: "staff_6.png"
        }
    ];

    let filteredStaff = [...staffData];
    let currentStaffIndex = 0;

    // Element References
    const staffWrapper = document.getElementById("staff-character-wrapper");
    const staffNameEl = document.getElementById("staff-name");
    const staffRoleEl = document.getElementById("staff-role");
    const staffDeptEl = document.getElementById("staff-dept");
    const staffEmailEl = document.getElementById("staff-email");
    const staffPhoneEl = document.getElementById("staff-phone");
    const staffInfoBox = document.getElementById("staff-info-box");

    const staffPrevBtn = document.getElementById("staff-prev-btn");
    const staffNextBtn = document.getElementById("staff-next-btn");
    const searchInput = document.getElementById("staff-search-input");
    const deptFilter = document.getElementById("staff-dept-filter");
    const staffBackBtn = document.getElementById("staff-back-home-btn");

    // 2. ปรับปรุงฟังก์ชัน switchPage เพื่อรองรับการสลับธีม (มืด/สว่าง)
    const originalNavLinks = document.querySelectorAll(".nav-link");
    originalNavLinks.forEach(link => {
        link.addEventListener("click", function () {
            const target = this.getAttribute("data-target");
            toggleThemeBySection(target);
        });
    });

    function toggleThemeBySection(targetId) {
        if (targetId === "staff-section") {
            document.body.classList.add("light-theme");
        } else {
            document.body.classList.remove("light-theme");
        }
    }

    if (staffBackBtn) {
        staffBackBtn.addEventListener("click", () => {
            const homeLink = document.querySelector('[data-target="home-section"]');
            if (homeLink) homeLink.click();
            toggleThemeBySection("home-section");
        });
    }

    // 3. แสดงผลบุคลากรบน Stage
    function renderStaff() {
        if (!staffWrapper) return;
        staffWrapper.innerHTML = "";

        if (filteredStaff.length === 0) {
            staffWrapper.innerHTML = "<p style='color:#666;'>ไม่พบข้อมูลบุคลากรที่ค้นหา</p>";
            if (staffNameEl) staffNameEl.innerText = "ไม่พบข้อมูล";
            if (staffRoleEl) staffRoleEl.innerText = "-";
            if (staffDeptEl) staffDeptEl.innerText = "-";
            if (staffEmailEl) staffEmailEl.innerText = "";
            if (staffPhoneEl) staffPhoneEl.innerText = "";
            return;
        }

        filteredStaff.forEach((staff, index) => {
            const charItem = document.createElement("div");
            charItem.className = `staff-char-item ${index === currentStaffIndex ? 'active' : ''}`;

            const scaleFactor = 1 - (Math.abs(index - currentStaffIndex) * 0.12);
            const heightPx = Math.max(140, 260 * scaleFactor);
            charItem.style.height = `${heightPx}px`;

            const img = document.createElement("img");
            img.src = staff.image;
            img.alt = staff.name;
            // หากไม่มีรูปจริง ให้ใช้ภาพจาก placeholder
            img.onerror = function () {
                this.src = `https://via.placeholder.com/180x260/008037/ffffff?text=${encodeURIComponent(staff.name)}`;
            };

            charItem.appendChild(img);
            charItem.addEventListener("click", () => selectStaff(index));
            staffWrapper.appendChild(charItem);
        });

        updateStaffDetails();
    }

    function selectStaff(index) {
        if (filteredStaff.length === 0) return;

        if (index < 0) {
            currentStaffIndex = filteredStaff.length - 1;
        } else if (index >= filteredStaff.length) {
            currentStaffIndex = 0;
        } else {
            currentStaffIndex = index;
        }

        if (staffInfoBox) {
            staffInfoBox.classList.remove("fade-in");
            void staffInfoBox.offsetWidth;
            staffInfoBox.classList.add("fade-in");
        }

        renderStaff();
    }

    function updateStaffDetails() {
        const staff = filteredStaff[currentStaffIndex];
        if (!staff) return;

        if (staffNameEl) staffNameEl.innerText = staff.name;
        if (staffRoleEl) staffRoleEl.innerText = staff.role;
        if (staffDeptEl) staffDeptEl.innerText = `แผนกวิชา${staff.dept}`;
        if (staffEmailEl) staffEmailEl.innerText = `📧 ${staff.email}`;
        if (staffPhoneEl) staffPhoneEl.innerText = `📞 ${staff.phone}`;
    }

    // 4. ปุ่มกดเลื่อน ซ้าย - ขวา
    if (staffPrevBtn) {
        staffPrevBtn.addEventListener("click", () => selectStaff(currentStaffIndex - 1));
    }
    if (staffNextBtn) {
        staffNextBtn.addEventListener("click", () => selectStaff(currentStaffIndex + 1));
    }

    // 5. ระบบ ค้นหา & กรองตามแผนก
    function filterStaffData() {
        const query = searchInput ? searchInput.value.toLowerCase() : "";
        const selectedDept = deptFilter ? deptFilter.value : "all";

        filteredStaff = staffData.filter(staff => {
            const matchQuery = staff.name.toLowerCase().includes(query) || staff.role.toLowerCase().includes(query);
            const matchDept = selectedDept === "all" || staff.dept === selectedDept;
            return matchQuery && matchDept;
        });

        currentStaffIndex = 0;
        renderStaff();
    }

    if (searchInput) searchInput.addEventListener("input", filterStaffData);
    if (deptFilter) deptFilter.addEventListener("change", filterStaffData);

    // เริ่มต้นแสดงผล
    renderStaff();
});

// =========================================================
// SCRIPT.JS - ระบบข้อมูลนักเรียน/นักศึกษา (Student Section)
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    // 1. รายชื่อข้อมูลนักเรียน/นักศึกษา
    const studentData = [
        {
            name: "นายชินวัตร มั่นคง",
            level: "ปวส.",
            dept: "เทคนิคเครื่องกล",
            code: "67219010067",
            status: "ปกติ",
            image: "student_1.png"
        },
        {
            name: "นางสาวศิริดารา บุญเพิ่มพูล",
            level: "ปวส.",
            dept: "เทคโนโลยีสารสนเทศ",
            code: "67219010063",
            status: "ปกติ",
            image: "student_2.png"
        }
    ];

    // ฟังก์ชัน Render รูปและการ์ดนักศึกษา
    function renderStudents() {
        if (!studentGrid) return;
        studentGrid.innerHTML = "";

        if (filteredStudent.length === 0) {
            studentGrid.innerHTML = "<p style='color:#64748b; grid-column: 1/-1; text-align:center; padding: 20px;'>ไม่พบข้อมูลนักศึกษา</p>";
            return;
        }

        filteredStudent.forEach(std => {
            const card = document.createElement("div");
            card.className = "student-item-card";

            card.innerHTML = `
                <div class="student-avatar-box">
                    <img src="${std.image}" alt="${std.name}" onerror="this.src='https://via.placeholder.com/150/0284c7/ffffff?text=${encodeURIComponent(std.name)}'">
                </div>
                <h3>${std.name}</h3>
                <span class="student-item-badge">ระดับชั้น ${std.level}</span>
                <div class="student-item-info">
                    <div><b>สาขาวิชา:</b> ${std.dept}</div>
                    <div><b>รหัสนักศึกษา:</b> ${std.code}</div>
                    <div><b>สถานะ:</b> 🟢 ${std.status}</div>
                </div>
            `;

            studentGrid.appendChild(card);
        });
    }

    let filteredStudent = [...studentData];

    // Elements Reference
    const studentGrid = document.getElementById("student-grid");
    const studentSearchInput = document.getElementById("student-search-input");
    const studentLevelFilter = document.getElementById("student-level-filter");
    const studentBackBtn = document.getElementById("student-back-home-btn");

    // 2. การสลับธีมพื้นหลังสีขาว-ฟ้า
    const allNavLinks = document.querySelectorAll(".nav-link");
    allNavLinks.forEach(link => {
        link.addEventListener("click", function () {
            const target = this.getAttribute("data-target");
            applyThemeBySection(target);
        });
    });

    function applyThemeBySection(targetId) {
        document.body.classList.remove("light-theme", "light-student-theme");

        if (targetId === "staff-section") {
            document.body.classList.add("light-theme");
        } else if (targetId === "student-section") {
            document.body.classList.add("light-student-theme");
        }
    }

    if (studentBackBtn) {
        studentBackBtn.addEventListener("click", () => {
            const homeLink = document.querySelector('[data-target="home-section"]');
            if (homeLink) homeLink.click();
            applyThemeBySection("home-section");
        });
    }

    // 3. แสดงผลรายชื่อนักศึกษาในรูปแบบ Cards
    function renderStudents() {
        if (!studentGrid) return;
        studentGrid.innerHTML = "";

        if (filteredStudent.length === 0) {
            studentGrid.innerHTML = "<p style='color:#64748b; grid-column: 1/-1; text-align:center; padding: 20px;'>ไม่พบข้อมูลนักศึกษาตามเงื่อนไขที่ระบุ</p>";
            return;
        }

        filteredStudent.forEach(std => {
            const card = document.createElement("div");
            card.className = "student-item-card";

            card.innerHTML = `
                <h3>${std.name}</h3>
                <span class="student-item-badge">ระดับชั้น ${std.level}</span>
                <div class="student-item-info">
                    <div><b>สาขาวิชา:</b> ${std.dept}</div>
                    <div><b>รหัสนักศึกษา:</b> ${std.code}</div>
                    <div><b>สถานะ:</b> 🟢 ${std.status}</div>
                </div>
            `;

            studentGrid.appendChild(card);
        });
    }

    // 4. ระบบค้นหา & กรองระดับชั้น
    function filterStudentData() {
        const query = studentSearchInput ? studentSearchInput.value.toLowerCase() : "";
        const selectedLevel = studentLevelFilter ? studentLevelFilter.value : "all";

        filteredStudent = studentData.filter(std => {
            const matchQuery = std.name.toLowerCase().includes(query) ||
                std.code.includes(query) ||
                std.dept.toLowerCase().includes(query);
            const matchLevel = selectedLevel === "all" || std.level === selectedLevel;
            return matchQuery && matchLevel;
        });

        renderStudents();
    }

    if (studentSearchInput) studentSearchInput.addEventListener("input", filterStudentData);
    if (studentLevelFilter) studentLevelFilter.addEventListener("change", filterStudentData);

    // เริ่มต้นแสดงผล
    renderStudents();
});

// --- ข้อมูลสาขาวิชาที่เปิดสอน ---
const coursesData = [
    {
        id: 1,
        title: "สาขาวิชาเทคนิคเครื่องกล (ช่างยนต์)",
        level: "ปวช. / ปวส.",
        dept: "ช่างอุตสาหกรรม",
        desc: "ศึกษาเกี่ยวกับการซ่อมบำรุง เครื่องยนต์แก๊สโซลีน ดีเซล ระบบส่งกำลัง และเทคโนโลยียานยนต์ไฟฟ้า (EV)",
        icon: "🚗"
    },
    {
        id: 2,
        title: "สาขาวิชาไฟฟ้ากำลัง",
        level: "ปวช. / ปวส.",
        dept: "ช่างอุตสาหกรรม",
        desc: "เรียนรู้ระบบไฟฟ้าในอาคารและโรงงานอุตสาหกรรม การติดตั้งมอเตอร์ และการควบคุมพลังงานไฟฟ้า",
        icon: "⚡"
    },
    {
        id: 3,
        title: "สาขาวิชาอิเล็กทรอนิกส์",
        level: "ปวช. / ปวส.",
        dept: "ช่างอุตสาหกรรม",
        desc: "ศึกษาไมโครคอนโทรลเลอร์ ระบบสมองกลฝังตัว การออกแบบวงจรอิเล็กทรอนิกส์ และระบบ IoT",
        icon: "🔌"
    },
    {
        id: 4,
        title: "สาขาวิชาเทคโนโลยีสารสนเทศ (IT)",
        level: "ปวช. / ปวส.",
        dept: "เทคโนโลยีสารสนเทศ",
        desc: "เรียนรู้การเขียนโปรแกรม พัฒนาเว็บแอปพลิเคชัน การจัดการฐานข้อมูล และระบบเครือข่ายคอมพิวเตอร์",
        icon: "💻"
    },
    {
        id: 5,
        title: "สาขาวิชาการบัญชี",
        level: "ปวช. / ปวส.",
        dept: "บริหารธุรกิจ",
        desc: "เน้นทักษะการทำบัญชีธุรกิจ ตรวจสอบบัญชี การคำนวณภาษีอากร และการใช้โปรแกรมบัญชีสำเร็จรูป",
        icon: "📊"
    },
    {
        id: 6,
        title: "สาขาวิชาการตลาดดิจิทัล",
        level: "ปวช. / ปวส.",
        dept: "บริหารธุรกิจ",
        desc: "ศึกษาการวางแผนการตลาดออนไลน์ วิดีโอคอนเทนต์ ยอดขายบน E-Commerce และการยิงโฆษณาโซเชียลมีเดีย",
        icon: "📈"
    },
    {
        id: 7,
        title: "สาขาวิชาการการโรงแรม",
        level: "ปวช. / ปวส.",
        dept: "การท่องเที่ยวและการโรงแรม",
        desc: "ฝึกฝนงานบริการส่วนหน้า งานต้อนรับ การผสมเครื่องดื่ม และการบริหารจัดการงานโรงแรมระดับสากล",
        icon: "🏨"
    },
    {
        id: 8,
        title: "สาขาวิชาสถาปัตยกรรม",
        level: "ปวช. / ปวส.",
        dept: "ศิลปกรรมและสถาปัตยกรรม",
        desc: "เรียนรู้การเขียนแบบสร้างบ้าน อาคาร การออกแบบตกแต่งภายใน และการใช้โปรแกรม 3D เขียนแบบ",
        icon: "📐"
    }
];

// --- Element References ---
const coursesGridEl = document.getElementById("courses-grid");
const courseSearchInput = document.getElementById("course-search-input");
const courseLevelFilter = document.getElementById("course-level-filter");
const coursesBackHomeBtn = document.getElementById("courses-back-home-btn");

// --- ฟังก์ชัน Render ข้อมูลสาขาวิชา ---
function renderCourses(data) {
    if (!coursesGridEl) return;
    coursesGridEl.innerHTML = "";

    if (data.length === 0) {
        coursesGridEl.innerHTML = `<div class="no-data">ไม่พบข้อมูลสาขาวิชาที่ค้นหา</div>`;
        return;
    }

    data.forEach(item => {
        const card = document.createElement("div");
        card.className = "course-card";
        card.innerHTML = `
            <div class="course-icon">${item.icon}</div>
            <div class="course-info">
                <span class="course-level">${item.level}</span>
                <h3 class="course-title">${item.title}</h3>
                <span class="course-dept">สังกัด: ${item.dept}</span>
                <p class="course-desc">${item.desc}</p>
            </div>
        `;
        coursesGridEl.appendChild(card);
    });
}

// --- ระบบค้นหาและกรองข้อมูลสาขาวิชา ---
function filterCourses() {
    const searchText = courseSearchInput ? courseSearchInput.value.toLowerCase() : "";
    const selectedLevel = courseLevelFilter ? courseLevelFilter.value : "all";

    const filtered = coursesData.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchText) ||
            item.dept.toLowerCase().includes(searchText);
        const matchesLevel = selectedLevel === "all" || item.level.includes(selectedLevel);

        return matchesSearch && matchesLevel;
    });

    renderCourses(filtered);
}

// --- Event Listeners ---
if (courseSearchInput) courseSearchInput.addEventListener("input", filterCourses);
if (courseLevelFilter) courseLevelFilter.addEventListener("change", filterCourses);
if (coursesBackHomeBtn) {
    coursesBackHomeBtn.addEventListener("click", () => switchPage("home-section"));
}

// เริ่มต้นแสดงผลหน้าสาขาวิชา
renderCourses(coursesData);