FROM odoo:18.0

# Use the custom odoo.conf file
# The odoo.conf is mounted as a volume in docker-compose.yml
# No need to set ODOO_ADDONS_PATH as it's defined in odoo.conf
