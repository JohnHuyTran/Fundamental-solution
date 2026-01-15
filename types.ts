
export enum UserStatus {
  ACTIVE = 'Active',
  LOCKED = 'Locked',
  PENDING = 'Pending'
}

export enum UserRole {
  ADMIN = 'Administrator',
  USER = 'Standard User'
}

export enum RiskLevel {
  SAFE = 'Safe',
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  createdAt: string;
  lastLogin: string;
}

// Updated UserGroup to include id/name aliases as used by components
export interface UserGroup {
  id: string;
  key: string;
  name: string;
  title: string;
  description: string;
  memberCount: number;
  children?: UserGroup[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  risk: RiskLevel;
  method: string;
  uri: string;
  status: number;
  username: string;
  ip: string;
  device: string;
  browser: string;
  payload: string;
}

// Updated UserSession to match usage in components
export enum SessionStatus {
  ACTIVE = 'Active',
  TERMINATED = 'Terminated',
  EXPIRED = 'Expired'
}

export interface UserSession {
  id: string;
  username: string;
  userName?: string; // Component alias
  ip: string;
  ipAddress?: string; // Component alias
  device: string;
  browser?: string;
  loginTime: string;
  logoutTime?: string;
  lastActive: string;
  duration?: string;
  status: SessionStatus;
}

// Added missing UserFilters type
export interface UserFilters {
  search: string;
  role: string;
  department: string;
  status: string;
}

// Added missing RoleDefinition type
export interface RoleDefinition {
  id: string;
  name: string;
  code: string;
  description: string;
  isSystem?: boolean;
}

// Added missing Storage/File management types
export type StorageProviderType = 'Local' | 'AWS S3' | 'Google Cloud' | 'Azure' | 'FTP';

export interface StorageConfig {
  name: string;
  provider: string;
  usage: number;
  status: 'Connected' | 'Disconnected' | 'Warning';
  allowedExtensions?: string[];
  maxFileSizeMB?: number;
}

export interface StorageProviderConfig {
  id: string;
  name: string;
  type: StorageProviderType;
  status: string;
  isDefault?: boolean;
}

export interface StorageQuota {
  id: string;
  type: 'User' | 'Group';
  targetName: string;
  used: number;
  limit: number;
}

export interface FileVersion {
  id: string;
  version: number;
  comment: string;
  updatedBy: string;
  updatedAt: string;
  size: number;
}

export interface DigitalSignature {
  id: string;
  signedBy: string;
  signedAt: string;
  certificateId: string;
  hash: string;
  isValid: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'image' | 'document' | 'archive';
  size: number;
  owner: string;
  updatedAt: string;
  parentId: string | null;
  signature?: DigitalSignature;
  versions?: FileVersion[];
}

export interface StorageStats {
  used: number;
  free: number;
  awsUsed: number;
  awsLimit: number;
  byType: { type: string; size: number }[];
}

// Added missing Log management types
export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  service: string;
  threadId: string;
  message: string;
  stackTrace?: string;
}

export interface LogPackageConfig {
  id: string;
  packageName: string;
  level: LogLevel;
}

export interface LogSettings {
  format: 'Plain Text' | 'JSON';
  pattern: string;
  toggles: {
    Performance: boolean;
    Security: boolean;
    Database: boolean;
  };
  packages: LogPackageConfig[];
  appender: 'Local' | 'Centralized' | 'Cloud';
}

export enum MaskingRuleType {
  MASK_ALL = 'Mask All',
  PARTIAL = 'Partial Mask',
  SHOW_LAST_4 = 'Show Last 4'
}

export interface MaskingRule {
  id: string;
  key: string;
  rule: MaskingRuleType;
}

export interface LogPolicyConfig {
  maskingRules: MaskingRule[];
  whitelist: string;
  retention: {
    generalDays: number;
    securityDays: number;
    autoPurge: boolean;
    archivingDestination: 'Local' | 'S3' | 'Cold Storage';
  };
}

// Added missing Navigation types
export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  isVisible: boolean;
  parentId: string | null;
  children?: MenuItem[];
}

export enum OverrideState {
  GRANT = 'GRANT',
  DENY = 'DENY',
  INHERIT = 'INHERIT'
}

// Added missing AuditLogEntry type
export interface AuditLogEntry {
  id: string;
  risk: RiskLevel;
  timestamp: string;
  method: string;
  uri: string;
  bodyPreview: string;
  username: string;
  ip: string;
  device: string;
  browser: string;
  status: number;
}
