
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
  awsLimit: number; // Thêm giới hạn AWS
  awsUsed: number;  // Thêm dung lượng AWS đã dùng
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
  signature?: DigitalSignature; // Thêm chữ ký số
}

export interface ShareConfig {
  scope: 'anyone' | 'organization' | 'existing' | 'specific';
  permission: 'view' | 'edit';
  blockDownload: boolean;
  expirationDate?: string;
  password?: string;
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

export interface UserFolderPermission {
  userId?: string;
  folderId: string;
  folderName: string;
  parentId?: string | null;
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
    upload: boolean;
    download: boolean;
  };
  children?: UserFolderPermission[];
}

// --- Security & Role Types ---
export interface RoleDefinition {
  id: string;
  name: string;
  code: string;
  description: string;
  isSystem: boolean;
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
}

// --- Log & Monitoring Types ---
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
