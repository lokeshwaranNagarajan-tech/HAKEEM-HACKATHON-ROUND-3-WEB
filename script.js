// ================= INITIAL EVENT DATA =================
const initialEvents = [
    { id: "EVT001", name: "Hackathon 4.0", category: "Technical", date: "2026-09-10", venue: "Main Auditorium", fee: 150, totalSeats: 50, availableSeats: 45 },
    { id: "EVT002", name: "Code Fest", category: "Technical", date: "2026-09-12", venue: "Seminar Hall", fee: 100, totalSeats: 40, availableSeats: 38 },
    { id: "EVT003", name: "AI Workshop", category: "Workshop", date: "2026-09-14", venue: "Lab 402", fee: 200, totalSeats: 40, availableSeats: 25 },
    { id: "EVT004", name: "Football Tournament", category: "Sports", date: "2026-09-16", venue: "Sports Ground", fee: 50, totalSeats: 60, availableSeats: 40 },
    { id: "EVT005", name: "Photography Contest", category: "Cultural", date: "2026-09-18", venue: "Art Block", fee: 80, totalSeats: 30, availableSeats: 12 },
    { id: "EVT006", name: "RoboWars", category: "Technical", date: "2026-09-20", venue: "Mechanical Arena", fee: 250, totalSeats: 35, availableSeats: 35 },
    { id: "EVT007", name: "Battle of Bands", category: "Cultural", date: "2026-09-22", venue: "Open Air Theatre", fee: 120, totalSeats: 100, availableSeats: 85 },
    { id: "EVT008", name: "Cyber Security Seminar", category: "Seminar", date: "2026-09-25", venue: "Auditorium B", fee: 0, totalSeats: 75, availableSeats: 2 },
    { id: "EVT009", name: "Startup Pitching", category: "Seminar", date: "2026-09-28", venue: "MBA Conference Hall", fee: 50, totalSeats: 50, availableSeats: 50 },
    { id: "EVT010", name: "UI/UX Design Sprint", category: "Workshop", date: "2026-10-02", venue: "Design Studio", fee: 150, totalSeats: 30, availableSeats: 0 }
];

const initialRegistrations = [
    { registrationId: "REG1001", studentName: "John Doe", registerNumber: "23CS101", email: "john@example.com", phone: "9876543210", eventId: "EVT001", eventName: "Hackathon 4.0", eventDate: "2026-09-10", status: "Registered" },
    { registrationId: "REG1002", studentName: "Alice Johnson", registerNumber: "23CS105", email: "alice@example.com", phone: "9876543211", eventId: "EVT001", eventName: "Hackathon 4.0", eventDate: "2026-09-10", status: "Registered" },
    { registrationId: "REG1003", studentName: "Bob Smith", registerNumber: "23CS109", email: "bob@example.com", phone: "9876543212", eventId: "EVT002", eventName: "Code Fest", eventDate: "2026-09-12", status: "Cancelled" }
];

let unreadNotifications = [];

// THEME TOGGLE LOGIC
function initTheme() {
    const savedTheme = localStorage.getItem("app_theme") || "dark";
    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
    } else {
        document.body.classList.remove("light-theme");
    }
    updateThemeIcon();
}

function toggleTheme() {
    document.body.classList.toggle("light-theme");
    const isLight = document.body.classList.contains("light-theme");
    localStorage.setItem("app_theme", isLight ? "light" : "dark");
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.getElementById("theme-icon");
    if (!icon) return;
    if (document.body.classList.contains("light-theme")) {
        icon.className = "fas fa-moon";
    } else {
        icon.className = "fas fa-sun";
    }
}

// LOCAL STORAGE HELPERS
function loadEvents() {
    const data = localStorage.getItem("campus_events");
    if (!data) {
        localStorage.setItem("campus_events", JSON.stringify(initialEvents));
        return initialEvents;
    }
    return JSON.parse(data);
}

