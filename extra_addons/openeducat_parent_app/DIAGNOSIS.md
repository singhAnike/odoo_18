# Group Visibility Issue - Diagnosis

## Problem Identified
Your system only shows 6 basic Odoo groups:
- Technical / Allow the cash rounding management
- User types / Internal User  
- Extra Rights / Multi Currencies
- Technical / Public access to arbitrary exposed model
- Extra Rights / Technical Features
- Technical / User: Read his own attendances

**Missing**: All OpenEduCat groups including our Parent App groups.

## Possible Causes & Solutions

### 1. OpenEduCat Core Module Not Properly Installed
**Check**: Go to Apps → Search "OpenEduCat Core" → Should show "Installed"

**If not installed**:
- Install OpenEduCat Core first
- Then install OpenEduCat Parent
- Finally install Parent App

### 2. Database/Groups View Issue
**Try this**:
- Go to Settings → Users & Companies → Groups
- Click "Filters" (if visible)
- Remove any active filters
- Or try "Clear All"

### 3. User Permission Issue
**Check**: Make sure you're logged in as Administrator or a user with system access

### 4. Developer Mode Verification
**Enable Developer Mode**:
1. Settings → Activate Developer Mode
2. Go to Settings → Technical → Security → Groups
3. Remove all filters
4. Search for "OpenEduCat" or "Parent"

### 5. Database Direct Check
If you have database access, run:
```sql
SELECT count(*) as total_groups FROM res_groups;
SELECT name FROM res_groups WHERE name LIKE '%OpenEduCat%' OR name LIKE '%Parent%';
SELECT name, state FROM ir_module_module WHERE name LIKE '%openeducat%';
```

## Immediate Action Plan
1. **First**: Check if OpenEduCat Core is installed
2. **Second**: Try Developer Mode → Technical → Security → Groups
3. **Third**: If still no groups, reinstall OpenEduCat modules in order
4. **Fourth**: Install Parent App module last
