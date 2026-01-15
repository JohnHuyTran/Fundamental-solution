
import { StorageStats, StorageQuota, StorageProviderConfig, FileItem, UserRole, UserStatus, User, RoleDefinition, UserSession, SessionStatus, LogEntry, LogLevel, LogSettings, LogPolicyConfig, MaskingRuleType, MenuItem, AuditLogEntry, RiskLevel, UserGroup } from './types';

export const INITIAL_MENU: MenuItem[] = [
  { id: 'm1', label: 'Dashboard Hệ thống', path: '/dashboard', icon: 'LayoutDashboard', isVisible: true, parentId: null },
  { id: 'm2', label: 'Người dùng & Bảo mật', path: '/users', icon: 'UserIcon', isVisible: true, parentId: null },
  { id: 'm3', label: 'Lưu trữ Tài nguyên', path: '/resources', icon: 'HardDrive', isVisible: true, parentId: null }
];

export const INITIAL_STORAGE_STATS: StorageStats = {
  total: 5000,
  used: 3240,
  free: 1760,
  awsUsed: 1540,
  awsLimit: 2000,
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
  { id: 'q3', targetName: 'Lê Văn C', type: 'User', limit: 20, used: 18, userId: '3' },
  { id: 'q4', targetName: 'Hoàng Thị D', type: 'User', limit: 200, used: 10, userId: '4' },
  { id: 'q10', targetName: 'Phòng Kỹ thuật', type: 'Department', limit: 2000, used: 1450 }
];

export const INITIAL_FILES: FileItem[] = [
  { id: 'root-1', name: 'Tài liệu Dự án 2024', type: 'folder', size: 0, updatedAt: '2024-05-22', parentId: null, owner: 'System' },
  { id: 'f1-1', name: 'Tài liệu SRS v2.1.pdf', type: 'document', size: 4500000, updatedAt: '2024-05-22', parentId: 'root-1', owner: 'Nguyễn Văn A' },
  { id: 'f1-2', name: 'Banner_Campaign_Q3.png', type: 'image', size: 12500000, updatedAt: '2024-05-21', parentId: null, owner: 'Trần Thị B' },
  { id: 'f1-3', name: 'Source_Core_Backend.zip', type: 'archive', size: 850000000, updatedAt: '2024-05-20', parentId: null, owner: 'Lê Văn C' }
];

export const INITIAL_PROVIDERS: StorageProviderConfig[] = [
  { id: 'p1', type: 'Local', name: 'SSD Cluster 01', status: 'Online', isDefault: true, credentials: { path: '/mnt/storage' } },
  { id: 'p2', type: 'AWS S3', name: 'Amazon S3 Global', status: 'Online', isDefault: false, credentials: { bucket: 'omni-vault' } },
  { id: 'p3', type: 'Google Cloud', name: 'GCP Bucket Asia', status: 'Testing', isDefault: false, credentials: { project: 'omni-cloud' } }
];

