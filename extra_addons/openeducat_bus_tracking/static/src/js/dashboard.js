/** @odoo-module */

import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { useSetupAction } from "@web/webclient/actions/action_hook";
import { Component, onMounted, onWillStart, useState } from "@odoo/owl";

class BusTrackingDashboard extends Component {
    setup() {
        this.orm = useService("orm");
        this.state = useState({
            loading: true,
            logs: [],
            stats: {}
        });

        // Set up the refresh handler
        useSetupAction({
            onRefresh: () => this.loadData()
        });

        // Load initial data
        onWillStart(() => this.loadData());

        // Set up click handler for the refresh button
        onMounted(() => {
            const refreshBtn = this.el.querySelector('.o_reload_icon');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', () => this.loadData());
            }
        });
    }

    async loadData() {
        try {
            this.state.loading = true;
            
            // Get dashboard data from the server
            const data = await this.orm.call(
                'openeducat_bus_tracking.gps_log',
                'get_dashboard_data',
                [],
                { context: this.props.context }
            );

            // Update the state with the received data
            this.state.logs = data.recent_logs || [];
            this.state.stats = {
                total_vehicles: data.total_vehicles || 0,
                active_vehicles: data.active_vehicles || 0
            };

            // Update the UI
            this.updateDashboardUI();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            this.state.loading = false;
        }
    }

    updateDashboardUI() {
        const container = this.el.querySelector('#recent_logs_container');
        if (!container) return;

        // Clear the container
        container.innerHTML = '';

        if (!this.state.logs || this.state.logs.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    No recent logs found.
                </div>
            `;
            return;
        }

        // Create the table
        const table = document.createElement('table');
        table.className = 'table table-sm table-hover';
        
        // Create table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Date/Time</th>
                <th>Vehicle</th>
                <th class="text-end">Speed (km/h)</th>
                <th class="text-end">Engine Hours</th>
                <th class="text-end">Distance (km)</th>
            </tr>
        `;
        
        // Create table body
        const tbody = document.createElement('tbody');
        this.state.logs.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(log.date).toLocaleString()}</td>
                <td>${log.vehicle_id ? log.vehicle_id[1] : 'N/A'}</td>
                <td class="text-end">${log.speed ? `${log.speed} km/h` : 'N/A'}</td>
                <td class="text-end">${log.engine_hours ? `${log.engine_hours.toFixed(1)} h` : 'N/A'}</td>
                <td class="text-end">${log.distance_today ? log.distance_today.toFixed(2) : '0.00'}</td>
            `;
            tbody.appendChild(row);
        });

        // Assemble the table
        table.appendChild(thead);
        table.appendChild(tbody);
        container.appendChild(table);
    }
}

BusTrackingDashboard.template = "openeducat_bus_tracking.DashboardTemplate";

// Register the dashboard component
registry.category("actions").add("openeducat_bus_tracking.dashboard", BusTrackingDashboard);

export default BusTrackingDashboard;
