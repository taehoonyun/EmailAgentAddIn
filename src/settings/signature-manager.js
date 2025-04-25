/**
 * Signature Manager Module
 * Handles all signature-related functionality
 */
class SignatureManager {
    constructor() {
        this.signatures = [];
        this.currentEditingIndex = -1;
        this.domElements = {};
        
        // Initialize after DOM is ready
        document.addEventListener('DOMContentLoaded', () => this.initialize());
    }
    
    /**
     * Initialize the signature manager
     */
    initialize() {
        // Get DOM elements
        this.domElements = {
            nameInput: document.getElementById('signatureName'),
            contentInput: document.getElementById('signatureContent'),
            saveButton: document.getElementById('saveSignature'),
            updateButton: document.getElementById('updateSignature'),
            cancelButton: document.getElementById('cancelEdit'),
            list: document.getElementById('signaturesList'),
            noSignaturesMessage: document.getElementById('noSignatures'),
            message: document.getElementById('signatureMessage')
        };
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load signatures
        this.loadSignatures();
    }
    
    /**
     * Set up event listeners for signature management
     */
    setupEventListeners() {
        // Save new signature
        this.domElements.saveButton.addEventListener('click', () => this.saveSignature());
        
        // Update existing signature
        this.domElements.updateButton.addEventListener('click', () => this.updateSignature());
        
        // Cancel editing
        this.domElements.cancelButton.addEventListener('click', () => this.cancelEditing());
    }
    
    /**
     * Load saved signatures from storage
     */
    loadSignatures() {
        window.electronAPI.getStoreValue('signatures')
            .then(savedSignatures => {
                if (savedSignatures && Array.isArray(savedSignatures)) {
                    this.signatures = savedSignatures;
                    this.renderSignaturesList();
                }
            })
            .catch(error => {
                console.error('Error loading signatures:', error);
            });
    }
    
    /**
     * Save signatures to storage
     */
    saveSignaturesToStorage() {
        window.electronAPI.setStoreValue('signatures', this.signatures)
            .catch(error => {
                console.error('Error saving signatures:', error);
                this.showMessage('Error saving signatures to storage.', 'error');
            });
    }
    
    /**
     * Render the list of signatures
     */
    renderSignaturesList() {
        // Clear list
        while (this.domElements.list.firstChild) {
            this.domElements.list.removeChild(this.domElements.list.firstChild);
        }
        
        if (this.signatures.length === 0) {
            this.domElements.list.appendChild(this.domElements.noSignaturesMessage);
            return;
        }
        
        this.signatures.forEach((signature, index) => {
            const signatureItem = document.createElement('div');
            signatureItem.className = 'signature-item';
            signatureItem.style.padding = '10px';
            signatureItem.style.marginBottom = '10px';
            signatureItem.style.borderBottom = '1px solid #eee';
            
            const signatureHeader = document.createElement('div');
            signatureHeader.style.display = 'flex';
            signatureHeader.style.justifyContent = 'space-between';
            signatureHeader.style.alignItems = 'center';
            signatureHeader.style.marginBottom = '5px';
            
            const signatureName = document.createElement('h4');
            signatureName.textContent = signature.name;
            signatureName.style.margin = '0';
            
            const signatureActions = document.createElement('div');
            
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.style.marginRight = '5px';
            editButton.style.padding = '3px 8px';
            editButton.style.fontSize = '12px';
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.style.padding = '3px 8px';
            deleteButton.style.fontSize = '12px';
            deleteButton.style.backgroundColor = '#e81123';
            
            signatureActions.appendChild(editButton);
            signatureActions.appendChild(deleteButton);
            
            signatureHeader.appendChild(signatureName);
            signatureHeader.appendChild(signatureActions);
            
            const signatureContentDiv = document.createElement('div');
            signatureContentDiv.style.whiteSpace = 'pre-line';
            signatureContentDiv.style.color = '#555';
            signatureContentDiv.style.fontSize = '14px';
            signatureContentDiv.textContent = signature.content;
            
            signatureItem.appendChild(signatureHeader);
            signatureItem.appendChild(signatureContentDiv);
            
            this.domElements.list.appendChild(signatureItem);
            
            // Edit button event listener
            editButton.addEventListener('click', () => this.editSignature(index));
            
            // Delete button event listener
            deleteButton.addEventListener('click', () => this.deleteSignature(index));
        });
    }
    
