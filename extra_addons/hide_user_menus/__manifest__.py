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
    'name': 'Hide User Menus',
    'version': '18.0.1.0',
    'license': 'LGPL-3',
    'category': 'Tools',
    "sequence": 1,
    'summary': 'Hide User Menus from Top Right Corner',
    'complexity': 'easy',
    'author': 'OpenEduCat Inc',
    'website': 'https://www.openeducat.org',
    'description': """
        This module modifies the Odoo user interface by hiding elements in the top right user menu,
        including:
        - Documentation
        - Support
        - Shortcuts
        - Onboarding
        - My Odoo.com account
        
        This creates a cleaner and more focused user interface by removing unnecessary menu items.
    """,
    'depends': ['base', 'web'],
    'assets': {
        'web.assets_backend': [
            'hide_user_menus/static/src/js/user_menus.js',
        ],
    },
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