function saveEvents(events) {
    localStorage.setItem("campus_events", JSON.stringify(events));
}

function loadRegistrations() {
    const data = localStorage.getItem("campus_registrations");
    if (!data) {
        localStorage.setItem("campus_registrations", JSON.stringify(initialRegistrations));
        return initialRegistrations;
    }
    return JSON.parse(data);
}

function saveRegistrations(regs) {
    localStorage.setItem("campus_registrations", JSON.stringify(regs));
}

if (!localStorage.getItem("campus_initialized")) {
    localStorage.setItem("campus_initialized", "true");
    saveEvents(initialEvents);
    saveRegistrations(initialRegistrations);
}

// UTILITY FUNCTIONS
function generateEventId() {
    const events = loadEvents();
    const ids = events.map(e => parseInt(e.id.replace("EVT", "")) || 0);
    const maxId = ids.length ? Math.max(...ids) : 0;
    return `EVT${String(maxId + 1).padStart(3, '0')}`;
}

function generateRegistrationId() {
    const regs = loadRegistrations();
    const ids = regs.map(r => parseInt(r.registrationId.replace("REG", "")) || 1000);
    const maxId = ids.length ? Math.max(...ids) : 1000;
    return `REG${maxId + 1}`;
}

function showToast(message, type = 'success') {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let icon = "fa-check-circle";
    if (type === 'error') icon = "fa-exclamation-triangle";
    if (type === 'info') icon = "fa-info-circle";

    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// REAL-TIME NOTIFICATION SYSTEM (REGISTRATIONS & CANCELLATIONS)
function triggerStudentRegistrationNotification(studentName, eventName) {
    unreadNotifications.unshift({
        type: 'registration',
        studentName,
        eventName,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    updateNotificationUI();
}

function triggerStudentCancellationNotification(studentName, eventName) {
    unreadNotifications.unshift({
        type: 'cancellation',
        studentName,
        eventName,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    updateNotificationUI();
}

function updateNotificationUI() {
    const badge = document.getElementById("notification-count");
    const list = document.getElementById("notification-list");

    if (unreadNotifications.length > 0) {
        badge.textContent = unreadNotifications.length;
        badge.classList.remove("hidden");
        badge.classList.add("bell-ring");

        setTimeout(() => badge.classList.remove("bell-ring"), 500);

        list.innerHTML = "";
        unreadNotifications.forEach(item => {
            const div = document.createElement("div");
            const isCancellation = item.type === 'cancellation';
            
            div.className = `notification-item ${isCancellation ? 'cancelled' : ''}`;
            div.innerHTML = `
                <div><strong>${item.studentName}</strong> ${isCancellation ? '<span style="color:var(--danger); font-weight:700;">CANCELLED</span> pass for' : 'registered for'}</div>
                <div style="color:${isCancellation ? 'var(--danger)' : 'var(--primary)'}; font-weight:600;">${item.eventName}</div>
                <span>${item.time}</span>
            `;
            list.appendChild(div);
        });
    } else {
        badge.classList.add("hidden");
        list.innerHTML = `<div class="notification-empty">No new notifications yet.</div>`;
    }
}

// APP INITIALIZATION & NAVIGATION
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNavigation();
    renderEvents();
    renderRegistrations();
    renderAdminDashboard();
    initEventListeners();
});

function initNavigation() {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = item.getAttribute("data-target");
            
            navItems.forEach(nav => nav.classList.remove("active"));
            item.classList.add("active");

            document.querySelectorAll(".content-section").forEach(sec => sec.classList.remove("active"));
            document.getElementById(targetId).classList.add("active");
        });
    });

    const adminTabBtns = document.querySelectorAll(".admin-tab-btn");
    adminTabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");
            adminTabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            document.querySelectorAll(".admin-tab-content").forEach(tc => tc.classList.remove("active"));
            document.getElementById(targetTab).classList.add("active");
        });
    });
}

