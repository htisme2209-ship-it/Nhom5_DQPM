export default function Toast({ message, type = 'success', onClose }) {
    if (!message) return null;

    return (
        <div className="toast-container">
            <div className={`toast ${type}`}>
                {type === 'success' ? '✅' : '❌'} {message}
            </div>
        </div>
    );
}
