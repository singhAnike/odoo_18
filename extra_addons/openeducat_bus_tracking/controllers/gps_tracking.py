from odoo import http
from odoo.http import request
import json
import logging

_logger = logging.getLogger(__name__)

class GPSTrackingController(http.Controller):
    """Controller for GPS tracking related endpoints."""

    @http.route('/gps/tracking/update', type='json', auth='public', methods=['POST'], csrf=False)
    def update_gps_position(self, **post):
        """
        API endpoint to update GPS position of a vehicle.
        
        Expected JSON payload:
        {
            "vehicle_id": 123,  # or "license_plate": "ABC123"
            "latitude": 12.345678,
            "longitude": 98.765432,
            "speed": 45.6,  # km/h
            "engine_hours": 1234.5,  # optional
            "distance_today": 156.7,  # km, optional
            "location_name": "Near Main Street"  # optional
        }
        
        Returns:
            JSON response with status and message
        """
        try:
            data = json.loads(request.httprequest.data)
            _logger.info("Received GPS update: %s", data)
            
            # Find vehicle by ID or license plate
            domain = []
            if 'vehicle_id' in data:
                domain = [('id', '=', int(data['vehicle_id']))]
            elif 'license_plate' in data:
                domain = [('license_plate', '=', data['license_plate'].strip())]
            else:
                return {
                    'status': 'error',
                    'message': 'Either vehicle_id or license_plate is required'
                }
            
            # Find the vehicle
            vehicle = request.env['fleet.vehicle'].sudo().search(domain, limit=1)
            if not vehicle:
                return {
                    'status': 'error',
                    'message': 'Vehicle not found'
                }
            
            # Prepare update values
            update_vals = {
                'latitude': float(data.get('latitude')),
                'longitude': float(data.get('longitude')),
                'speed': float(data.get('speed', 0)),
                'last_updated': fields.Datetime.now(),
            }
            
            if 'location_name' in data:
                update_vals['last_location'] = data['location_name']
            
            # Update vehicle position
            vehicle.write(update_vals)
            
            # Create GPS log entry
            log_vals = {
                'vehicle_id': vehicle.id,
                'latitude': update_vals['latitude'],
                'longitude': update_vals['longitude'],
                'speed': update_vals['speed'],
                'date': update_vals['last_updated'],
                'engine_hours': float(data.get('engine_hours', 0)),
                'distance_today': float(data.get('distance_today', 0)),
            }
            
            request.env['openeducat_bus_tracking.gps_log'].sudo().create(log_vals)
            
            return {
                'status': 'success',
                'message': 'Position updated successfully',
                'vehicle_id': vehicle.id,
                'vehicle_name': vehicle.name,
            }
            
        except Exception as e:
            _logger.error("Error updating GPS position: %s", str(e), exc_info=True)
            return {
                'status': 'error',
                'message': str(e)
            }
    
    @http.route('/gps/vehicles', type='json', auth='user')
    def get_vehicles(self, **kwargs):
        """
        Get list of vehicles with their current GPS positions.
        
        Returns:
            List of vehicles with their current positions and status
        """
        try:
            vehicles = request.env['fleet.vehicle'].search_read(
                [
                    ('latitude', '!=', False),
                    ('longitude', '!=', False),
                ],
                ['id', 'name', 'license_plate', 'latitude', 'longitude', 'speed', 'last_updated', 'last_location']
            )
            
            return {
                'status': 'success',
                'count': len(vehicles),
                'vehicles': vehicles
            }
            
        except Exception as e:
            _logger.error("Error fetching vehicle positions: %s", str(e), exc_info=True)
            return {
                'status': 'error',
                'message': str(e)
            }
