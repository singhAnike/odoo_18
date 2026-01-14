from odoo import http
from odoo.http import request, Response

class MyController(http.Controller):

    @http.route('/my/page', auth='public', website=True, type='http')
    def my_page(self, **kwargs):
        return Response('<h1>Hi Aniket</h1>', content_type='text/html;charset=utf-8')
