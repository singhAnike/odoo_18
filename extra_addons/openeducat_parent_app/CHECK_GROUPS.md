# How to Check if Parent App Groups Exist

## Step 1: Check Module Installation
1. Go to **Apps**
2. Search for "**Parent App**"
3. It should show as "**Installed**"
4. If not, click **Install**

## Step 2: Find the Groups (Multiple Methods)

### Method A: Through User Form
1. Go to **Settings** → **Users & Companies** → **Users**
2. Click on any user (like Administrator)
3. Go to **Access Rights** tab
4. Scroll down to find "**Parent App**" section
5. You should see "**Parent App User**" checkbox

### Method B: Through Groups List
1. Go to **Settings** → **Users & Companies** → **Groups**
2. Look for "**Parent App**" category
3. Should show "Parent App User" group

### Method C: Developer Mode
1. Enable Developer Mode: **Settings** → **Activate Developer Mode**
2. Go to **Settings** → **Technical** → **Security** → **Groups**
3. Search for "Parent App User"

## Step 3: If Groups Don't Appear
Try this upgrade process:

1. Go to **Apps**
2. Search "Parent App"
3. Click the **⚙️ gear icon** on the Parent App module
4. Click **Upgrade**
5. Wait for completion
6. Refresh your browser page
7. Check again using Method A above

## Step 4: Manual Database Check
If you have database access, run:

```sql
-- Check if groups exist
SELECT name FROM res_groups WHERE name LIKE '%Parent App%';

-- Check module category
SELECT name FROM ir_module_category WHERE name = 'Parent App';
```

## What You Should See
- Category: "Parent App"
- Group: "Parent App User"

## If Still Not Working
1. Check Odoo logs for any errors
2. Ensure openeducat_core and openeducat_parent are installed
3. Try restarting Odoo server
4. Share the CSV file with current groups so I can help debug
