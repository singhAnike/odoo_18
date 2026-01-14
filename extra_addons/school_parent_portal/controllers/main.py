# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request

class ParentPortalController(http.Controller):
    @http.route('/school_parent_portal/home', auth='user', type='json')
    def home(self):
        return {
            'status': 'success',
            'message': 'Welcome to Parent Portal'
        }
