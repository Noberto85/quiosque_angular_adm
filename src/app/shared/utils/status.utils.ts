export class StatusUtils {
    static getSeverity(status: string) {
        debugger
        switch (status) {
            case 'completed':
            case 'ready':
            case 'delivering':
                return 'success';
            case 'preparing':
            case 'awaiting_preparation':
                return 'info';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'danger';
            default:
                return 'warning';
        }
    }
}