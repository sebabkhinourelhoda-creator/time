# 📋 STATUS SYSTEM STANDARDIZATION PLAN

## 🔍 CURRENT STATUS ANALYSIS

### **Documents System:**
- **Database Field**: `status VARCHAR(20)`
- **TypeScript Type**: `'pending' | 'verified' | 'refused' | 'accepted'`
- **Current Usage**: 4 different status values

### **Videos System:**
- **Database Field**: `status VARCHAR(20) DEFAULT 'pending'`
- **TypeScript Type**: `string` (not strictly typed)
- **Current Usage**: `'pending' | 'approved' | 'rejected'`

## 🎯 PROPOSED UNIFIED STATUS SYSTEM

### **Standard Status Values:**
```typescript
type ContentStatus = 'pending' | 'approved' | 'rejected' | 'verified'
```

### **Status Definitions:**

#### 🟡 **PENDING** (Default)
- **Meaning**: Newly submitted content awaiting review
- **Color**: Yellow/Orange (`bg-yellow-100 text-yellow-800`)
- **Icon**: ⏳ Clock
- **Permissions**: Only visible to author and admins

#### 🟢 **APPROVED** (Public Ready)
- **Meaning**: Content reviewed and approved for public viewing
- **Color**: Green (`bg-green-100 text-green-800`)
- **Icon**: ✅ CheckCircle
- **Permissions**: Visible to all users

#### 🔴 **REJECTED** (Not Suitable)
- **Meaning**: Content reviewed but not suitable for publication
- **Color**: Red (`bg-red-100 text-red-800`)
- **Icon**: ❌ XCircle
- **Permissions**: Only visible to author and admins

#### 🔵 **VERIFIED** (High Quality)
- **Meaning**: Content approved AND verified by experts/admins as high quality
- **Color**: Blue (`bg-blue-100 text-blue-800`)
- **Icon**: 🏆 Award
- **Permissions**: Visible to all users, featured in recommendations

## 📊 STATUS WORKFLOW

```
┌─────────┐    Admin Review    ┌──────────┐    Expert Review    ┌──────────┐
│ PENDING │ ─────────────────> │ APPROVED │ ─────────────────> │ VERIFIED │
└─────────┘                    └──────────┘                    └──────────┘
     │                              │
     │         Admin Review         │
     └─────────────────────────────>│
                                   ┌──────────┐
                                   │ REJECTED │
                                   └──────────┘
```

## 🔄 MIGRATION PLAN

### **Phase 1: Standardize Documents**
- Update `'refused'` → `'rejected'`
- Update `'accepted'` → `'approved'`
- Keep `'pending'` and `'verified'` unchanged

### **Phase 2: Standardize Videos**
- Keep existing values: `'pending'`, `'approved'`, `'rejected'`
- Add support for `'verified'`

### **Phase 3: Update TypeScript Types**
- Unify both document and video status types
- Update all components to use consistent styling

## 🎨 VISUAL STANDARDS

### **Badge Components:**
```tsx
const getStatusBadge = (status: ContentStatus) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    verified: 'bg-blue-100 text-blue-800 border-blue-200'
  }
  
  const icons = {
    pending: '⏳',
    approved: '✅',
    rejected: '❌',
    verified: '🏆'
  }
  
  return { style: styles[status], icon: icons[status] }
}
```

## 📝 DATABASE CHANGES NEEDED

### **Documents Table:**
```sql
-- Update existing values to match new standard
UPDATE documents SET status = 'approved' WHERE status = 'accepted';
UPDATE documents SET status = 'rejected' WHERE status = 'refused';
-- Keep 'pending' and 'verified' unchanged
```

### **Videos Table:**
```sql
-- No changes needed - already follows standard
-- Future: Add support for 'verified' status
```

## 🔧 COMPONENT UPDATES NEEDED

### **Files to Update:**
1. `src/lib/documents.ts` - Update TypeScript type
2. `src/lib/videos.ts` - Add strict typing
3. `src/pages/Documents.tsx` - Update status handling
4. `src/pages/VideoManagement.tsx` - Ensure consistency
5. `src/pages/ResearchPapers.tsx` - Update filters
6. Create shared status utility component

## 🎯 BENEFITS OF STANDARDIZATION

1. **Consistency**: Same meaning across documents and videos
2. **Maintainability**: Single set of status handling logic
3. **User Experience**: Consistent visual indicators
4. **Scalability**: Easy to add new content types
5. **Admin Experience**: Unified moderation workflow

## 📋 IMPLEMENTATION CHECKLIST

- [ ] Update database values (documents: accepted→approved, refused→rejected)
- [ ] Create shared status utility component
- [ ] Update TypeScript interfaces
- [ ] Update all status checks in components
- [ ] Update status badges and styling
- [ ] Test all status transitions
- [ ] Update admin interfaces
- [ ] Document new status system