from odoo import models, fields, api, _
from odoo.exceptions import ValidationError, UserError
from datetime import datetime, timedelta

class GPSLog(models.Model):
    """Model to store historical GPS tracking data for vehicles."""
    _name = 'openeducat_bus_tracking.gps_log'
    _description = 'GPS Log'
    _order = 'date desc'
    _rec_name = 'display_name'
    
    # Fields
    vehicle_id = fields.Many2one(
        'fleet.vehicle',
        string='Vehicle',
        required=True,
        ondelete='cascade',
        index=True
    )
    
    date = fields.Datetime(
        string='Date/Time',
        required=True,
        default=fields.Datetime.now,
        index=True
    )
    
    latitude = fields.Float(
        string='Latitude',
        digits=(16, 6),
        required=True,
        help='Latitude coordinate of the vehicle'
    )
    
    longitude = fields.Float(
        string='Longitude',
        digits=(16, 6),
        required=True,
        help='Longitude coordinate of the vehicle'
    )
    
    speed = fields.Float(
        string='Speed (km/h)',
        help='Speed of the vehicle in kilometers per hour'
    )
    
    engine_hours = fields.Float(
        string='Engine Hours',
        help='Cumulative engine hours of the vehicle'
    )
    
    distance_today = fields.Float(
        string='Distance Today (km)',
        help='Distance traveled by the vehicle today in kilometers'
    )
    
    display_name = fields.Char(
        string='Display Name',
        compute='_compute_display_name',
        store=True,
        index=True
    )
    
    # Computed fields
    @api.depends('vehicle_id.name', 'date')
    def _compute_display_name(self):
        for log in self:
            log.display_name = f"{log.vehicle_id.name or 'Vehicle'} - {log.date}"
    
    # Constraints
    _sql_constraints = [
        ('latitude_range', 'CHECK(latitude >= -90 AND latitude <= 90)',
         'Latitude must be between -90 and 90 degrees.'),
        ('longitude_range', 'CHECK(longitude >= -180 AND longitude <= 180)',
         'Longitude must be between -180 and 180 degrees.'),
        ('speed_non_negative', 'CHECK(speed >= 0)',
         'Speed cannot be negative.'),
    ]
    
    # Business Methods
    def action_refresh_dashboard(self):
        """
        Refresh the dashboard data.
        This method can be extended to include additional refresh logic.
        """
        # This will force a reload of the view
        return {
            'type': 'ir.actions.client',
            'tag': 'reload',
        }
        
    @api.model
    def get_dashboard_data(self):
        """
        Get data for the dashboard.
        This method can be called from the frontend to get updated dashboard data.
        """
        # Example data structure - customize as needed
        return {
            'total_vehicles': self.env['fleet.vehicle'].search_count([]),
            'active_vehicles': self.env['fleet.vehicle'].search_count([('active', '=', True)]),
            'recent_logs': self.search_read(
                [], 
                ['vehicle_id', 'date', 'speed', 'engine_hours'], 
                limit=10, 
                order='date desc'
            ),
        }
    
    def get_daily_summary(self, date=None):
        """
        Get daily summary of GPS logs for the vehicle.
        
        :param date: Date to get summary for (default: today)
        :return: Dictionary with daily summary
        """
        self.ensure_one()
        
        if date is None:
            date = fields.Date.context_today(self)
        
        # Calculate start and end of the day
        start_date = fields.Datetime.start_of(date, 'day')
        end_date = fields.Datetime.end_of(date, 'day')
        
        # Get logs for the day
        logs = self.search([
            ('vehicle_id', '=', self.vehicle_id.id),
            ('date', '>=', start_date),
            ('date', '<=', end_date)
        ], order='date')
        
        if not logs:
            return {
                'distance': 0.0,
                'max_speed': 0.0,
                'avg_speed': 0.0,
                'engine_hours': 0.0,
                'locations': []
            }
        
        # Calculate summary
        max_speed = max(log.speed for log in logs if log.speed is not None)
        avg_speed = sum(log.speed for log in logs if log.speed is not None) / len(logs)
        
        # Calculate distance (simplified - in a real app, use proper distance calculation)
        distance = logs[-1].distance_today - logs[0].distance_today
        
        # Get unique locations
        locations = []
        seen = set()
        for log in logs:
            loc = (log.latitude, log.longitude)
            if loc not in seen:
                seen.add(loc)
                locations.append({
                    'latitude': log.latitude,
                    'longitude': log.longitude,
                    'timestamp': log.date,
                    'speed': log.speed
                })
        
        return {
            'distance': max(0, distance),  # Ensure non-negative
            'max_speed': max_speed,
            'avg_speed': avg_speed,
            'engine_hours': logs[-1].engine_hours - logs[0].engine_hours,
            'locations': locations
        }
    
    def cleanup_old_logs(self, days_to_keep=30):
        """
        Remove GPS logs older than specified number of days.
        
        :param int days_to_keep: Number of days of logs to keep
        :return: Number of deleted records
        """
        if days_to_keep < 1:
            raise ValidationError("Days to keep must be at least 1")
        
        cutoff_date = fields.Datetime.to_string(
            fields.Datetime.now() - timedelta(days=days_to_keep)
        )
        
        old_logs = self.search([('date', '<', cutoff_date)])
        deleted_count = len(old_logs)
        old_logs.unlink()
        
        return deleted_count
