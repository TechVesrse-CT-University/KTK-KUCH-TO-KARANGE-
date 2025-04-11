class PythonVoiceRecognition {
    constructor() {
        this.serverUrl = 'http://localhost:5000';
        this.isListening = false;
        this.isProcessing = false;
        this.statusElement = document.getElementById('server-status');
        this.checkServerStatus();
        
        // Set up event listeners
        document.getElementById('voice-indicator').addEventListener('click', () => {
            this.toggleListening();
        });
    }
    
    checkServerStatus() {
        fetch(`${this.serverUrl}/status`)
            .then(response => response.json())
            .then(data => {
                this.statusElement.textContent = 'Online';
                this.statusElement.className = 'server-online';
            })
            .catch(error => {
                this.statusElement.textContent = 'Offline';
                this.statusElement.className = 'server-offline';
                console.error('Python server is not running:', error);
                setTimeout(() => this.checkServerStatus(), 5000); // Retry after 5 seconds
            });
    }
    
    toggleListening() {
        if (this.isProcessing) return;
        
        if (!this.isListening) {
            this.startListening();
        } else {
            this.updateStatus('Click microphone to activate');
            this.isListening = false;
            document.getElementById('voice-indicator').classList.remove('listening');
        }
    }
    
    startListening() {
        if (this.statusElement.textContent !== 'Online') {
            this.logCommand('Python server is offline. Please start the server.');
            return;
        }
        
        this.isProcessing = true;
        this.isListening = true;
        this.updateStatus('How can I help you?');
        document.getElementById('voice-indicator').classList.add('listening');
        
        fetch(`${this.serverUrl}/listen`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response from server:', data);
            this.handleServerResponse(data);
        })
        .catch(error => {
            console.error('Error communicating with Python server:', error);
            this.logCommand('Error: Could not connect to Python server');
            this.updateStatus('Server error. Try again.');
        })
        .finally(() => {
            this.isProcessing = false;
            document.getElementById('voice-indicator').classList.remove('listening');
        });
    }
    
    handleServerResponse(data) {
        // Log the command
        if (data.message) {
            this.logCommand(data.message);
        }
        
        // Update status
        this.updateStatus(data.status === 'listening' ? 'How can I help you?' : 'Click microphone to activate');
        
        // Process the response
        if (data.status === 'success') {
            if (data.command === 'add_disaster') {
                // Dispatch event for adding disaster marker
                const event = new CustomEvent('addDisasterMarker', { 
                    detail: data.data
                });
                document.dispatchEvent(event);
            }
        }
    }
    
    updateStatus(message) {
        document.getElementById('status-text').textContent = message;
    }
    
    logCommand(message) {
        const logElement = document.getElementById('command-log');
        const entry = document.createElement('div');
        entry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
        logElement.appendChild(entry);
        
        // Scroll to bottom
        logElement.scrollTop = logElement.scrollHeight;
        
        // Limit log entries
        while (logElement.children.length > 10) {
            logElement.removeChild(logElement.firstChild);
        }
    }
}
