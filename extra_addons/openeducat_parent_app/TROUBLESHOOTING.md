# Parent App - Troubleshooting Guide

## Issue: "Not seeing any user group"

### Step 1: Verify Module Installation
1. Go to **Apps** menu in Odoo
2. Remove all filters (click the ❌ next to search filters)
3. Search for "**Parent App**"
4. Check if the module shows as "**Installed**"
5. If not installed, click **Install**

### Step 2: Check for Installation Errors
If installation failed:
1. Go to **Settings** → **Technical** → **Logging**
2. Look for any errors related to "openeducat_parent_app"
3. Common issues:
   - Dependencies not installed (openeducat_core, openeducat_parent)
   - Permission issues
   - Database errors

### Step 3: Find the User Groups
After successful installation, find the groups here:

**Method 1: Through User Management**
1. Go to **Settings** → **Users & Companies** → **Users**
2. Select any user
3. Go to **Access Rights** tab
4. Look for "**Parent App**" section
5. You should see:
   - Parent App User
   - Parent App Manager

**Method 2: Through Groups Management**
1. Go to **Settings** → **Users & Companies** → **Groups**
2. Look for "**Parent App**" category
3. You should see the groups listed there

**Method 3: Developer Mode (if needed)**
1. Enable Developer Mode: Settings → Activate Developer Mode
2. Go to **Settings** → **Technical** → **Security** → **Groups**
3. Search for "Parent App"

### Step 4: Manual Group Assignment
If groups are visible but not working:
1. Go to **Settings** → **Users & Companies** → **Users**
2. Find your parent user
3. Go to **Access Rights** tab
4. **Remove all other OpenEduCat groups** (very important!)
5. Assign only "**Parent App User**" group
6. Save the user
7. Test by logging in with that user

### Step 5: Verify Parent User Setup
For the parent app to work properly:
1. The user must have `is_parent = True` on their partner record
2. The user must be linked to student records via `child_ids`
3. The user should only have portal access + Parent App group

### Step 6: Force Module Update
If still not working:
1. Go to **Apps** menu
2. Search for "Parent App"
3. Click the **⚙️ (gear)** button on the module
4. Select **Upgrade**
5. Wait for completion
6. Restart Odoo server if possible

### Step 7: Check Database (Advanced)
If you have database access, run these queries:

```sql
-- Check if module is installed
SELECT name, state FROM ir_module_module WHERE name = 'openeducat_parent_app';

-- Check if groups exist
SELECT name, category_id FROM res_groups WHERE name LIKE '%Parent App%';

-- Check module category
SELECT name, sequence FROM ir_module_category WHERE name = 'Parent App';
```

### Common Solutions

**Problem**: Groups not visible in user form
**Solution**: Make sure the module is fully installed and try refreshing the page

**Problem**: Groups exist but don't work
**Solution**: Remove all other OpenEduCat groups from the parent user

**Problem**: Parent redirected to wrong page
**Solution**: Make sure parent user has `is_parent = True` and proper child_ids

**Problem**: Parent can see other apps
**Solution**: Verify only "Parent App User" group is assigned (no other groups)

### Getting Help
If none of these steps work:
1. Check the Odoo logs for detailed error messages
2. Verify all dependencies are installed
3. Try creating a fresh parent user from scratch
4. Contact your system administrator

### Debug Information to Collect
If you need help, please provide:
1. Module installation status
2. Any error messages from logs
3. User group assignments for the problematic user
4. Whether other OpenEduCat modules work correctly
