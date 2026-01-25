/** @odoo-module **/

import { registry } from "@web/core/registry";
import { Component, useState, onMounted, onWillUnmount, onWillStart } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";



const MODULES = [
    { id: 1, title: "Performance", icon: "fa-trophy", image: "/school_parent_portal/static/src/img/icons/perfo_v1.png" },
    { id: 2, title: "Homework", icon: "fa-book", image: "/school_parent_portal/static/src/img/icons/homework_v1.png" },
    { id: 3, title: "LMS", icon: "fa-clock-o", image: "/school_parent_portal/static/src/img/icons/lms_v1.png" },
    { id: 4, title: "Fees", icon: "fa-credit-card", image: "/school_parent_portal/static/src/img/icons/fees_v1.png" },
    { id: 5, title: "GPS Track", icon: "fa-map-marker", image: "/school_parent_portal/static/src/img/icons/gps_v1.png" },
    { id: 6, title: "Transport", icon: "fa-bus", image: "/school_parent_portal/static/src/img/icons/transport_v1.png" },
    { id: 7, title: "Attendance", icon: "fa-calendar", image: "/school_parent_portal/static/src/img/icons/attendance_v1.png" },
    { id: 8, title: "More", icon: "fa-chevron-down", image: "/school_parent_portal/static/src/img/icons/more_v1.png" },
];

export class ParentDashboard extends Component {
    setup() {
        this.actionService = useService("action");
        this.orm = useService("orm");

        this.modules = MODULES;
        this.announcements = [];
        this.notices = [];

        onWillStart(async () => {
            await this.fetchDashboardContent();
        });

        this.state = useState({
            currentIndex: 0,
            isDragging: false,
            startX: 0,
            currentTranslate: 0,
            mounted: false,
        });

        this.timer = null;

        onMounted(() => {
            this.state.mounted = true;
            this.startTimer();
        });

        onWillUnmount(() => {
            this.stopTimer();
        });
    }

    async fetchDashboardContent() {
        // Fetch Announcements
        const announcements = await this.orm.searchRead(
            "dashboard.announcement",
            [['active', '=', true]],
            ['id', 'name', 'image', 'announcement_type']
        );
        this.announcements = announcements.map(a => ({
            id: a.id,
            title: a.name,
            image: a.image ? `data:image/png;base64,${a.image}` : null,
            type: a.announcement_type ? a.announcement_type.toUpperCase() : 'ANNOUNCEMENT'
        }));

        // Fetch Notices
        const notices = await this.orm.searchRead(
            "dashboard.notice",
            [['active', '=', true]],
            ['name']
        );
        this.notices = notices.map(n => n.name);
    }

    startTimer() {
        this.stopTimer();
        this.timer = setInterval(() => {
            this.state.currentIndex = (this.state.currentIndex + 1) % this.announcements.length;
        }, 4000);
    }

    stopTimer() {
        if (this.timer) clearInterval(this.timer);
    }

    handleDragStart(clientX) {
        this.state.isDragging = true;
        this.state.startX = clientX;
        this.stopTimer();
    }

    handleDragMove(clientX) {
        if (!this.state.isDragging) return;
        const diff = clientX - this.state.startX;
        this.state.currentTranslate = diff;
    }

    handleDragEnd() {
        this.state.isDragging = false;
        const threshold = 50;

        if (this.state.currentTranslate < -threshold) {
            // Next
            this.state.currentIndex = (this.state.currentIndex + 1) % this.announcements.length;
        } else if (this.state.currentTranslate > threshold) {
            // Prev
            this.state.currentIndex = (this.state.currentIndex - 1 + this.announcements.length) % this.announcements.length;
        }

        this.state.currentTranslate = 0;
        this.startTimer();
    }

    // Touch Events
    onTouchStart(ev) {
        this.handleDragStart(ev.touches[0].clientX);
    }
    onTouchMove(ev) {
        this.handleDragMove(ev.touches[0].clientX);
    }
    onTouchEnd() {
        this.handleDragEnd();
    }

    // Mouse Events
    onMouseDown(ev) {
        ev.preventDefault();
        this.handleDragStart(ev.clientX);
    }
    onMouseMove(ev) {
        if (this.state.isDragging) this.handleDragMove(ev.clientX);
    }
    onMouseUp() {
        if (this.state.isDragging) this.handleDragEnd();
    }
    onMouseLeave() {
        if (this.state.isDragging) this.handleDragEnd();
    }

    openModule(module) {
        if (module.title === "Performance") {
            this.actionService.doAction("openeducat_parent_analytics.action_parent_analytics_dashboard");
        } else if (module.title === "Fees") {
            this.actionService.doAction("openeducat_parent_fees.action_parent_fees_dashboard");
        } else {
            // Placeholder for other modules
            console.log("Clicked module:", module.title);
        }
    }
}

ParentDashboard.template = "school_parent_portal.ParentDashboard";

registry.category("actions").add("school_parent_portal.parent_dashboard", ParentDashboard);