// BATCH-OPTIMIZED EVENT RENDERING
function renderEvents() {
    const events = loadEvents();
    const searchVal = document.getElementById("search-input").value.toLowerCase();
    const categoryVal = document.getElementById("category-filter").value;
    const dateVal = document.getElementById("date-filter").value;
    const sortVal = document.getElementById("sort-select").value;

    let filtered = events.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchVal) || event.venue.toLowerCase().includes(searchVal);
        const matchesCategory = categoryVal === "All" || event.category === categoryVal;
        const matchesDate = !dateVal || event.date === dateVal;
        return matchesSearch && matchesCategory && matchesDate;
    });

    filtered.sort((a, b) => {
        if (sortVal === "date-asc") return new Date(a.date) - new Date(b.date);
        if (sortVal === "date-desc") return new Date(b.date) - new Date(a.date);
        if (sortVal === "fee-asc") return a.fee - b.fee;
        if (sortVal === "fee-desc") return b.fee - a.fee;
        if (sortVal === "seats-asc") return a.availableSeats - b.availableSeats;
        if (sortVal === "seats-desc") return b.availableSeats - a.availableSeats;
        return 0;
    });

    const grid = document.getElementById("events-grid");
    const emptyState = document.getElementById("events-empty-state");
    const countHeading = document.getElementById("events-count-heading");

    grid.innerHTML = "";
    countHeading.textContent = `Showing ${filtered.length} of ${events.length} events`;

    if (filtered.length === 0) {
        emptyState.classList.remove("hidden");
    } else {
        emptyState.classList.add("hidden");
        const fragment = document.createDocumentFragment();

        filtered.forEach(event => {
            const isFull = event.availableSeats === 0;
            const occupancy = ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100;
            let progressClass = "";
            if (occupancy >= 80) progressClass = "danger";
            else if (occupancy >= 50) progressClass = "warning";

            const card = document.createElement("div");
            card.className = "event-card";
            card.innerHTML = `
                <div class="event-card-header">
                    <span class="event-badge">${event.category}</span>
                    <h3 class="event-title">${event.name}</h3>
                    <div class="event-meta-info">
                        <span><i class="fas fa-calendar-alt"></i> ${formatDate(event.date)}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${event.venue}</span>
                        <span><i class="fas fa-fingerprint"></i> ID: ${event.id}</span>
                    </div>
                </div>
                <div class="event-card-body">
                    <div class="event-pricing-seats">
                        <span class="event-fee">${event.fee === 0 ? 'Free' : '₹' + event.fee}</span>
                        <span class="event-seats-info">${event.availableSeats} / ${event.totalSeats} seats left</span>
                    </div>
                    <div class="seat-progress-track">
                        <div class="seat-progress-fill ${progressClass}" style="width: ${(event.availableSeats / event.totalSeats) * 100}%"></div>
                    </div>
                    <button class="btn btn-primary btn-full ${isFull ? 'btn-disabled' : ''}" ${isFull ? 'disabled' : ''} onclick="openRegistrationModal('${event.id}')">
                        ${isFull ? 'Event Full' : 'Register Now'}
                    </button>
                </div>
            `;
            fragment.appendChild(card);
        });

        grid.appendChild(fragment);
    }
}

