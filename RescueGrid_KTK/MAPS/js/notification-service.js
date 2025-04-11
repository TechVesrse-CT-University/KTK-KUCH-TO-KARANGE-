class NotificationService {
    constructor() {
        this.agencyManager = null;
        this.mapController = null;
    }
    
    init(agencyManager, mapController) {
        this.agencyManager = agencyManager;
        this.mapController = mapController;
    }
    
    /**
     * Show local notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, warning)
     */
    showNotification(message, type = 'info') {
        const notificationArea = document.getElementById('notification-area');
        if (!notificationArea) return;
        
        const notification = document.createElement('div');
        notification.className = `notification bg-${this.getTypeColor(type)}-500 text-white p-3 mb-2 rounded-lg shadow-lg flex items-center`;
        
        notification.innerHTML = `
            <div class="mr-2 text-xl">${this.getTypeIcon(type)}</div>
            <div class="flex-grow">${message}</div>
            <button class="ml-2 text-white hover:text-gray-200">&times;</button>
        `;
        
        // Add close button functionality
        const closeBtn = notification.querySelector('button');
        closeBtn.addEventListener('click', () => {
            notification.classList.add('notification-hide');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        notificationArea.appendChild(notification);
        
        // Play notification sound
        playNotificationSound(type === 'error' ? 'error' : 'alert');
        
        // Auto remove after 8 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('notification-hide');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 8000);
    }
    
    /**
     * Get color class based on notification type
     * @param {string} type - Notification type
     * @returns {string} - Color class name
     */
    getTypeColor(type) {
        const colors = {
            'info': 'blue',
            'success': 'green',
            'warning': 'yellow',
            'error': 'red'
        };
        return colors[type] || colors.info;
    }
    
    /**
     * Get icon based on notification type
     * @param {string} type - Notification type
     * @returns {string} - Icon HTML
     */
    getTypeIcon(type) {
        const icons = {
            'info': '📢',
            'success': '✅',
            'warning': '⚠️',
            'error': '❌'
        };
        return icons[type] || icons.info;
    }
}
