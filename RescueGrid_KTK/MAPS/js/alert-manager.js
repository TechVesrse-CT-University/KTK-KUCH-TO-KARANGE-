class AlertManager {
    constructor() {
        this.alerts = {};
        this.teams = {
            'fireteam 1': { id: 'fireteam1', type: 'fire', status: 'available' },
            'fireteam 2': { id: 'fireteam2', type: 'fire', status: 'available' },
            'medic 1': { id: 'medic1', type: 'medical', status: 'available' },
            'floodteam 1': { id: 'floodteam1', type: 'flood', status: 'available' }
        };
        this.nextAlertId = 1;
        this.userStatus = 'available';
    }

    createAlert(location, type, details = '') {
        const alertId = `alert-${this.nextAlertId++}`;
        this.alerts[alertId] = {
            id: alertId,
            location,
            type,
            details,
            created: new Date(),
            status: 'active',
            assignedTeam: null
        };
        return alertId;
    }

    assignTeamToAlert(teamId, alertId) {
        const team = this.getTeam(teamId);
        if (!team) {
            return { success: false, message: 'Team not found' };
        }

        if (!this.alerts[alertId]) {
            return { success: false, message: 'Alert not found' };
        }

        if (team.status !== 'available') {
            return { success: false, message: 'Team is not available' };
        }

        // Assign team
        this.alerts[alertId].assignedTeam = team.id;
        this.alerts[alertId].status = 'assigned';
        team.status = 'busy';

        return { 
            success: true, 
            message: `${teamId} assigned to alert ${alertId}`,
            team,
            alert: this.alerts[alertId]
        };
    }

    getTeam(teamId) {
        const teamIdLower = teamId.toLowerCase();
        return this.teams[teamIdLower];
    }

    setUserStatus(status) {
        const validStatuses = ['available', 'busy', 'offline'];
        if (validStatuses.includes(status.toLowerCase())) {
            this.userStatus = status.toLowerCase();
            return { success: true, message: `Status updated to: ${this.userStatus}` };
        }
        return { success: false, message: 'Invalid status. Use: available, busy, or offline' };
    }

    getActiveAlerts() {
        return Object.values(this.alerts).filter(alert => alert.status === 'active');
    }

    getAlertsInLocation(location) {
        return Object.values(this.alerts).filter(alert => 
            alert.location.toLowerCase() === location.toLowerCase()
        );
    }
}
