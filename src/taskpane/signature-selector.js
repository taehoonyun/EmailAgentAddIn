/**
 * Signature Selector Module
 * Handles signature selection and application in emails
 */
class SignatureSelector {
    constructor() {
        this.signatures = [];
        this.dropdownElement = null;
        this.replyElement = null;
        
        // Initialize after Office is ready
        Office.onReady(() => {
            if (Office.context.mailbox) {
                this.initialize();
            }
        });
    }
    
    /**
     * Initialize the signature selector
     */
    initialize() {
        // Get DOM elements
        this.dropdownElement = document.getElementById('signature');
        this.replyElement = document.getElementById('reply');
        
        if (!this.dropdownElement || !this.replyElement) {
            console.error('Required DOM elements not found for signature selector');
            return;
        }
        
        // Set up event listener
        this.dropdownElement.addEventListener('change', () => this.updateReplyWithSignature());
        
        // Load signatures
        this.loadSignatures();
    }
    
    /**
     * Load signatures from storage
     */
    loadSignatures() {
        fetch('https://localhost:3000/api/get-store-value?key=signatures')
            .then(response => response.json())
            .then(data => {
                if (data.success && data.value && Array.isArray(data.value)) {
                    this.signatures = data.value;
                    this.populateSignatureDropdown();
                }
            })
            .catch(error => {
                console.error('Error loading signatures:', error);
            });
    }
    
    /**
     * Populate signature dropdown with available signatures
     */
    populateSignatureDropdown() {
        // Clear existing options except the first one (None)
        while (this.dropdownElement.options.length > 1) {
            this.dropdownElement.remove(1);
        }
        
        // Add signatures to dropdown
        this.signatures.forEach(signature => {
            const option = document.createElement('option');
            option.value = signature.name;
            option.textContent = signature.name;
            this.dropdownElement.appendChild(option);
        });
    }
    
    /**
     * Update reply with selected signature
     */
    updateReplyWithSignature() {
        const selectedSignatureName = this.dropdownElement.value;
        
        // Get current reply content without signature
        let replyContent = this.replyElement.textContent;
        
        // Remove previous signature if exists
        const signatureIndex = replyContent.indexOf('\n-- \n');
        if (signatureIndex !== -1) {
            replyContent = replyContent.substring(0, signatureIndex);
        }
        
        // Add selected signature if not "None"
        if (selectedSignatureName) {
            const selectedSignature = this.signatures.find(sig => sig.name === selectedSignatureName);
            if (selectedSignature) {
                replyContent += '\n\n-- \n' + selectedSignature.content;
            }
        }
        
        this.replyElement.textContent = replyContent;
    }
}

// Create and export signature selector instance
const signatureSelector = new SignatureSelector();
export default signatureSelector; 