import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { useRoleCredentials, usePasswordReveal, useCredentialActions } from './hooks';
import {
  CredentialsHeader,
  CredentialsSummaryCards,
  CredentialsFilters,
  CredentialsTable,
  PasswordRevealConfirmModal,
  UserDetailsDrawer,
  ResetPasswordModal,
  EditUserModal,
} from './components';

export const RoleCredentialsPage: React.FC = () => {
  const {
    isSuperAdmin,
    users,
    stats,
    pagination,
    loading,
    error,
    search,
    setSearch,
    role,
    setRole,
    status,
    setStatus,
    sortBy,
    sort,
    setPage,
    handleSort,
    clearFilters,
    activeFiltersCount,
    refresh,
  } = useRoleCredentials();

  const reveal = usePasswordReveal();
  const actions = useCredentialActions(refresh);

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-200 mt-6 max-w-lg mx-auto shadow-xs">
        <div className="p-3 bg-rose-50 text-rose-600 rounded-full mb-3">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Permission Denied</h2>
        <p className="text-sm text-slate-500 mt-1 max-w-sm">
          Access to Role Credentials is restricted exclusively to authorized Super Admins.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-2 sm:p-6 max-w-7xl mx-auto font-sans">
      <CredentialsHeader />
      <CredentialsSummaryCards stats={stats} loading={loading} />

      <CredentialsFilters
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={setRole}
        status={status}
        onStatusChange={setStatus}
        activeCount={activeFiltersCount}
        onClearAll={clearFilters}
      />

      {error ? (
        <div className="p-5 bg-rose-50 border border-rose-200 rounded-xl text-center text-sm text-rose-700">
          <p className="font-semibold">{error}</p>
          <button onClick={refresh} className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700">
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      ) : (
        <CredentialsTable
          users={users}
          loading={loading}
          pagination={pagination}
          sortBy={sortBy}
          sort={sort}
          onSort={handleSort}
          onPageChange={setPage}
          revealedUserId={reveal.revealedUserId}
          revealedPassword={reveal.revealedPassword}
          secondsRemaining={reveal.secondsRemaining}
          onRequestReveal={reveal.requestReveal}
          onHidePassword={reveal.hidePassword}
          onCopyPassword={reveal.copyPassword}
          onViewDetails={actions.setDrawerUser}
          onEdit={actions.setEditModalUser}
          onResetPassword={actions.setResetModalUser}
          onToggleStatus={actions.handleToggleStatus}
        />
      )}

      {/* Modals & Drawer */}
      <PasswordRevealConfirmModal
        isOpen={Boolean(reveal.confirmModalUser)}
        user={reveal.confirmModalUser}
        loading={reveal.loading}
        onConfirm={reveal.confirmReveal}
        onCancel={reveal.cancelReveal}
      />

      <UserDetailsDrawer
        isOpen={Boolean(actions.drawerUser)}
        user={actions.drawerUser}
        onClose={() => actions.setDrawerUser(null)}
        onResetPassword={(u) => { actions.setDrawerUser(null); actions.setResetModalUser(u); }}
        onToggleStatus={actions.handleToggleStatus}
        actionLoading={actions.actionLoading}
        isRevealed={reveal.revealedUserId === actions.drawerUser?._id}
        revealedPassword={reveal.revealedUserId === actions.drawerUser?._id ? reveal.revealedPassword : null}
        secondsRemaining={reveal.revealedUserId === actions.drawerUser?._id ? reveal.secondsRemaining : 0}
        onRequestReveal={reveal.requestReveal}
        onHidePassword={reveal.hidePassword}
        onCopyPassword={reveal.copyPassword}
      />

      <ResetPasswordModal
        isOpen={Boolean(actions.resetModalUser)}
        user={actions.resetModalUser}
        onClose={() => actions.setResetModalUser(null)}
        onReset={actions.handleResetPassword}
      />

      <EditUserModal
        isOpen={Boolean(actions.editModalUser)}
        user={actions.editModalUser}
        onClose={() => actions.setEditModalUser(null)}
        onSuccess={refresh}
      />
    </div>
  );
};

export default RoleCredentialsPage;
