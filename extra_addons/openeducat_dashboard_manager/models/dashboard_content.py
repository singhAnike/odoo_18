from odoo import models, fields

class DashboardAnnouncement(models.Model):
    _name = 'dashboard.announcement'
    _description = 'Dashboard Announcement'
    _order = 'sequence, id'

    name = fields.Char(string='Title', required=True)
    image = fields.Image(string='Image', max_width=1920, max_height=1080)
    announcement_type = fields.Selection([
        ('event', 'Event'),
        ('announcement', 'Announcement'),
        ('news', 'News'),
        ('sports', 'Sports'),
        ('holiday', 'Holiday')
    ], string='Type', default='announcement', required=True)
    active = fields.Boolean(default=True)
    sequence = fields.Integer(default=10)

class DashboardNotice(models.Model):
    _name = 'dashboard.notice'
    _description = 'Dashboard Notice'
    _order = 'sequence, id'

    name = fields.Char(string='Notice Text', required=True)
    active = fields.Boolean(default=True)
    sequence = fields.Integer(default=10)
