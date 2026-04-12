export default function PlaceholderPage({ title, description }) {
  return (
    <div style={{ padding: '60px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--navy-800)', marginBottom: '8px' }}>
        {title || 'Trang đang phát triển'}
      </h1>
      <p style={{ color: 'var(--gray-500)', fontSize: '14px' }}>
        {description || 'Chức năng này đang được xây dựng. Vui lòng quay lại sau.'}
      </p>
    </div>
  );
}
