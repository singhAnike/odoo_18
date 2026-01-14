# Parent App - OpenEduCat

## Overview
This module creates a dedicated Parent Portal app that provides a focused interface for parent users in OpenEduCat. When parent users log in, they will only see this app and have access to their children's information.

## Features
- **Dedicated Parent App**: Separate application that appears in the Odoo app menu
- **Parent Dashboard**: Overview of children and key information
- **Children Information**: Access to their children's academic details
- **Attendance Reports**: View children's attendance records
- **Restricted Access**: Parents only see relevant information and cannot access other modules

## Installation

### 1. Install the Module
1. Place the `openeducat_parent_app` folder in your Odoo addons directory
2. Restart your Odoo server
3. Go to **Apps** menu in Odoo
4. Click **Update Apps List**
5. Search for "Parent App"
6. Click **Install**

### 2. Configure Parent Users
1. Go to **Settings** → **Users & Companies** → **Users**
2. Find your parent users (or create new ones)
3. In the **Access Rights** tab:
   - Remove all other OpenEduCat groups
   - Assign only the **Parent App User** group
4. Save the user

### 3. Create Parent User via Parent Record
Alternatively, when creating parent users through the Parent module:
1. Go to **SIS** → **Parents** → **Parents**
2. Create or edit a parent record
3. Click **Create Parent User** button
4. The system will automatically assign the Parent App User group

## Usage

### For Parents
1. Login with parent credentials
2. You will be automatically redirected to the Parent Portal app
3. Available features:
   - **Dashboard**: Overview of your children
   - **My Children**: Detailed information about each child
   - **Reports** → **Attendance**: View attendance records

### For Administrators
1. Parent users will only see the Parent App in their app menu
2. All other OpenEduCat apps (SIS, Assignments, etc.) will be hidden from parent users
3. Parents can only access data related to their own children

## Security Features
- **Data Isolation**: Parents can only see their own children's data
- **Menu Restrictions**: Other apps are hidden from parent users
- **Access Control**: Proper security rules ensure data privacy

## Technical Details
- **Module Name**: `openeducat_parent_app`
- **Dependencies**: `openeducat_core`, `openeducat_parent`
- **Main Model**: `parent.dashboard`
- **Security Group**: `group_parent_app_user`

## Troubleshooting

### Parent can see other apps
- Check that the user only has the "Parent App User" group assigned
- Ensure no other OpenEduCat groups are assigned to the parent user

### Menu not appearing
- Verify the module is installed and the user has the correct group
- Check that the parent user is properly linked to student records

### No children showing
- Ensure the parent record is linked to student records
- Verify the parent user is linked to the parent record
- Check that students have valid user accounts

## Support
For technical support or questions about this module, please contact your system administrator.
