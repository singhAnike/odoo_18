from odoo import models, fields, api
from odoo.exceptions import ValidationError
from datetime import datetime

class FleetVehicle(models.Model):
    """Extend fleet.vehicle to add GPS tracking capabilities."""
    _inherit = 'fleet.vehicle'

    # GPS Tracking Fields
    latitude = fields.Float(
        string='Latitude',
        digits=(16, 6),
        help='Current latitude of the vehicle',
        copy=False
    )
    
    longitude = fields.Float(
        string='Longitude',
        digits=(16, 6),
        help='Current longitude of the vehicle',
        copy=False
    )
    
    speed = fields.Float(
        string='Speed (km/h)',
        help='Current speed of the vehicle in kilometers per hour',
        copy=False
    )
    
    last_updated = fields.Datetime(
        string='Last Updated',
        help='Timestamp of the last GPS update',
        copy=False
    )
    
    last_location = fields.Char(
        string='Last Known Location',
        help='Human-readable description of the last known location',
        copy=False
    )
    
    gps_log_count = fields.Integer(
        string='GPS Logs',
        compute='_compute_gps_log_count',
        help='Number of GPS logs for this vehicle'
    )
    
    @api.depends()
    def _compute_gps_log_count(self):
        """Compute the number of GPS logs for each vehicle."""
        log_data = self.env['openeducat_bus_tracking.gps_log'].read_group(
            [('vehicle_id', 'in', self.ids)],
            ['vehicle_id'],
            ['vehicle_id']
        )
        mapped_data = {item['vehicle_id'][0]: item['vehicle_id_count'] for item in log_data}
        for vehicle in self:
            vehicle.gps_log_count = mapped_data.get(vehicle.id, 0)
    
    def action_view_gps_logs(self):
        """Action to view GPS logs for this vehicle."""
        self.ensure_one()
        action = self.env['ir.actions.act_window']._for_xml_id('openeducat_bus_tracking.action_gps_log')
        action['domain'] = [('vehicle_id', '=', self.id)]
        action['context'] = {
            'default_vehicle_id': self.id,
            'search_default_group_by_vehicle': False,
            'search_default_group_by_date': True,
        }
        return action
    
    def update_gps_position(self, latitude, longitude, speed=None, location_name=None):
        """
        Update the GPS position of the vehicle.
        
        :param float latitude: Latitude of the vehicle
        :param float longitude: Longitude of the vehicle
        :param float speed: Speed in km/h (optional)
        :param str location_name: Human-readable location name (optional)
        :return: True if update was successful
        """
        self.ensure_one()
        
        # Validate coordinates
        if not (-90 <= latitude <= 90):
            raise ValidationError("Latitude must be between -90 and 90 degrees.")
        if not (-180 <= longitude <= 180):
            raise ValidationError("Longitude must be between -180 and 180 degrees.")
        
        # Update vehicle position
        update_vals = {
            'latitude': latitude,
            'longitude': longitude,
            'last_updated': fields.Datetime.now(),
        }
        
        if speed is not None:
            update_vals['speed'] = speed
        
        if location_name:
            update_vals['last_location'] = location_name
        
        self.write(update_vals)
        
        # Create GPS log entry
        log_vals = {
            'vehicle_id': self.id,
            'latitude': latitude,
            'longitude': longitude,
            'speed': speed or 0.0,
            'date': fields.Datetime.now(),
        }
        self.env['openeducat_bus_tracking.gps_log'].create(log_vals)
        
        return True
