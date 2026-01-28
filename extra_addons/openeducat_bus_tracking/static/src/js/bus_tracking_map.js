/** @odoo-module */

import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { Component, onMounted, onWillUnmount, useRef, useState } from "@odoo/owl";

// Load Leaflet from CDN
const loadLeaflet = () => {
    return new Promise((resolve, reject) => {
        if (window.L) {
            resolve(window.L);
            return;
        }

        // Create link element for Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/mZEZx5mDc8lVgT8aU=';
        link.crossOrigin = '';
        
        // Create script element for Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        
        script.onload = () => {
            resolve(window.L);
        };
        
        script.onerror = (error) => {
            console.error('Error loading Leaflet:', error);
            reject(error);
        };
        
        // Append both to head
        document.head.appendChild(link);
        document.head.appendChild(script);
    });
};

// Bus icon for map markers
const createBusIcon = (isMoving) => {
    const color = isMoving ? '#1a73e8' : '#ea4335';
    return L.divIcon({
        html: `
            <div class="bus-marker" style="color: ${color};">
                <i class="fa fa-bus"></i>
                <div class="bus-pulse" style="background: ${color};"></div>
            </div>
        `,
        className: 'bus-marker-container',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
};

class BusTrackingMap extends Component {
    setup() {
        this.orm = useService("orm");
        this.rpc = useService("rpc");
        this.mapContainer = useRef("map");
        this.state = useState({
            loading: true,
            error: null,
            vehicles: [],
            map: null,
            markers: {},
            updateInterval: null
        });

        onMounted(async () => {
            try {
                // Load Leaflet
                this.L = await loadLeaflet();
                await this.initializeMap();
                await this.loadVehicles();
                this.setupAutoRefresh();
            } catch (error) {
                console.error('Error initializing map:', error);
                this.state.error = 'Failed to load map. Please refresh the page to try again.';
                this.state.loading = false;
            }
        });

        onWillUnmount(() => {
            this.cleanup();
        });
    }

    cleanup() {
        if (this.state.updateInterval) {
            clearInterval(this.state.updateInterval);
        }
        if (this.state.map) {
            this.state.map.remove();
        }
    }

    async initializeMap() {
        // Default to a reasonable center if no vehicles are available yet
        const defaultCenter = [20.5937, 78.9629]; // Center of India
        const defaultZoom = 5;
        
        this.state.map = this.L.map(this.mapContainer.el, {
            center: defaultCenter,
            zoom: defaultZoom,
            zoomControl: false,
            attributionControl: false
        });

        // Add OpenStreetMap tiles
        this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.state.map);

        // Add zoom controls
        this.L.control.zoom({
            position: 'topright'
        }).addTo(this.state.map);

        // Add scale control
        this.L.control.scale({
            imperial: false,
            metric: true,
            position: 'bottomright'
        }).addTo(this.state.map);
    }

    async loadVehicles() {
        try {
            this.state.loading = true;
            
            // Fetch vehicles with GPS data
            const vehicles = await this.orm.searchRead(
                'fleet.vehicle',
                [
                    '&',
                    ['latitude', '!=', false],
                    ['longitude', '!=', false]
                ],
                ['id', 'name', 'license_plate', 'latitude', 'longitude', 'speed', 'last_updated', 'last_location']
            );

            this.state.vehicles = vehicles;
            this.updateMarkers();
            this.fitMapToBounds();
            
        } catch (error) {
            console.error('Error loading vehicles:', error);
            this.state.error = 'Failed to load vehicle data. Please try again later.';
        } finally {
            this.state.loading = false;
        }
    }

    updateMarkers() {
        const { map, markers } = this.state;
        const existingMarkers = { ...markers };
        const newMarkers = {};
        
        // Update or create markers for each vehicle
        this.state.vehicles.forEach(vehicle => {
            const { id, latitude, longitude, name, license_plate, speed, last_location } = vehicle;
            const position = [latitude, longitude];
            const isMoving = speed > 0;
            
            let marker = existingMarkers[id];
            
            if (!marker) {
                // Create new marker
                marker = this.L.marker(position, {
                    icon: createBusIcon(isMoving),
                    vehicleId: id,
                    autoPanOnFocus: false
                });
                
                // Add popup with vehicle info
                const popupContent = `
                    <div class="bus-popup">
                        <h4>${name || 'Unnamed Vehicle'}</h4>
                        <div class="bus-info">
                            <div><strong>License Plate:</strong> ${license_plate || 'N/A'}</div>
                            <div><strong>Speed:</strong> ${speed || 0} km/h</div>
                            <div><strong>Last Update:</strong> ${new Date(vehicle.last_updated).toLocaleString()}</div>
                            <div><strong>Location:</strong> ${last_location || 'Unknown'}</div>
                        </div>
                    </div>
                `;
                
                marker.bindPopup(popupContent);
                marker.addTo(map);
            } else {
                // Update existing marker position
                marker.setLatLng(position);
                
                // Update icon if moving state changed
                const wasMoving = marker.options.icon.options.html.includes('moving');
                if (wasMoving !== isMoving) {
                    marker.setIcon(createBusIcon(isMoving));
                }
                
                // Update popup content
                const popup = marker.getPopup();
                if (popup.isOpen()) {
                    popup.setContent(`
                        <div class="bus-popup">
                            <h4>${name || 'Unnamed Vehicle'}</h4>
                            <div class="bus-info">
                                <div><strong>License Plate:</strong> ${license_plate || 'N/A'}</div>
                                <div><strong>Speed:</strong> ${speed || 0} km/h</div>
                                <div><strong>Last Update:</strong> ${new Date(vehicle.last_updated).toLocaleString()}</div>
                                <div><strong>Location:</strong> ${last_location || 'Unknown'}</div>
                            </div>
                        </div>
                    `);
                }
                
                // Remove from existing markers so we know not to remove it
                delete existingMarkers[id];
            }
            
            newMarkers[id] = marker;
        });
        
        // Remove markers for vehicles that are no longer in the list
        Object.values(existingMarkers).forEach(marker => {
            map.removeLayer(marker);
        });
        
        this.state.markers = newMarkers;
    }

    fitMapToBounds() {
        const { map, vehicles } = this.state;
        
        if (vehicles.length === 0) return;
        
        const bounds = this.L.latLngBounds(
            vehicles.map(v => [v.latitude, v.longitude])
        );
        
        // Add some padding around the bounds
        map.fitBounds(bounds.pad(0.1));
        
        // If we only have one vehicle, zoom in a bit more
        if (vehicles.length === 1) {
            map.setZoom(15);
        }
    }

    setupAutoRefresh() {
        // Refresh every 30 seconds
        this.state.updateInterval = setInterval(() => {
            this.loadVehicles();
        }, 30000);
    }

    onZoomIn() {
        if (this.state.map) {
            this.state.map.zoomIn();
        }
    }

    onZoomOut() {
        if (this.state.map) {
            this.state.map.zoomOut();
        }
    }

    onRefresh() {
        this.loadVehicles();
    }
}

BusTrackingMap.template = 'openeducat_bus_tracking.MapView';
BusTrackingMap.components = {};

// Register the client action
const busTrackingMap = {
    component: BusTrackingMap,
    target: 'fullscreen',
};

registry.category('actions').add('openeducat_bus_tracking.map_view', busTrackingMap);
