
import { StorageStats, StorageQuota, StorageProviderConfig, FileItem, UserRole, UserStatus, User, RoleDefinition, UserSession, SessionStatus, LogEntry, LogLevel, LogSettings, LogPolicyConfig, MaskingRuleType, MenuItem } from './types';

export const INITIAL_MENU: MenuItem[] = [
  { id: 'm1', label: 'Dashboard Hệ thống', path: '/dashboard', icon: 'LayoutDashboard', isVisible: true, parentId: null },
  { 
    id: 'm2', label: 'Quản trị Tài nguyên', path: '/resources', icon: 'Database', isVisible: true, parentId: null,
    children: [
      { id: 'm2-1', label: 'Kho tệp tin tập trung', path: '/resources/files', icon: 'FolderClosed', isVisible: true, parentId: 'm2' },
      { id: 'm2-2', label: 'Phân quyền thư mục', path: '/resources/mapping', icon: 'ShieldAlert', isVisible: true, parentId: 'm2' }
    ]
  },
  { 
    id: 'm3', label: 'Giám sát & Nhật ký', path: '/system', icon: 'Terminal', isVisible: true, parentId: null,
    children: [
      { id: 'm3-1', label: 'Nhật ký truy cập (Logs)', path: '/system/logs', icon: 'Terminal', isVisible: true, parentId: 'm3' },
      { id: 'm3-2', label: 'Chính sách bảo mật', path: '/system/policy', icon: 'ShieldAlert', isVisible: true, parentId: 'm3' }
    ]
  },
  { id: 'm4', label: 'Quản lý Nhân sự', path: '/users', icon: 'LayoutDashboard', isVisible: true, parentId: null }
];

export const INITIAL_STORAGE_STATS: StorageStats = {
  total: 5000,
  used: 3240,
  free: 1760,
  awsUsed: 1540,
  awsLimit: 2000, // Ngưỡng AWS 2TB
  byProvider: [
    { name: 'Local Cluster', value: 1200, color: '#3b82f6' },
    { name: 'AWS S3', value: 1540, color: '#f59e0b' },
    { name: 'GCP Storage', value: 500, color: '#10b981' }
  ],
  byType: [
    { type: 'Tài liệu pháp lý', size: 450, icon: '📄', color: 'bg-emerald-500' },
    { type: 'Media & Hình ảnh', size: 1800, icon: '🖼️', color: 'bg-blue-500' },
    { type: 'Backup & Archives', size: 850, icon: '📦', color: 'bg-indigo-500' },
    { type: 'Khác', size: 140, icon: '📁', color: 'bg-slate-400' }
  ]
};

export const INITIAL_QUOTAS: StorageQuota[] = [
  { id: 'q1', targetName: 'Nguyễn Văn A', type: 'User', limit: 100, used: 95, userId: '1' },
  { id: 'q2', targetName: 'Trần Thị B', type: 'User', limit: 50, used: 42, userId: '2' },
  { id: 'q3', targetName: 'Lê Văn C', type: 'User', limit: 50, used: 10, userId: '3' },
  { id: 'q4', targetName: 'Phạm Thị D', type: 'User', limit: 100, used: 88, userId: '4' },
  { id: 'q10', targetName: 'Phòng Kỹ thuật', type: 'Department', limit: 2000, used: 1450 }
];

export const INITIAL_FILES: FileItem[] = [
  { id: 'root-1', name: 'Tài liệu Dự án 2024', type: 'folder', size: 0, updatedAt: '2024-05-22', parentId: null, owner: 'System' },
  { id: 'root-2', name: 'Pháp chế & Hợp đồng', type: 'folder', size: 0, updatedAt: '2024-05-22', parentId: null, owner: 'Legal Dept' },
  { id: 'root-3', name: 'Media Final Assets', type: 'folder', size: 0, updatedAt: '2024-05-22', parentId: null, owner: 'Creative Team' },
  
  // Level 1: Tài liệu Dự án 2024
  { id: 'sub-1', name: 'Hồ sơ Thiết kế (Architecture)', type: 'folder', size: 0, updatedAt: '2024-05-22', parentId: 'root-1', owner: 'Lê Văn C' },
  { id: 'sub-2', name: 'Đặc tả Nghiệp vụ (BA)', type: 'folder', size: 0, updatedAt: '2024-05-22', parentId: 'root-1', owner: 'Nguyễn Văn A' },
  
  // Level 2: Hồ sơ Thiết kế
  { id: 'sub-sub-1', name: 'Database Schema v3.sql', type: 'document', size: 1200000, updatedAt: '2024-05-21', parentId: 'sub-1', owner: 'Lê Văn C' },
  { id: 'sub-sub-2', name: 'Cloud Infra Diagram.png', type: 'image', size: 2500000, updatedAt: '2024-05-20', parentId: 'sub-1', owner: 'Lê Văn C' },

  { 
    id: 'f1-1', name: 'Tài liệu SRS v2.1.pdf', type: 'document', size: 4500000, updatedAt: '2024-05-22', parentId: 'sub-2', owner: 'Nguyễn Văn A',
    versions: [
      { id: 'v1', version: 3, size: 4500000, updatedAt: '2024-05-22', updatedBy: 'Nguyễn Văn A', comment: 'Cập nhật module storage theo feedback' },
      { id: 'v2', version: 2, size: 4100000, updatedAt: '2024-05-15', updatedBy: 'Nguyễn Văn A', comment: 'Bản sửa đổi nội dung tầng phân quyền' },
      { id: 'v3', version: 1, size: 3800000, updatedAt: '2024-05-10', updatedBy: 'Admin', comment: 'Draft đầu tiên' }
    ],
    signature: {
      id: 'sig-101',
      signedBy: 'Đỗ Văn G (CEO)',
      signedAt: '2024-05-22 10:30',
      certificateId: 'OMNI-CERT-2024-X99',
      hash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      isValid: true
    }
  },
  { 
    id: 'f1-2', name: 'Hợp đồng LG-CNS-Final.pdf', type: 'document', size: 8400000, updatedAt: '2024-05-21', parentId: 'root-2', owner: 'Pháp chế',
    signature: {
      id: 'sig-102',
      signedBy: 'Vũ Thị F (CFO)',
      signedAt: '2024-05-21 15:45',
      certificateId: 'OMNI-CERT-FIN-42',
      hash: 'sha256:8f4340da7b6f8498f395f4e3f8487e4526d1607590833a69622d17c9d0d3d3d',
      isValid: true
    }
  }
];

