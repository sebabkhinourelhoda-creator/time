# Status System Documentation

## Overview
The Time2Thrive Health application now uses a unified 3-status system across all content types (documents and videos).

## Status Values
- **pending**: Content is waiting for review
- **rejected**: Content has been reviewed and rejected
- **verified**: Content has been reviewed and approved for public viewing

## Status Mappings
For backward compatibility, the system maps legacy status values:
- `accepted` → `verified`
- `approved` → `verified`
- `refused` → `rejected`

## Components Updated
1. **StatusBadge Component** (`src/components/StatusBadge.tsx`)
   - Unified status display with consistent styling
   - Utility functions for status checking and transitions
   - Backward compatibility mapping

2. **Documents Page** (`src/pages/Documents.tsx`)
   - Updated all status references from `accepted` to `verified`
   - Status filtering and display

3. **Video Management** (`src/pages/VideoManagement.tsx`)
   - Updated status dropdown options
   - Uses StatusBadge component for consistent display

4. **VideosExplore Page** (`src/pages/VideosExplore.tsx`)
   - Shows only `verified` videos to public users
   - Guest comment system with role selection

5. **Research Pages** (`src/pages/Research.tsx`, `src/pages/ResearchPapers.tsx`)
   - Updated to show only `verified` documents to public users

## Database Migration
- Migration script: `database/migrate_status_standardization.sql`
- Updates existing `accepted`/`approved` statuses to `verified`
- Updates existing `refused` statuses to `rejected`
- Adds constraints to enforce the 3-status system

## Type Definitions
```typescript
type ContentStatus = 'pending' | 'rejected' | 'verified'
```

## Public Content Filter
Only content with `verified` status is shown to public/guest users:
- Videos in VideosExplore
- Documents in Research sections
- Research papers

## Status Transitions
From any status, content can be moved to any other status:
- `pending` → `verified` | `rejected`
- `rejected` → `pending` | `verified` 
- `verified` → `pending` | `rejected`