function formatDate(dateString) {
    if (!dateString) return "N/A";
    const parts = dateString.split("-");
    if (parts.length === 3) {
        const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
        return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return dateString;
}

// LISTENERS & EVENT HANDLERS
function initEventListeners() {
    // Theme Switcher Toggle Listener
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) {
        themeBtn.addEventListener("click", toggleTheme);
    }

    document.getElementById("search-input").addEventListener("input", renderEvents);
    document.getElementById("category-filter").addEventListener("change", (e) => {
        document.querySelectorAll(".pill").forEach(p => {
            p.classList.toggle("active", p.getAttribute("data-category") === e.target.value);
        });
        renderEvents();
    });
    document.getElementById("date-filter").addEventListener("change", renderEvents);
    document.getElementById("sort-select").addEventListener("change", renderEvents);

    document.getElementById("clear-filters").addEventListener("click", () => {
        document.getElementById("search-input").value = "";
        document.getElementById("category-filter").value = "All";
        document.getElementById("date-filter").value = "";
        document.getElementById("sort-select").value = "date-asc";
        document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
        document.querySelector('.pill[data-category="All"]').classList.add("active");
        renderEvents();
    });

    document.querySelectorAll(".pill").forEach(pill => {
        pill.addEventListener("click", () => {
            document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            const cat = pill.getAttribute("data-category");
            document.getElementById("category-filter").value = cat;
            renderEvents();
        });
    });

    // Notification Panel Toggle
    const bell = document.getElementById("notification-bell");
    const panel = document.getElementById("notification-panel");
    bell.addEventListener("click", (e) => {
        e.stopPropagation();
        panel.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
        if (!panel.contains(e.target) && !bell.contains(e.target)) {
            panel.classList.add("hidden");
        }
    });

    document.getElementById("clear-notifications-btn").addEventListener("click", () => {
        unreadNotifications = [];
        updateNotificationUI();
    });

    // Registrations search & filter
    document.getElementById("reg-search-input").addEventListener("input", renderRegistrations);
    document.getElementById("reg-status-filter").addEventListener("change", renderRegistrations);

    // Admin Registrations
    document.getElementById("admin-reg-search").addEventListener("input", renderAdminRegistrations);
    document.getElementById("admin-reg-event-filter").addEventListener("change", renderAdminRegistrations);
    document.getElementById("admin-reg-status-filter").addEventListener("change", renderAdminRegistrations);

    // Modals
    document.querySelectorAll(".modal-close, .modal-cancel").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".modal").forEach(m => m.classList.remove("open"));
        });
    });

    document.getElementById("open-add-event-modal").addEventListener("click", () => openEventModal());
    document.getElementById("registration-form").addEventListener("submit", handleRegistrationSubmit);
    document.getElementById("event-form").addEventListener("submit", handleEventSubmit);
}

// REGISTRATION SUBMISSION & NOTIFICATION DISPATCH
function openRegistrationModal(eventId) {
    const events = loadEvents();
    const event = events.find(e => e.id === eventId);
    if (!event || event.availableSeats <= 0) {
        showToast("Event is full or unavailable.", "error");
        return;
    }

    document.getElementById("modal-event-id").value = event.id;
    document.getElementById("modal-event-summary").innerHTML = `
        <h4>${event.name}</h4>
        <p><i class="fas fa-calendar-alt"></i> ${formatDate(event.date)} &nbsp;|&nbsp; <i class="fas fa-map-marker-alt"></i> ${event.venue}</p>
        <p><strong>Fee:</strong> ${event.fee === 0 ? 'Free' : '₹' + event.fee} &nbsp;|&nbsp; <strong>Available Seats:</strong> ${event.availableSeats}/${event.totalSeats}</p>
    `;

    document.getElementById("reg-name").value = "";
    document.getElementById("reg-number").value = "";
    document.getElementById("reg-email").value = "";
    document.getElementById("reg-phone").value = "";
    document.querySelectorAll(".form-group").forEach(g => g.classList.remove("error"));

    document.getElementById("registration-modal").classList.add("open");
}