export const INITIAL_PROVIDERS: StorageProviderConfig[] = [
  { id: 'p1', type: 'Local', name: 'SSD Cluster 01', status: 'Online', isDefault: true, credentials: { path: '/mnt/storage/cluster-01' } },
  { id: 'p2', type: 'AWS S3', name: 'Amazon S3 Global', status: 'Online', isDefault: false, credentials: { bucket: 'omnicore-global', region: 'us-east-1' } },
  { id: 'p3', type: 'Google Cloud', name: 'Google Cloud (HK)', status: 'Online', isDefault: false, credentials: { bucket: 'omnicore-backup', region: 'asia-east2' } }
];

export const INITIAL_USERS: User[] = [
  { id: '1', username: 'vana', fullName: 'Nguyễn Văn A', email: 'vana@omnicore.pro', phone: '0901234567', role: UserRole.ADMIN, department: 'Kỹ thuật', status: UserStatus.ACTIVE, createdAt: '2023-01-15', lastLogin: '2024-05-22' },
  { id: '2', username: 'thib', fullName: 'Trần Thị B', email: 'thib@omnicore.pro', phone: '0912345678', role: UserRole.USER, department: 'Kinh doanh', status: UserStatus.ACTIVE, createdAt: '2023-03-10', lastLogin: '2024-05-21' },
  { id: '3', username: 'vanc', fullName: 'Lê Văn C', email: 'vanc@omnicore.pro', phone: '0933333333', role: UserRole.USER, department: 'Kỹ thuật', status: UserStatus.ACTIVE, createdAt: '2023-06-20', lastLogin: '2024-05-20' },
  { id: '7', username: 'vang', fullName: 'Đỗ Văn G', email: 'vang@omnicore.pro', phone: '0977777777', role: UserRole.ADMIN, department: 'Ban Giám đốc', status: UserStatus.ACTIVE, createdAt: '2022-12-01', lastLogin: '2024-05-22' }
];

export const INITIAL_ROLES: RoleDefinition[] = [
  { id: 'r1', name: 'Quản trị viên toàn hệ thống', code: 'SUPER_ADMIN', description: 'Toàn quyền cấu hình, quản trị hạ tầng và giám sát.', isSystem: true },
  { id: 'r2', name: 'Người dùng khối văn phòng', code: 'OFFICE_USER', description: 'Quyền truy cập tệp tin và các module nghiệp vụ cơ bản.', isSystem: true },
  { id: 'r3', name: 'Kiểm toán viên an ninh', code: 'AUDITOR', description: 'Chỉ có quyền xem nhật ký và báo cáo tình trạng hệ thống.', isSystem: false }
];

export const INITIAL_SESSIONS: UserSession[] = [
  { id: 's1', userName: 'Nguyễn Văn A', ipAddress: '192.168.1.15', device: 'MacBook Pro 16"', browser: 'Chrome 125', loginTime: '2024-05-22 08:30', lastActive: 'Vừa xong', status: SessionStatus.ACTIVE, duration: '2h 15m' }
];

export const INITIAL_LOGS: LogEntry[] = [
  { id: 'l1', timestamp: '2024-05-22 14:30:05', level: LogLevel.INFO, service: 'AuthGateway', threadId: 'auth-w-01', message: 'Tài khoản vana@omnicore.pro đã xác thực thành công qua MFA.' }
];

export const INITIAL_LOG_SETTINGS: LogSettings = {
  format: 'JSON',
  pattern: '%d{yyyy-MM-dd HH:mm:ss} [%p] %c{1} - %m%n',
  toggles: { Security: true, Performance: true, Audit: true },
  packages: [{ id: 'pkg1', packageName: 'com.omnicore.security', level: LogLevel.DEBUG }],
  appender: 'Centralized'
};

export const INITIAL_LOG_POLICY: LogPolicyConfig = {
  maskingRules: [{ id: 'm1', key: 'password|token', rule: MaskingRuleType.MASK_ALL }],
  whitelist: 'user_id, action_code',
  retention: { generalDays: 60, securityDays: 730, autoPurge: true, archivingDestination: 'S3' }
};

export const DEPARTMENTS = ['Kỹ thuật', 'Kinh doanh', 'Marketing', 'Nhân sự', 'Tài chính', 'Ban Giám đốc', 'Pháp chế'];
export const ROLES = [UserRole.ADMIN, UserRole.USER];
export const STATUSES = [UserStatus.ACTIVE, UserStatus.LOCKED, UserStatus.PENDING];
