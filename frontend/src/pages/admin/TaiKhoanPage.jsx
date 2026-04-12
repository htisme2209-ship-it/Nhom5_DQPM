import { useState, useMemo } from 'react';
import useAccounts from '../../hooks/useAccounts';
import useAccountForm from '../../hooks/useAccountForm';
import useToast from '../../hooks/useToast';
import AccountStatsCards from '../../components/account/AccountStatsCards';
import AccountFilterBar from '../../components/account/AccountFilterBar';
import AccountTable from '../../components/account/AccountTable';
import AccountFormModal from '../../components/account/AccountFormModal';
import Toast from '../../components/common/Toast';

export default function TaiKhoanPage() {
  const { accounts, loading, reload } = useAccounts();
  const { toast, showSuccess, showError } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [filterRole, setFilterRole] = useState('');

  const {
    form,
    setForm,
    editItem,
    loading: formLoading,
    openCreate,
    openEdit,
    handleSave
  } = useAccountForm(
    (msg) => {
      showSuccess(msg);
      setShowForm(false);
      reload();
    },
    (msg) => showError(msg)
  );

  const handleOpenCreate = () => {
    openCreate();
    setShowForm(true);
  };

  const handleOpenEdit = (account) => {
    openEdit(account);
    setShowForm(true);
  };

  const filteredAccounts = useMemo(() => {
    return filterRole
      ? accounts.filter(a => a.quyenTruyCap === filterRole)
      : accounts;
  }, [accounts, filterRole]);

  return (
    <>
      <Toast message={toast?.message} type={toast?.type} />

      <div className="page-header">
        <div className="page-header-actions">
          <div>
            <h1>Quản lý Tài khoản Nhân sự</h1>
            <p>Cấu hình quyền truy cập, quản lý trạng thái tài khoản</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            👤 Tạo tài khoản mới
          </button>
        </div>
      </div>

      <AccountStatsCards accounts={accounts} />

      <AccountFilterBar
        filterRole={filterRole}
        onFilterChange={setFilterRole}
        onRefresh={reload}
      />

      <AccountTable
        accounts={filteredAccounts}
        loading={loading}
        onEdit={handleOpenEdit}
      />

      <AccountFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        form={form}
        onChange={setForm}
        onSave={handleSave}
        isEdit={!!editItem}
        loading={formLoading}
      />
    </>
  );
}
