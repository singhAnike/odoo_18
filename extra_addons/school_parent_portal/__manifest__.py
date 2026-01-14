{
    'name': 'Parent Portal Dashboard',
    'version': '1.0',
    'category': 'Education',
    'summary': 'A responsive Parent Portal Dashboard using Owl Framework',
    'description': """
        This module provides a responsive Parent Portal Dashboard for Odoo 18.
        It features:
        - Auto-rotating Announcement Carousel with swipe support
        - Scrolling Ticker for important notices
        - Module Grid for quick access to school features
    """,
    'depends': [
        'base',
        'web',
        'mail',
        'calendar',
        'contacts',
        'website',
        'hr',
        'hr_holidays',
        'hr_attendance',
        'link_tracker',
        'openeducat_core',
        'openeducat_parent',
        'openeducat_parent_app',
        'openeducat_dashboard_manager',
        'openeducat_admission',
        'openeducat_exam',
        'openeducat_timetable',
        'openeducat_attendance',
        'openeducat_assignment',
        'openeducat_library',
    ],
    'data': [
        'security/security.xml',
        'views/menus.xml',
        'views/menu_restrictions.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'school_parent_portal/static/src/scss/parent_dashboard.scss',
            'school_parent_portal/static/src/xml/parent_dashboard.xml',
            'school_parent_portal/static/src/js/parent_dashboard.js',
        ],
    },
    'installable': True,
    'application': True,
    'license': 'LGPL-3',
}
