import { useState } from 'react';
import { taiKhoanAPI } from '../services/api';
import { DEFAULT_ACCOUNT_FORM } from '../constants/accountConstants';

export default function useAccountForm(onSuccess, onError) {
    const [form, setForm] = useState(DEFAULT_ACCOUNT_FORM);
    const [editItem, setEditItem] = useState(null);
    const [loading, setLoading] = useState(false);

    const openCreate = () => {
        setEditItem(null);
        setForm({
            ...DEFAULT_ACCOUNT_FORM,
            maTaiKhoan: 'TK' + Date.now().toString().slice(-6)
        });
    };

    const openEdit = (account) => {
        setEditItem(account);
        setForm({
            maTaiKhoan: account.maTaiKhoan,
            hoTen: account.hoTen,
            email: account.email,
            matKhau: '',
            quyenTruyCap: account.quyenTruyCap,
            soDienThoai: account.soDienThoai || '',
            gioiTinh: account.gioiTinh || 'NAM',
            trangThai: account.trangThai
        });
    };

    const handleSave = async () => {
        if (!form.hoTen || !form.email) {
            onError?.('Vui lòng nhập đầy đủ Họ tên và Email');
            return;
        }

        setLoading(true);
        try {
            const payload = { ...form };
            if (!payload.matKhau) delete payload.matKhau;

            if (editItem) {
                await taiKhoanAPI.update(editItem.maTaiKhoan, payload);
                onSuccess?.('Cập nhật tài khoản thành công!');
            } else {
                await taiKhoanAPI.create(payload);
                onSuccess?.('Tạo tài khoản mới thành công!');
            }
        } catch (e) {
            onError?.(e.response?.data?.message || 'Lỗi khi lưu tài khoản');
            throw e;
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        setForm,
        editItem,
        loading,
        openCreate,
        openEdit,
        handleSave
    };
}
