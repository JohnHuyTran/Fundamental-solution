
export enum UserStatus {
  ACTIVE = 'Hoạt động',
  LOCKED = 'Đã khóa',
  PENDING = 'Chờ duyệt'
}

export enum UserRole {
  ADMIN = 'Quản trị viên',
  USER = 'Người dùng'
}

export enum SessionStatus {
  ACTIVE = 'Đang hoạt động',
  TERMINATED = 'Bị ngắt',
  EXPIRED = 'Hết hạn'
}

export enum RiskLevel {
  SAFE = 'Safe',
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

// --- Navigation Types ---
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
  INHERIT = 'Inherit',
  GRANT = 'Grant',
  DENY = 'Deny'
}

export interface UserMenuOverride {
  menuId: string;
  state: OverrideState;
}

// --- User Management & Groups ---
export interface UserGroup {
  id: string;
  name: string;
  parentId: string | null;
  description: string;
  memberCount: number;
  managerId: string | null; // Cập nhật: ID của người quản lý nhóm
  memberIds: string[];      // Cập nhật: Danh sách ID nhân viên thuộc nhóm
  children?: UserGroup[];
}

// --- Storage & Cloud Types ---
export interface DigitalSignature {
  id: string;
  signedBy: string;
  signedAt: string;
  certificateId: string;
  hash: string;
  isValid: boolean;
}

export interface FileVersion {
  id: string;
  version: number;
  size: number;
  updatedAt: string;
  updatedBy: string;
  comment: string;
}

export interface StorageStats {
  total: number;
  used: number;
  free: number;
  awsLimit: number;
  awsUsed: number;
  byProvider: { name: string; value: number; color: string }[];
  byType: { type: string; size: number; icon: string; color: string }[];
}

export interface StorageQuota {
  id: string;
  targetName: string;
  type: 'User' | 'Department';
  limit: number;
  used: number;
  userId?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'image' | 'document' | 'archive' | 'folder';
  size: number;
  updatedAt: string;
  parentId: string | null;
  owner: string;
  url?: string;
  sharedWith?: string[];
  isLocked?: boolean;
  versions?: FileVersion[];
  signature?: DigitalSignature;
}

export type StorageProviderType = 'Local' | 'AWS S3' | 'Google Cloud' | 'FTP' | 'Azure';

export interface StorageProviderConfig {
  id: string;
  type: StorageProviderType;
  name: string;
  status: 'Online' | 'Offline' | 'Testing';
  isDefault: boolean;
  credentials: Record<string, string>;
}

export interface StorageConfig {
  name: string;
  provider: StorageProviderType;
  status: 'Connected' | 'Disconnected';
  usage: number;
  allowedExtensions?: string[];
  maxFileSizeMB?: number;
}

// --- Security & Audit Log Types ---
export interface AuditLogEntry {
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
  bodyPreview: string;
  sessionId: string;
}

export interface RoleDefinition {
  id: string;
  name: string;
  code: string;
  description: string;
  isSystem: boolean;
}

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
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
    Security: boolean;
    Performance: boolean;
    Audit: boolean;
  };
  packages: LogPackageConfig[];
  appender: 'Local' | 'Centralized' | 'Cloud';
}

export enum MaskingRuleType {
  MASK_ALL = 'Mask All',
  PARTIAL = 'Partial Mask',
  HASH = 'Hash'
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

export interface UserFilters {
  search: string;
  role: string;
  status: string;
  department: string;
}

export interface UserSession {
  id: string;
  userName: string;
  ipAddress: string;
  device: string;
  browser: string;
  loginTime: string;
  lastActive: string;
  status: SessionStatus;
  duration?: string;
  logoutTime?: string;
}
