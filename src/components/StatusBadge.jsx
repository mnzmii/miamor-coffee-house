import { LABELS } from '../lib/constants'

const statusConfig = {
    pending: {
        label: LABELS.STATUS_PENDING,
        className: 'badge-pending',
    },
    confirmed: {
        label: LABELS.STATUS_CONFIRMED,
        className: 'badge-confirmed',
    },
    completed: {
        label: LABELS.STATUS_COMPLETED,
        className: 'badge-completed',
    },
    remote: {
        label: LABELS.TYPE_REMOTE,
        className: 'badge-remote',
    },
    qr_walkin: {
        label: LABELS.TYPE_WALKIN,
        className: 'badge-walkin',
    },
}

export default function StatusBadge({ type }) {
    const config = statusConfig[type] || { label: type, className: '' }
    return <span className={`badge ${config.className}`}>{config.label}</span>
}