function handleRegistrationSubmit(e) {
    e.preventDefault();
    const eventId = document.getElementById("modal-event-id").value;
    const name = document.getElementById("reg-name").value.trim();
    const regNumber = document.getElementById("reg-number").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const phone = document.getElementById("reg-phone").value.trim();

    let isValid = true;

    if (name.length < 2) {
        document.getElementById("reg-name").parentElement.classList.add("error");
        isValid = false;
    } else {
        document.getElementById("reg-name").parentElement.classList.remove("error");
    }

    if (!regNumber) {
        document.getElementById("reg-number").parentElement.classList.add("error");
        isValid = false;
    } else {
        document.getElementById("reg-number").parentElement.classList.remove("error");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById("reg-email").parentElement.classList.add("error");
        isValid = false;
    } else {
        document.getElementById("reg-email").parentElement.classList.remove("error");
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        document.getElementById("reg-phone").parentElement.classList.add("error");
        isValid = false;
    } else {
        document.getElementById("reg-phone").parentElement.classList.remove("error");
    }

    if (!isValid) return;

    const registrations = loadRegistrations();
    const alreadyRegistered = registrations.some(r => r.eventId === eventId && r.registerNumber.toLowerCase() === regNumber.toLowerCase() && r.status === "Registered");
    if (alreadyRegistered) {
        showToast("You are already registered for this event.", "error");
        return;
    }

    const events = loadEvents();
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (events[eventIndex].availableSeats <= 0) {
        showToast("Sorry, this event is completely full.", "error");
        document.getElementById("registration-modal").classList.remove("open");
        renderEvents();
        return;
    }

    events[eventIndex].availableSeats -= 1;
    saveEvents(events);

    const newReg = {
        registrationId: generateRegistrationId(),
        studentName: name,
        registerNumber: regNumber,
        email: email,
        phone: phone,
        eventId: events[eventIndex].id,
        eventName: events[eventIndex].name,
        eventDate: events[eventIndex].date,
        status: "Registered"
    };

    registrations.push(newReg);
    saveRegistrations(registrations);

    triggerStudentRegistrationNotification(name, events[eventIndex].name);

    document.getElementById("registration-modal").classList.remove("open");
    showToast(`✓ Registration successful! ID: ${newReg.registrationId}`, "success");

    renderEvents();
    renderRegistrations();
    renderAdminDashboard();
}

