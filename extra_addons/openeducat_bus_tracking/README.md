# OpenEduCat Bus GPS Tracking

A comprehensive GPS tracking system for school buses, fully integrated with OpenEduCat.

## Features

- **Real-time Bus Tracking**: View the live location of all school buses on an interactive map
- **Vehicle Management**: Track and manage your fleet of school buses
- **Historical Data**: Access historical GPS logs for analysis and reporting
- **Analytics Dashboard**: Monitor engine hours, distance traveled, and other key metrics
- **Parent Portal Ready**: Designed with future parent portal integration in mind

## Installation

1. Copy the `openeducat_bus_tracking` directory to your Odoo addons directory
2. Install the module through the Odoo Apps interface or via command line:
   ```
   python odoo-bin -i openeducat_bus_tracking --stop-after-init
   ```
3. Restart your Odoo server

## Configuration

1. Go to **Fleet > Configuration > Vehicles**
2. Create or edit a vehicle to add GPS tracking information
3. Update the vehicle's GPS coordinates using the API or manually through the interface

## API Integration

The module provides REST API endpoints for GPS tracking devices to send location updates:

### Update Vehicle Position

```
POST /gps/tracking/update
Content-Type: application/json

{
    "vehicle_id": 1,  // or "license_plate": "SCH-001"
    "latitude": 12.345678,
    "longitude": 98.765432,
    "speed": 45.6,
    "engine_hours": 1234.5,
    "distance_today": 156.7,
    "location_name": "Near Main Street"
}
```

### Get Vehicle Positions

```
GET /gps/vehicles
```

## Usage

1. **Map View**: Navigate to **GPS Tracking > Map View** to see all buses on a map
2. **Vehicle List**: Go to **GPS Tracking > Vehicle List** to view all vehicles in a kanban view
3. **Dashboard**: Access **GPS Tracking > Dashboard** for analytics and reports
4. **GPS Logs**: View historical GPS data under **GPS Tracking > GPS Logs**

## Dependencies

- OpenEduCat Core
- Fleet Management
- Web

## Support

For support, please contact OpenEduCat support at support@openeducat.org

## License

This module is licensed under LGPL-3.
