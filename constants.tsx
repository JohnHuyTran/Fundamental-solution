
import { User, UserRole, UserStatus, RiskLevel, AuditLog, UserSession, UserGroup, RoleDefinition, StorageQuota } from './types';

export const DEPARTMENTS = ['Kỹ thuật', 'Kinh doanh', 'Marketing', 'Tài chính', 'Nhân sự'];
export const ROLES = [UserRole.ADMIN, UserRole.USER];
export const STATUSES = [UserStatus.ACTIVE, UserStatus.LOCKED, UserStatus.PENDING];

export const SAMPLE_USERS: User[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `u-${i + 1}`,
  username: `user_${i + 1}`,
  fullName: [
    'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Văn Cường', 'Hoàng Minh Đức', 
    'Phạm Thị Hoa', 'Vũ Văn Hùng', 'Đặng Thu Thảo', 'Bùi Anh Tuấn',
    'Lý Gia Thành', 'Trương Vĩnh Ký', 'Phan Bội Châu', 'Ngô Quyền'
  ][i % 12] + (i > 11 ? ` (${i})` : ''),
  email: `user${i + 1}@omnicore.pro`,
  phone: `0901234${i.toString().padStart(3, '0')}`,
  role: i === 0 ? UserRole.ADMIN : UserRole.USER,
  department: DEPARTMENTS[i % 5],
  status: i % 7 === 0 ? UserStatus.LOCKED : i % 10 === 0 ? UserStatus.PENDING : UserStatus.ACTIVE,
  createdAt: '2023-01-15',
  lastLogin: '2024-05-22'
}));

// Export alias used by components
export const INITIAL_USERS = SAMPLE_USERS;

export const SAMPLE_GROUPS: UserGroup[] = [
  {
    id: 'g-1',
    key: 'g-1',
    name: 'OmniCore Corporation',
    title: 'OmniCore Corporation',
    description: 'Trụ sở chính',
    memberCount: 250,
    children: [
      {
        id: 'g-2',
        key: 'g-2',
        name: 'Khối Kỹ Thuật (R&D)',
        title: 'Khối Kỹ Thuật (R&D)',
        description: 'Phát triển sản phẩm lõi',
        memberCount: 85,
        children: [
          { id: 'g-3', key: 'g-3', name: 'Backend Team', title: 'Backend Team', description: 'NodeJS & Go', memberCount: 30 },
          { id: 'g-4', key: 'g-4', name: 'Security Ops', title: 'Security Ops', description: 'Cybersecurity', memberCount: 15 }
        ]
      },
      {
        id: 'g-5',
        key: 'g-5',
        name: 'Khối Kinh Doanh',
        title: 'Khối Kinh Doanh',
        description: 'Sales & Marketing',
        memberCount: 120
      }
    ]
  }
];

export const SAMPLE_LOGS: AuditLog[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `log-${i}`,
  timestamp: '2024-05-22 14:30:' + (i % 60).toString().padStart(2, '0'),
  risk: [RiskLevel.SAFE, RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH, RiskLevel.CRITICAL][i % 5],
  method: ['GET', 'POST', 'DELETE', 'PUT'][i % 4],
  uri: ['/api/v1/users', '/api/v1/auth/login', '/api/v1/files/upload', '/api/admin/config'][i % 4],
  status: [200, 401, 403, 404, 500][i % 5],
  username: SAMPLE_USERS[i % 10].username,
  ip: `192.168.1.${100 + i}`,
  device: ['MacBook Pro', 'iPhone 15', 'Windows Desktop', 'Linux Server'][i % 4],
  browser: ['Chrome', 'Safari', 'Firefox', 'Edge'][i % 4],
  payload: i % 2 === 0 ? '{"action": "update_profile"}' : '-'
}));

export const SAMPLE_SESSIONS: UserSession[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `sess-${i}`,
  username: SAMPLE_USERS[i].username,
  userName: SAMPLE_USERS[i].username,
  ip: `172.16.0.${i + 5}`,
  ipAddress: `172.16.0.${i + 5}`,
  device: 'Workstation-' + i,
  browser: 'Chrome',
  loginTime: '2024-05-22 08:00',
  lastActive: i === 0 ? 'Vừa xong' : i + ' phút trước',
  status: 'Active' as any
}));

export const INITIAL_ROLES: RoleDefinition[] = [
  { id: '1', name: 'Administrator', code: 'ADMIN', description: 'Full system access', isSystem: true },
  { id: '2', name: 'Standard User', code: 'USER', description: 'Basic operational access', isSystem: true }
];

export const INITIAL_QUOTAS: StorageQuota[] = [
  { id: 'q1', type: 'User', targetName: 'Nguyễn Văn An', used: 12, limit: 20 },
  { id: 'q2', type: 'User', targetName: 'Trần Thị Bình', used: 18, limit: 20 },
  { id: 'q3', type: 'Group', targetName: 'Khối Kỹ Thuật', used: 450, limit: 1000 }
];
