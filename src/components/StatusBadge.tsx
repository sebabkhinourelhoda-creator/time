import { Badge } from './ui/badge'
import { Clock, XCircle, Award } from 'lucide-react'

// Unified 3-status type for all content (documents, videos, etc.)
export type ContentStatus = 'pending' | 'rejected' | 'verified'

// Legacy mappings for migration to 3-status system
export const STATUS_MAPPINGS = {
  // Documents legacy → new
  'accepted': 'verified',
  'approved': 'verified', 
  'refused': 'rejected',
  // Already standardized
  'pending': 'pending',
  'verified': 'verified',
  'rejected': 'rejected',
} as const

export interface StatusConfig {
  label: string
  color: string
  bgColor: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

export const STATUS_CONFIG: Record<ContentStatus, StatusConfig> = {
  pending: {
    label: 'Pending Review',
    color: 'text-yellow-800',
    bgColor: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-200',
    icon: Clock,
    description: 'Awaiting admin review'
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-800',
    bgColor: 'bg-red-100 hover:bg-red-200 border-red-200', 
    icon: XCircle,
    description: 'Not suitable for publication'
  },
  verified: {
    label: 'Verified',
    color: 'text-green-800',
    bgColor: 'bg-green-100 hover:bg-green-200 border-green-200',
    icon: Award,
    description: 'Verified and approved for public viewing'
  }
}

interface StatusBadgeProps {
  status: string // Accept string for backward compatibility
  showIcon?: boolean
  showLabel?: boolean
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

export function StatusBadge({ 
  status, 
  showIcon = true, 
  showLabel = true, 
  size = 'default',
  className = '' 
}: StatusBadgeProps) {
  // Normalize status using mappings
  const normalizedStatus = STATUS_MAPPINGS[status as keyof typeof STATUS_MAPPINGS] || status as ContentStatus
  const config = STATUS_CONFIG[normalizedStatus]
  
  if (!config) {
    console.warn(`Unknown status: ${status}`)
    return (
      <Badge variant="secondary" className={className}>
        {status}
      </Badge>
    )
  }

  const IconComponent = config.icon
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    default: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  }
  
  const iconSizes = {
    sm: 'h-3 w-3',
    default: 'h-4 w-4', 
    lg: 'h-5 w-5'
  }

  return (
    <Badge 
      className={`
        ${config.bgColor} 
        ${config.color} 
        ${sizeClasses[size]} 
        border 
        inline-flex 
        items-center 
        gap-1.5 
        font-medium
        ${className}
      `}
    >
      {showIcon && <IconComponent className={iconSizes[size]} />}
      {showLabel && config.label}
    </Badge>
  )
}

// Utility functions
export function getStatusConfig(status: string): StatusConfig | null {
  const normalizedStatus = STATUS_MAPPINGS[status as keyof typeof STATUS_MAPPINGS] || status as ContentStatus
  return STATUS_CONFIG[normalizedStatus] || null
}

export function isPublicStatus(status: string): boolean {
  const normalizedStatus = STATUS_MAPPINGS[status as keyof typeof STATUS_MAPPINGS] || status as ContentStatus
  return normalizedStatus === 'verified'
}

export function isPendingStatus(status: string): boolean {
  const normalizedStatus = STATUS_MAPPINGS[status as keyof typeof STATUS_MAPPINGS] || status as ContentStatus
  return normalizedStatus === 'pending'
}

export function isRejectedStatus(status: string): boolean {
  const normalizedStatus = STATUS_MAPPINGS[status as keyof typeof STATUS_MAPPINGS] || status as ContentStatus
  return normalizedStatus === 'rejected'
}

export function isVerifiedStatus(status: string): boolean {
  const normalizedStatus = STATUS_MAPPINGS[status as keyof typeof STATUS_MAPPINGS] || status as ContentStatus
  return normalizedStatus === 'verified'
}

// Status transition helpers (3-status system)
export function getNextStatusOptions(currentStatus: string): ContentStatus[] {
  const normalizedStatus = STATUS_MAPPINGS[currentStatus as keyof typeof STATUS_MAPPINGS] || currentStatus as ContentStatus
  
  switch (normalizedStatus) {
    case 'pending':
      return ['verified', 'rejected']
    case 'rejected':
      return ['pending', 'verified']
    case 'verified':
      return ['pending', 'rejected']
    default:
      return ['pending', 'rejected', 'verified']
  }
}

// Filter helpers for public content (3-status system)
export function getPublicStatuses(): ContentStatus[] {
  return ['verified']
}

export function getAllStatuses(): ContentStatus[] {
  return ['pending', 'rejected', 'verified']
}