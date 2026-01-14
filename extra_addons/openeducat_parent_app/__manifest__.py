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
    'name': 'Parent App',
    'version': '18.0.1.0',
    'license': 'LGPL-3',
    'category': 'Education',
    'sequence': 1,
    'summary': 'Dedicated Parent Portal App',
    'complexity': "easy",
    'author': 'OpenEduCat Inc',
    'website': 'https://www.openeducat.org',
    'depends': ['openeducat_core', 'openeducat_parent'],
    'data': [
        'security/security.xml',
        'security/ir.model.access.csv',
        'views/parent_dashboard.xml',
        'views/parent_menus.xml',
    ],
    'demo': [
        'demo/parent_dashboard_demo.xml',
    ],
    'images': [
        'static/description/icon.png',
    ],
    'installable': True,
    'auto_install': False,
    'application': True,  # This makes it appear as a separate app
}