// REGISTRATION AND CANCELLATIONS MANAGEMENT
function renderRegistrations() {
    const regs = loadRegistrations();
    const searchVal = document.getElementById("reg-search-input").value.toLowerCase();
    const statusVal = document.getElementById("reg-status-filter").value;

    const filtered = regs.filter(r => {
        const matchSearch = r.registrationId.toLowerCase().includes(searchVal) || r.registerNumber.toLowerCase().includes(searchVal) || r.eventName.toLowerCase().includes(searchVal);
        const matchStatus = statusVal === "All" || r.status === statusVal;
        return matchSearch && matchStatus;
    });

    const tbody = document.getElementById("registrations-table-body");
    const emptyState = document.getElementById("registrations-empty-state");
    tbody.innerHTML = "";

    if (filtered.length === 0) {
        emptyState.classList.remove("hidden");
    } else {
        emptyState.classList.add("hidden");
        const fragment = document.createDocumentFragment();
        filtered.forEach(r => {
            const isCancelled = r.status === "Cancelled";
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${r.registrationId}</strong></td>
                <td>${r.studentName}</td>
                <td>${r.registerNumber}</td>
                <td>${r.eventName}</td>
                <td>${formatDate(r.eventDate)}</td>
                <td><span class="status-badge ${r.status.toLowerCase()}">${r.status}</span></td>
                <td>
                    ${isCancelled ? '<span class="text-muted">—</span>' : `<button class="btn btn-danger btn-sm" onclick="cancelRegistration('${r.registrationId}')">Cancel</button>`}
                </td>
            `;
            fragment.appendChild(tr);
        });
        tbody.appendChild(fragment);
    }
}

function cancelRegistration(regId) {
    showConfirmDialog("Are you sure you want to cancel this registration? 1 seat will be restored.", () => {
        let regs = loadRegistrations();
        const regIndex = regs.findIndex(r => r.registrationId === regId);
        if (regIndex === -1) return;

        if (regs[regIndex].status === "Cancelled") {
            showToast("Registration is already cancelled.", "info");
            return;
        }

        const cancelledReg = regs[regIndex];
        regs[regIndex].status = "Cancelled";
        saveRegistrations(regs);

        let events = loadEvents();
        const eventIndex = events.findIndex(e => e.id === cancelledReg.eventId);
        if (eventIndex !== -1) {
            events[eventIndex].availableSeats = Math.min(events[eventIndex].totalSeats, events[eventIndex].availableSeats + 1);
            saveEvents(events);
        }

        triggerStudentCancellationNotification(cancelledReg.studentName, cancelledReg.eventName);

        showToast("✓ Registration cancelled. 1 seat restored.", "info");
        renderEvents();
        renderRegistrations();
        renderAdminDashboard();
    });
}

function renderAdminDashboard() {
    const events = loadEvents();
    const regs = loadRegistrations();

    document.getElementById("stat-total-events").textContent = events.length;
    document.getElementById("stat-total-students").textContent = new Set(regs.map(r => r.registerNumber.toLowerCase())).size;
    document.getElementById("stat-total-registrations").textContent = regs.length;
    document.getElementById("stat-available-seats").textContent = events.reduce((acc, curr) => acc + curr.availableSeats, 0);
    document.getElementById("stat-cancelled-regs").textContent = regs.filter(r => r.status === "Cancelled").length;

    renderAdminEventsTable();
    populateAdminEventFilter();
    renderAdminRegistrations();
}

function renderAdminEventsTable() {
    const events = loadEvents();
    const tbody = document.getElementById("admin-events-table-body");
    tbody.innerHTML = "";
    const fragment = document.createDocumentFragment();

    events.forEach(e => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${e.id}</strong></td>
            <td>${e.name}</td>
            <td><span class="event-badge">${e.category}</span></td>
            <td>${formatDate(e.date)}</td>
            <td>${e.venue}</td>
            <td>${e.fee === 0 ? 'Free' : '₹' + e.fee}</td>
            <td>${e.availableSeats} / ${e.totalSeats}</td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="openEventModal('${e.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm" onclick="deleteEvent('${e.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        fragment.appendChild(tr);
    });
    tbody.appendChild(fragment);
}

function populateAdminEventFilter() {
    const events = loadEvents();
    const select = document.getElementById("admin-reg-event-filter");
    const currentVal = select.value;
    select.innerHTML = '<option value="All">All Events</option>';
    events.forEach(e => {
        const opt = document.createElement("option");
        opt.value = e.id;
        opt.textContent = e.name;
        select.appendChild(opt);
    });
    select.value = currentVal;
}

function renderAdminRegistrations() {
    const regs = loadRegistrations();
    const searchVal = document.getElementById("admin-reg-search").value.toLowerCase();
    const eventFilter = document.getElementById("admin-reg-event-filter").value;
    const statusFilter = document.getElementById("admin-reg-status-filter").value;

    const filtered = regs.filter(r => {
        const matchSearch = r.registrationId.toLowerCase().includes(searchVal) || r.studentName.toLowerCase().includes(searchVal) || r.eventName.toLowerCase().includes(searchVal);
        const matchEvent = eventFilter === "All" || r.eventId === eventFilter;
        const matchStatus = statusFilter === "All" || r.status === statusFilter;
        return matchSearch && matchEvent && matchStatus;
    });

    const tbody = document.getElementById("admin-regs-table-body");
    tbody.innerHTML = "";
    const fragment = document.createDocumentFragment();

    filtered.forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${r.registrationId}</strong></td>
            <td>${r.studentName}</td>
            <td>${r.registerNumber}</td>
            <td>${r.eventName}</td>
            <td>${formatDate(r.eventDate)}</td>
            <td><span class="status-badge ${r.status.toLowerCase()}">${r.status}</span></td>
            <td>
                ${r.status === 'Registered' ? `<button class="btn btn-danger btn-sm" onclick="adminCancelReg('${r.registrationId}')">Cancel</button>` : '<span class="text-muted">Cancelled</span>'}
            </td>
        `;
        fragment.appendChild(tr);
    });
    tbody.appendChild(fragment);
}

function adminCancelReg(regId) {
    cancelRegistration(regId);
}

function openEventModal(eventId = null) {
    const modal = document.getElementById("event-modal");
    const title = document.getElementById("event-modal-title");
    
    if (eventId) {
        title.textContent = "Edit Event";
        const events = loadEvents();
        const event = events.find(e => e.id === eventId);
        if (!event) return;

        document.getElementById("edit-event-id").value = event.id;
        document.getElementById("admin-event-name").value = event.name;
        document.getElementById("admin-event-category").value = event.category;
        document.getElementById("admin-event-date").value = event.date;
        document.getElementById("admin-event-venue").value = event.venue;
        document.getElementById("admin-event-fee").value = event.fee;
        document.getElementById("admin-event-seats").value = event.totalSeats;
    } else {
        title.textContent = "Add New Event";
        document.getElementById("edit-event-id").value = "";
        document.getElementById("event-form").reset();
    }

    modal.classList.add("open");
}

function handleEventSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById("edit-event-id").value;
    const name = document.getElementById("admin-event-name").value.trim();
    const category = document.getElementById("admin-event-category").value;
    const date = document.getElementById("admin-event-date").value;
    const venue = document.getElementById("admin-event-venue").value.trim();
    const fee = parseFloat(document.getElementById("admin-event-fee").value);
    const totalSeats = parseInt(document.getElementById("admin-event-seats").value);

    let events = loadEvents();

    if (editId) {
        const index = events.findIndex(ev => ev.id === editId);
        if (index !== -1) {
            const currentEvent = events[index];
            const activeRegistrationsCount = currentEvent.totalSeats - currentEvent.availableSeats;

            if (totalSeats < activeRegistrationsCount) {
                showToast(`Cannot set total seats below active registrations (${activeRegistrationsCount}).`, "error");
                return;
            }

            const seatDifference = totalSeats - currentEvent.totalSeats;
            const newAvailableSeats = currentEvent.availableSeats + seatDifference;

            events[index] = {
                ...currentEvent,
                name,
                category,
                date,
                venue,
                fee,
                totalSeats,
                availableSeats: Math.max(0, newAvailableSeats)
            };
            showToast("✓ Event successfully updated.", "success");
        }
    } else {
        const newEvent = {
            id: generateEventId(),
            name,
            category,
            date,
            venue,
            fee,
            totalSeats,
            availableSeats: totalSeats
        };
        events.push(newEvent);
        showToast("✓ New event created successfully.", "success");
    }

    saveEvents(events);
    document.getElementById("event-modal").classList.remove("open");
    renderEvents();
    renderAdminDashboard();
}

function deleteEvent(eventId) {
    showConfirmDialog("Are you sure you want to delete this event?", () => {
        let events = loadEvents();
        events = events.filter(e => e.id !== eventId);
        saveEvents(events);

        showToast("✓ Event deleted successfully.", "success");
        renderEvents();
        renderAdminDashboard();
    });
}

// CONFIRMATION MODAL HELPER
let confirmCallback = null;
function showConfirmDialog(message, callback) {
    document.getElementById("confirm-message").textContent = message;
    confirmCallback = callback;
    document.getElementById("confirm-modal").classList.add("open");
}

document.getElementById("confirm-yes").addEventListener("click", () => {
    if (confirmCallback) confirmCallback();
    document.getElementById("confirm-modal").classList.remove("open");
    confirmCallback = null;
});

document.getElementById("confirm-no").addEventListener("click", () => {
    document.getElementById("confirm-modal").classList.remove("open");
    confirmCallback = null;
});