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

from odoo import http
from odoo.http import request
from odoo.addons.web.controllers.home import Home
import werkzeug.utils


class ParentAppHome(Home):

    @http.route()
    def web_login(self, redirect=None, *args, **kw):
        response = super(ParentAppHome, self).web_login(
            redirect=redirect, *args, **kw)
        
        if not redirect and request.params.get('login_success'):
            user = request.env.user
            
            # Check if user is a parent with the parent app group
            if user.has_group('openeducat_parent_app.group_parent_app_user'):
                # Redirect to parent app dashboard
                try:
                    menu_ref = request.env.ref('openeducat_parent_app.menu_parent_app_root')
                    redirect = '/web#menu_id=%s' % menu_ref.id
                    return werkzeug.utils.redirect(redirect)
                except:
                    # Fallback if menu not found
                    redirect = '/web'
                    return werkzeug.utils.redirect(redirect)
                
        return response