export const INITIAL_USERS: User[] = [
  { id: '1', username: 'vana', fullName: 'Nguyễn Văn A', email: 'vana@omnicore.pro', phone: '0901234567', role: UserRole.ADMIN, department: 'Kỹ thuật', status: UserStatus.ACTIVE, createdAt: '2023-01-15', lastLogin: '2024-05-22' },
  { id: '2', username: 'thib', fullName: 'Trần Thị B', email: 'thib@omnicore.pro', phone: '0912345678', role: UserRole.USER, department: 'Kinh doanh', status: UserStatus.ACTIVE, createdAt: '2023-03-10', lastLogin: '2024-05-21' },
  { id: '3', username: 'vanc', fullName: 'Lê Văn C', email: 'vanc@omnicore.pro', phone: '0933333333', role: UserRole.USER, department: 'Kỹ thuật', status: UserStatus.LOCKED, createdAt: '2023-06-20', lastLogin: '2024-05-20' },
  { id: '4', username: 'thid', fullName: 'Hoàng Thị D', email: 'thid@omnicore.pro', phone: '0944444444', role: UserRole.USER, department: 'Marketing', status: UserStatus.PENDING, createdAt: '2024-01-05', lastLogin: 'Chưa đăng nhập' },
  { id: '5', username: 'vane', fullName: 'Phạm Văn E', email: 'vane@omnicore.pro', phone: '0955555555', role: UserRole.USER, department: 'Tài chính', status: UserStatus.ACTIVE, createdAt: '2023-11-12', lastLogin: '2024-05-18' },
  { id: '6', username: 'thif', fullName: 'Vũ Thị F', email: 'thif@omnicore.pro', phone: '0966666666', role: UserRole.USER, department: 'Nhân sự', status: UserStatus.ACTIVE, createdAt: '2023-08-30', lastLogin: '2024-05-19' },
  { id: '7', username: 'vang', fullName: 'Đặng Văn G', email: 'vang@omnicore.pro', phone: '0977777777', role: UserRole.USER, department: 'Ban Giám đốc', status: UserStatus.ACTIVE, createdAt: '2023-02-14', lastLogin: '2024-05-22' },
  { id: '8', username: 'thih', fullName: 'Ngô Thị H', email: 'thih@omnicore.pro', phone: '0988888888', role: UserRole.USER, department: 'Kỹ thuật', status: UserStatus.ACTIVE, createdAt: '2023-12-01', lastLogin: '2024-05-20' },
  { id: '9', username: 'vani', fullName: 'Bùi Văn I', email: 'vani@omnicore.pro', phone: '0999999999', role: UserRole.USER, department: 'Kinh doanh', status: UserStatus.LOCKED, createdAt: '2023-10-10', lastLogin: '2024-05-15' },
  { id: '10', username: 'thik', fullName: 'Lý Thị K', email: 'thik@omnicore.pro', phone: '0901111111', role: UserRole.USER, department: 'Marketing', status: UserStatus.ACTIVE, createdAt: '2024-02-20', lastLogin: '2024-05-21' },
];

export const INITIAL_GROUPS: UserGroup[] = [
  { 
    id: 'g1', name: 'OmniCore Holding', parentId: null, description: 'Tổng công ty', memberCount: 120, managerId: '1', memberIds: ['1', '7'],
    children: [
      { id: 'g2', name: 'Khối Kỹ Thuật', parentId: 'g1', description: 'R&D and Ops', memberCount: 45, managerId: '8', memberIds: ['8', '1', '3'],
        children: [
          { id: 'g2-1', name: 'Backend Team', parentId: 'g2', description: 'API Services', memberCount: 20, managerId: null, memberIds: [] },
          { id: 'g2-2', name: 'Security Unit', parentId: 'g2', description: 'SecOps', memberCount: 10, managerId: null, memberIds: [] },
          { id: 'g2-3', name: 'Mobile Team', parentId: 'g2', description: 'iOS/Android Dev', memberCount: 15, managerId: null, memberIds: [] }
        ]
      },
      { id: 'g3', name: 'Khối Kinh Doanh', parentId: 'g1', description: 'Sales & Marketing', memberCount: 75, managerId: '2', memberIds: ['2', '9'],
        children: [
          { id: 'g3-1', name: 'Regional Sales', parentId: 'g3', description: 'Direct Sales', memberCount: 50, managerId: null, memberIds: [] },
          { id: 'g3-2', name: 'Digital Marketing', parentId: 'g3', description: 'Ads & Content', memberCount: 25, managerId: null, memberIds: [] }
        ]
      },
      { id: 'g4', name: 'Trung tâm Vận hành', parentId: 'g1', description: 'CS and Support', memberCount: 30, managerId: null, memberIds: [] }
    ]
  }
];

export const INITIAL_SESSIONS: UserSession[] = [
  { id: 's1', userName: 'vana', ipAddress: '192.168.1.15', device: 'MacBook Pro', browser: 'Chrome 125', loginTime: '2024-05-22 08:30', lastActive: 'Vừa xong', status: SessionStatus.ACTIVE },
  { id: 's2', userName: 'thib', ipAddress: '113.12.55.21', device: 'iPhone 15', browser: 'Safari Mobile', loginTime: '2024-05-22 10:15', lastActive: '5 phút trước', status: SessionStatus.ACTIVE },
  { id: 's3', userName: 'vang', ipAddress: '1.2.3.4', device: 'Windows Desktop', browser: 'Edge 124', loginTime: '2024-05-22 09:00', lastActive: '12 phút trước', status: SessionStatus.ACTIVE },
];

