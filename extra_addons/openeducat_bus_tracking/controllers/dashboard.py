from odoo import http
from odoo.http import request
import json
from datetime import datetime, timedelta

class BusTrackingDashboard(http.Controller):
    """Controller for the Bus Tracking Dashboard."""

    @http.route('/bus_tracking/get_analytics', type='json', auth='user')
    def get_analytics(self, vehicle_id=None, date_from=None, date_to=None, **kw):
        """
        Get analytics data for the dashboard.
        
        Args:
            vehicle_id (int): ID of the vehicle to filter by
            date_from (str): Start date in YYYY-MM-DD format
            date_to (str): End date in YYYY-MM-DD format
            
        Returns:
            dict: Analytics data for the dashboard
        """
        # Set default date range if not provided (last 30 days)
        if not date_to:
            date_to = datetime.now().strftime('%Y-%m-%d')
        if not date_from:
            date_from = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
            
        # Prepare domain
        domain = [
            ('date', '>=', f"{date_from} 00:00:00"),
            ('date', '<=', f"{date_to} 23:59:59"),
        ]
        
        if vehicle_id:
            domain.append(('vehicle_id', '=', int(vehicle_id)))
            
        # Get logs for the date range
        logs = request.env['openeducat_bus_tracking.gps_log'].search(domain, order='date')
        
        # Group logs by date
        daily_data = {}
        for log in logs:
            date_str = log.date.strftime('%Y-%m-%d')
            if date_str not in daily_data:
                daily_data[date_str] = {
                    'date': date_str,
                    'engine_hours': 0,
                    'distance': 0,
                    'max_speed': 0,
                    'count': 0
                }
                
            daily_data[date_str]['engine_hours'] = max(daily_data[date_str]['engine_hours'], log.engine_hours)
            daily_data[date_str]['distance'] = max(daily_data[date_str]['distance'], log.distance_today)
            daily_data[date_str]['max_speed'] = max(daily_data[date_str]['max_speed'], log.speed)
            daily_data[date_str]['count'] += 1
            
        # Convert to list and sort by date
        result = sorted(daily_data.values(), key=lambda x: x['date'])
        
        # Calculate total distance and engine hours
        total_distance = sum(d['distance'] for d in result) if result else 0
        total_engine_hours = sum(d['engine_hours'] for d in result) if result else 0
        
        return {
            'success': True,
            'data': result,
            'totals': {
                'distance': total_distance,
                'engine_hours': total_engine_hours,
                'days': len(result),
                'avg_distance': total_distance / len(result) if result else 0,
                'avg_engine_hours': total_engine_hours / len(result) if result else 0,
            },
            'date_from': date_from,
            'date_to': date_to,
        }
