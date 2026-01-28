# -*- coding: utf-8 -*-
###############################################################################
#
#    OpenEduCat Inc
#    Copyright (C) 2009-TODAY OpenEduCat Inc(<https://www.openeducat.org>).
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Lesser General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Lesser General Public License for more details.
#
#    You should have received a copy of the GNU Lesser General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
###############################################################################

{
    'name': 'OpenEduCat Bus GPS Tracking',
    'version': '18.0.1.0',
    'license': 'LGPL-3',
    'category': 'Education',
    "sequence": 3,
    'summary': 'GPS Tracking for School Buses',
    'complexity': "easy",
    'author': 'OpenEduCat Inc',
    'website': 'https://www.openeducat.org',
    'depends': [
        'web',
        'fleet',
        'openeducat_core',
        'bus',
    ],
    'data': [
        # Security first
        'security/security.xml',
        'security/ir.model.access.csv',
        
        # Views
        'views/fleet_vehicle_views.xml',
        'views/gps_log_views.xml',
        'views/bus_tracking_menus.xml',
        'views/bus_tracking_templates.xml',
        'views/bus_tracking_dashboard_views.xml',
        'views/assets.xml',  # Load assets after all other views
    ],
    'assets': {
        'web.assets_backend': [
            # CSS
            'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css',
            'openeducat_bus_tracking/static/src/css/bus_tracking.css',
            
            # JS - Core first
            'openeducat_bus_tracking/static/src/js/bus_tracking.js',
            
            # Map-related JS
            'openeducat_bus_tracking/static/src/js/bus_tracking_map.js',
            
            # Dashboard JS (depends on map)
            'openeducat_bus_tracking/static/src/js/dashboard.js',
        ],
        'web.assets_qweb': [
            'openeducat_bus_tracking/static/src/xml/bus_tracking_map.xml',
        ],
    },
    'demo': [
        'data/demo.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'openeducat_bus_tracking/static/src/js/bus_tracking_map.js',
            'openeducat_bus_tracking/static/src/xml/bus_tracking_map.xml',
            'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js',
            'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css',
        ],
    },
    'demo': [],
    'images': [
        'static/description/openeducat_bus_tracking_banner.jpg',
    ],
    'installable': True,
    'auto_install': False,
    'application': True,
    'price': 199,
    'currency': 'EUR',
    'live_test_url': 'https://www.openeducat.org/plans',
    'qweb': [
        'static/src/xml/bus_tracking_map.xml',
    ],
}