    /**
     * Edit a signature
     * @param {number} index - The index of the signature to edit
     */
    editSignature(index) {
        this.currentEditingIndex = index;
        this.domElements.nameInput.value = this.signatures[index].name;
        this.domElements.contentInput.value = this.signatures[index].content;
        
        this.domElements.saveButton.style.display = 'none';
        this.domElements.updateButton.style.display = 'inline-block';
        this.domElements.cancelButton.style.display = 'inline-block';
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
    
    /**
     * Delete a signature
     * @param {number} index - The index of the signature to delete
     */
    deleteSignature(index) {
        if (confirm(`Are you sure you want to delete the signature "${this.signatures[index].name}"?`)) {
            this.signatures.splice(index, 1);
            this.saveSignaturesToStorage();
            this.renderSignaturesList();
            this.showMessage('Signature deleted successfully.', 'success');
        }
    }
    
    /**
     * Save a new signature
     */
    saveSignature() {
        const name = this.domElements.nameInput.value.trim();
        const content = this.domElements.contentInput.value.trim();
        
        if (!name) {
            this.showMessage('Please enter a signature name.', 'error');
            return;
        }
        
        if (!content) {
            this.showMessage('Please enter signature content.', 'error');
            return;
        }
        
        // Check for duplicate name
        if (this.signatures.some(sig => sig.name === name)) {
            this.showMessage('A signature with this name already exists.', 'error');
            return;
        }
        
        this.signatures.push({ name, content });
        this.saveSignaturesToStorage();
        this.renderSignaturesList();
        
        // Clear inputs
        this.domElements.nameInput.value = '';
        this.domElements.contentInput.value = '';
        
        this.showMessage('Signature saved successfully.', 'success');
    }
    
    /**
     * Update an existing signature
     */
    updateSignature() {
        const name = this.domElements.nameInput.value.trim();
        const content = this.domElements.contentInput.value.trim();
        
        if (!name) {
            this.showMessage('Please enter a signature name.', 'error');
            return;
        }
        
        if (!content) {
            this.showMessage('Please enter signature content.', 'error');
            return;
        }
        
        // Check for duplicate name (excluding current editing signature)
        if (this.signatures.some((sig, index) => sig.name === name && index !== this.currentEditingIndex)) {
            this.showMessage('A signature with this name already exists.', 'error');
            return;
        }
        
        this.signatures[this.currentEditingIndex] = { name, content };
        this.saveSignaturesToStorage();
        this.renderSignaturesList();
        
        // Reset editing state
        this.cancelEditing();
        
        this.showMessage('Signature updated successfully.', 'success');
    }
    
    /**
     * Cancel editing a signature
     */
    cancelEditing() {
        this.currentEditingIndex = -1;
        this.domElements.nameInput.value = '';
        this.domElements.contentInput.value = '';
        
        this.domElements.saveButton.style.display = 'inline-block';
        this.domElements.updateButton.style.display = 'none';
        this.domElements.cancelButton.style.display = 'none';
    }
    
    /**
     * Show a message to the user
     * @param {string} message - The message to show
     * @param {string} type - The type of message ('success', 'error')
     */
    showMessage(message, type) {
        const element = this.domElements.message;
        element.textContent = message;
        element.className = type;
        
        setTimeout(() => {
            element.textContent = '';
            element.className = '';
        }, 3000);
    }
}

// Create and export the signature manager instance
const signatureManager = new SignatureManager();
export default signatureManager; 