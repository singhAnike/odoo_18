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

from odoo import fields, models, api


class ParentDashboard(models.Model):
    _name = "parent.dashboard"
    _description = "Parent Dashboard"

    name = fields.Char("Dashboard Name", default="Parent Dashboard")
    user_id = fields.Many2one('res.users', string='User', default=lambda self: self.env.user)
    children_count = fields.Integer(string='Number of Children', compute='_compute_children_count')

    @api.depends('user_id')
    def _compute_children_count(self):
        for record in self:
            if record.user_id and record.user_id.child_ids:
                students = self.env['op.student'].search([('user_id', 'in', record.user_id.child_ids.ids)])
                record.children_count = len(students)
            else:
                record.children_count = 0
    
    def action_view_children(self):
        """Action to view children"""
        self.ensure_one()
        if self.user_id and self.user_id.child_ids:
            return {
                'type': 'ir.actions.act_window',
                'name': 'My Children',
                'res_model': 'op.student',
                'view_mode': 'tree,form',
                'domain': [('user_id', 'in', self.user_id.child_ids.ids)],
                'context': {},
            }
        return {'type': 'ir.actions.act_window_close'}


class ResUsers(models.Model):
    _inherit = "res.users"

    # Add related field to access is_parent from partner
    is_parent = fields.Boolean("Is a Parent", related='partner_id.is_parent', store=True)


class OpParent(models.Model):
    _inherit = "op.parent"

    def create_parent_user(self):
        """Override to assign parent app group"""
        res = super(OpParent, self).create_parent_user()
        
        # Assign parent app group to the created user
        try:
            parent_app_group = self.env.ref('openeducat_parent_app.group_parent_app_user')
            for record in self:
                if record.user_id and parent_app_group:
                    record.user_id.groups_id = [(4, parent_app_group.id)]
        except:
            # Handle case where module is not installed
            pass
                
        return res