export const SESSION_HISTORY_MOCK: UserSession[] = [
  { id: 'sh1', userName: 'thib', ipAddress: '172.16.0.42', device: 'Windows Desktop', browser: 'Edge 124', loginTime: '2024-05-21 09:00', logoutTime: '2024-05-21 17:05', lastActive: '21/05/2024', status: SessionStatus.EXPIRED, duration: '8h 5m' },
  { id: 'sh2', userName: 'vanc', ipAddress: '1.2.3.4', device: 'iPhone 15', browser: 'Safari Mobile', loginTime: '2024-05-20 20:10', logoutTime: '2024-05-20 20:15', lastActive: '20/05/2024', status: SessionStatus.TERMINATED, duration: '5m' },
  { id: 'sh3', userName: 'admin', ipAddress: '127.0.0.1', device: 'Linux Server', browser: 'Curl/8.4.0', loginTime: '2024-05-19 23:00', logoutTime: '2024-05-20 01:00', lastActive: '20/05/2024', status: SessionStatus.EXPIRED, duration: '2h' },
];

export const ACCESS_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'a1', timestamp: '2024-05-22 14:30:05', risk: RiskLevel.SAFE, method: 'POST', uri: '/api/v1/auth/login', status: 200, username: 'vana', ip: '192.168.1.15', device: 'MacBook', browser: 'Chrome', bodyPreview: '{"username": "vana"}', sessionId: 's1' },
  { id: 'a2', timestamp: '2024-05-22 14:35:10', risk: RiskLevel.MEDIUM, method: 'POST', uri: '/api/v1/auth/login', status: 401, username: 'root', ip: '45.12.33.1', device: 'Unknown Linux', browser: 'Python-requests', bodyPreview: '{"username": "root"}', sessionId: '-' },
  { id: 'a3', timestamp: '2024-05-22 14:40:00', risk: RiskLevel.CRITICAL, method: 'GET', uri: '/api/v1/users?search=\' OR 1=1 --', status: 403, username: 'attacker', ip: '103.44.1.2', device: 'Kali Linux', browser: 'Firefox', bodyPreview: '-', sessionId: '-' },
  { id: 'a4', timestamp: '2024-05-22 14:42:00', risk: RiskLevel.LOW, method: 'GET', uri: '/api/v1/files/secret.pdf', status: 404, username: 'vana', ip: '192.168.1.15', device: 'MacBook', browser: 'Chrome', bodyPreview: '-', sessionId: 's1' },
  { id: 'a5', timestamp: '2024-05-22 14:45:00', risk: RiskLevel.HIGH, method: 'POST', uri: '/api/v1/admin/config', status: 403, username: 'thib', ip: '113.12.55.21', device: 'iPhone', browser: 'Safari', bodyPreview: '{"action": "delete_all"}', sessionId: 's2' },
  { id: 'a6', timestamp: '2024-05-22 14:50:00', risk: RiskLevel.SAFE, method: 'GET', uri: '/api/v1/dashboard/stats', status: 200, username: 'vang', ip: '1.2.3.4', device: 'PC', browser: 'Edge', bodyPreview: '-', sessionId: 's3' },
];

export const INITIAL_LOGS: LogEntry[] = [
  { id: 'l1', timestamp: '2024-05-22 14:30:05', level: LogLevel.INFO, service: 'AuthGateway', threadId: 'auth-w-01', message: 'Tài khoản vana đã xác thực thành công.' }
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
  whitelist: 'user_id',
  retention: { generalDays: 60, securityDays: 730, autoPurge: true, archivingDestination: 'S3' }
};

// --- Added missing INITIAL_ROLES export ---
export const INITIAL_ROLES: RoleDefinition[] = [
  { id: 'r1', name: 'Quản trị viên hệ thống', code: 'ADMIN', description: 'Có quyền quản lý toàn bộ hệ thống, người dùng và cấu hình lưu trữ.', isSystem: true },
  { id: 'r2', name: 'Người dùng cơ bản', code: 'USER', description: 'Truy cập và quản lý tệp tin cá nhân theo hạn mức được cấp.', isSystem: true },
  { id: 'r3', name: 'Quản lý tài nguyên', code: 'RESOURCE_MANAGER', description: 'Quản lý cấu trúc thư mục và định mức lưu trữ của phòng ban.', isSystem: false }
];

export const DEPARTMENTS = ['Kỹ thuật', 'Kinh doanh', 'Marketing', 'Nhân sự', 'Tài chính', 'Ban Giám đốc'];
export const ROLES = [UserRole.ADMIN, UserRole.USER];
export const STATUSES = [UserStatus.ACTIVE, UserStatus.LOCKED, UserStatus.PENDING];
