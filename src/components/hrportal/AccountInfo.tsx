import React from 'react';
import { useAuth } from '@/context/auth-context';

const AccountInfo: React.FC = () => {
  const { user, signOutUser, loading } = useAuth();

  if (!user) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, width: '100%', maxWidth: '100%' }}>
      {user.photoURL && (
        <img
          src={user.photoURL}
          alt={user.displayName || user.email || 'User'}
          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid #ccc' }}
        />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.displayName || user.email}</div>
        <div style={{ fontSize: 13, color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
      </div>
      <button
        onClick={signOutUser}
        disabled={loading}
        style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #d32f2f', background: '#fff', color: '#d32f2f', fontWeight: 500, cursor: 'pointer', fontSize: 14, maxWidth: 90, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {loading ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
};

export default AccountInfo; 