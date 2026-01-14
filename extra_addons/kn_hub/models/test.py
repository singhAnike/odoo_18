from odoo import fields, models


class AniTest(models.Model):
    _name = "ani.test"
    _description = "Ani Test"

    name = fields.Char(string="Name", required=True)
    ani_age = fields.Integer(string="Age")
    ani_gender = fields.Selection(
        [
            ("male", "Male"),
            ("female", "Female"),
            ("other", "Other"),
        ],
        string="Gender",
    )
        