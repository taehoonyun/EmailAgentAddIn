// Office JavaScript API
Office.onReady((info) => {
    if (info.host === Office.HostType.Outlook) {
        // Initialization code
        initializeUI();
        setupEventListeners();
        loadSettings();
        
        // Load email information
        if (Office.context.mailbox.item) {
            loadEmailData();
        }
    }
});

// Import the signature selector module
import './src/taskpane/signature-selector.js';

// Global variables
let apiKey = '';
let emailData = {
    sender: '',
    subject: '',
    body: '',
    date: ''
};

/**
 * Initialize UI
 */
function initializeUI() {
    // Hide loading UI
    document.getElementById('loading').style.display = 'none';
    
    // Add collapsible button event listener
    const collapsibleButton = document.querySelector('.collapsible-button');
    collapsibleButton.addEventListener('click', function() {
        this.classList.toggle('active');
        const content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    });
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // API key save button
    document.getElementById('save-api-key').addEventListener('click', saveApiKey);
    
    // Apply to reply button
    document.getElementById('apply-button').addEventListener('click', applyReply);
    
    // Regenerate button
    document.getElementById('regenerate-button').addEventListener('click', regenerateReply);
}

/**
 * Load settings
 */
function loadSettings() {
    // Load API key from local server
    fetch('https://localhost:3000/api/get-key')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.hasKey) {
                apiKey = '[API key is set]';
                document.getElementById('api-key').value = '[API key is set]';
            }
        })
        .catch(error => {
            console.error('API key loading error:', error);
            showNotification('Cannot connect to local server. Please make sure the Email AI Assistant app is running.', 'error');
        });
    
    // Load tone settings (using roaming settings)
    const savedTone = Office.context.roamingSettings.get('reply_tone');
    if (savedTone) {
        document.getElementById('tone').value = savedTone;
    }
}

/**
 * Save API key
 */
function saveApiKey() {
    const keyInput = document.getElementById('api-key');
    const newApiKey = keyInput.value.trim();
    
    if (!newApiKey || newApiKey === '[API key is set]') {
        showNotification('Please enter your API key. API keys are managed in local app settings.', 'error');
        return;
    }
    
    // Save API key to local server
    fetch('https://localhost:3000/api/save-key', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ apiKey: newApiKey })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            apiKey = '[API key is set]';
            keyInput.value = '[API key is set]';
            showNotification('API key has been saved.', 'success');
            
            // Save tone setting
            const tone = document.getElementById('tone').value;
            Office.context.roamingSettings.set('reply_tone', tone);
            Office.context.roamingSettings.saveAsync();
            
            // If email data is already loaded, retry analysis
            if (emailData.body) {
                analyzeEmail(emailData);
            }
        } else {
            showNotification('Failed to save API key: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('API key save error:', error);
        showNotification('Cannot connect to local server. Please make sure the Email AI Assistant app is running.', 'error');
    });
}

/**
 * Load email data
 */
function loadEmailData() {
    const item = Office.context.mailbox.item;
    
    // Get sender information
    emailData.sender = item.sender.displayName;
    document.getElementById('sender').textContent = emailData.sender;
    
    // Get subject
    emailData.subject = item.subject;
    document.getElementById('subject').textContent = emailData.subject;
    
    // Get date
    emailData.date = new Date(item.dateTimeCreated).toLocaleString();
    document.getElementById('date').textContent = emailData.date;
    
    // Get body
    item.body.getAsync(Office.CoercionType.Text, (result) => {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
            emailData.body = result.value;
            document.getElementById('email-body').textContent = emailData.body;
            
            // Start analysis if API key exists
            if (apiKey) {
                analyzeEmail(emailData);
            } else {
                showNotification('Please set up your API key for analysis.', 'error');
            }
        } else {
            showNotification('Failed to load email content.', 'error');
        }
    });
}

/**
 * Analyze email
 */
async function analyzeEmail(emailData) {
    // Show loading indicator
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('content').style.opacity = '0.5';
    
    try {
        // Request summary and reply generation simultaneously
        const [summaryResponse, replyResponse] = await Promise.all([
            generateSummary(emailData),
            generateReply(emailData)
        ]);
        
        // Display results
        document.getElementById('summary').textContent = summaryResponse;
        document.getElementById('reply').textContent = replyResponse;
        
        // Hide loading indicator
        document.getElementById('loading').style.display = 'none';
        document.getElementById('content').style.opacity = '1';
    } catch (error) {
        console.error('Analysis error:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('content').style.opacity = '1';
        showNotification('An error occurred during email analysis: ' + error.message, 'error');
    }
}

/**
 * Generate email summary through local server
 */
async function generateSummary(emailData) {
    const prompt = `
Please summarize the following email concisely. Include only essential information:

From: ${emailData.sender}
Subject: ${emailData.subject}
Content:
${emailData.body}
`;

    return await callLocalServer(prompt);
}

/**
 * Generate email reply through local server
 */
async function generateReply(emailData) {
    const tone = document.getElementById('tone').value;
    let toneDescription = '';
    
    switch (tone) {
        case 'professional':
            toneDescription = 'professional and respectful';
            break;
        case 'friendly':
            toneDescription = 'friendly and warm';
            break;
        case 'formal':
            toneDescription = 'formal and official';
            break;
        case 'casual':
            toneDescription = 'relaxed and casual';
            break;
    }
    
    const prompt = `
Please write a ${toneDescription} reply to the following email:

From: ${emailData.sender}
Subject: ${emailData.subject}
Content:
${emailData.body}

Start with an appropriate greeting, address the key points in the email, and end with an appropriate closing.
`;

    return await callLocalServer(prompt);
}

/**
 * Regenerate reply
 */
async function regenerateReply() {
    // Show loading indicator
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('content').style.opacity = '0.5';
    
    try {
        const replyResponse = await generateReply(emailData);
        document.getElementById('reply').textContent = replyResponse;
        
        // Hide loading indicator
        document.getElementById('loading').style.display = 'none';
        document.getElementById('content').style.opacity = '1';
        
        showNotification('Reply has been regenerated.', 'success');
    } catch (error) {
        console.error('Regeneration error:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('content').style.opacity = '1';
        showNotification('An error occurred while regenerating the reply: ' + error.message, 'error');
    }
}

/**
 * Call local server API
 */
async function callLocalServer(prompt) {
    try {
        const response = await fetch('https://localhost:3000/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Local server error');
        }
        
        return data.result;
    } catch (error) {
        console.error('Server communication error:', error);
        throw new Error('Failed to connect to local server. Please make sure the Email AI Assistant app is running.');
    }
}

/**
 * Apply generated reply to reply form
 */
function applyReply() {
    const reply = document.getElementById('reply').textContent;
    
    if (!reply) {
        showNotification('No reply to apply.', 'error');
        return;
    }
    
    Office.context.mailbox.item.displayReplyForm(reply);
    showNotification('Reply has been applied.', 'success');
}

/**
 * Show notification
 */
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.className = 'notification';
    }, 3000);
}
