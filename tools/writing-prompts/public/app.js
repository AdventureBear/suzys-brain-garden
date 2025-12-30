function promptApp() {
    return {
        prompts: [],
        currentIndex: 0,
        currentPrompt: '',
        content: '',
        folders: [],
        selectedFolder: '',
        newSubfolderName: '',
        wordCount: 0,
        charCount: 0,
        saving: false,
        statusMessage: '',
        statusType: '',
        savedFilePath: '',

        async init() {
            await this.loadPrompts();
            await this.loadFolders();
            this.loadDraft();
            this.currentPrompt = this.prompts[0] || 'Loading...';
        },

        async loadPrompts() {
            try {
                const response = await fetch('/api/prompts');
                this.prompts = await response.json();
            } catch (error) {
                console.error('Error loading prompts:', error);
                this.prompts = ['Error loading prompts'];
            }
        },

        async loadFolders() {
            try {
                const response = await fetch('/api/folders');
                this.folders = await response.json();
            } catch (error) {
                console.error('Error loading folders:', error);
                this.folders = [];
            }
        },

        nextPrompt() {
            this.currentIndex = (this.currentIndex + 1) % this.prompts.length;
            this.currentPrompt = this.prompts[this.currentIndex];
        },

        previousPrompt() {
            this.currentIndex = (this.currentIndex - 1 + this.prompts.length) % this.prompts.length;
            this.currentPrompt = this.prompts[this.currentIndex];
        },

        randomPrompt() {
            const newIndex = Math.floor(Math.random() * this.prompts.length);
            this.currentIndex = newIndex;
            this.currentPrompt = this.prompts[newIndex];
        },

        updateCounts() {
            this.charCount = this.content.length;
            this.wordCount = this.content.trim().split(/\s+/).filter(word => word.length > 0).length;
            this.saveDraft();
        },

        folderChanged() {
            // If creating new subfolder, focus the input
            if (this.selectedFolder === '__new__') {
                setTimeout(() => {
                    const input = document.querySelector('.new-subfolder input');
                    if (input) input.focus();
                }, 100);
            }
        },

        async save() {
            if (!this.content.trim()) {
                this.showStatus('Please write something first!', 'error');
                return;
            }

            this.saving = true;
            this.statusMessage = '';

            try {
                const payload = {
                    content: this.content,
                    folder: 'writing',
                    subfolder: this.selectedFolder === '__new__' ? null : this.selectedFolder,
                    prompt: this.currentPrompt,
                    createNewSubfolder: this.selectedFolder === '__new__',
                    newSubfolderName: this.selectedFolder === '__new__' ? this.newSubfolderName : null
                };

                const response = await fetch('/api/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (result.success) {
                    this.showStatus('✓ Saved successfully!', 'success');
                    this.savedFilePath = result.path;

                    // Reload folders if we created a new one
                    if (this.selectedFolder === '__new__') {
                        await this.loadFolders();
                    }

                    // Clear draft from localStorage
                    this.clearDraft();

                    // Optional: clear the form after a delay
                    setTimeout(() => {
                        if (confirm('File saved! Clear the form for a new prompt?')) {
                            this.clear();
                            this.nextPrompt();
                        }
                    }, 1000);
                } else {
                    this.showStatus('Error: ' + result.error, 'error');
                }
            } catch (error) {
                console.error('Save error:', error);
                this.showStatus('Error saving file: ' + error.message, 'error');
            } finally {
                this.saving = false;
            }
        },

        clear() {
            if (!this.content.trim() || confirm('Clear your writing?')) {
                this.content = '';
                this.selectedFolder = '';
                this.newSubfolderName = '';
                this.wordCount = 0;
                this.charCount = 0;
                this.statusMessage = '';
                this.savedFilePath = '';
                this.clearDraft();
            }
        },

        showStatus(message, type) {
            this.statusMessage = message;
            this.statusType = type;

            if (type === 'success') {
                setTimeout(() => {
                    this.statusMessage = '';
                }, 5000);
            }
        },

        // Auto-save draft to localStorage
        saveDraft() {
            const draft = {
                content: this.content,
                prompt: this.currentPrompt,
                promptIndex: this.currentIndex,
                folder: this.selectedFolder,
                timestamp: Date.now()
            };
            localStorage.setItem('writing-prompt-draft', JSON.stringify(draft));
        },

        loadDraft() {
            const saved = localStorage.getItem('writing-prompt-draft');
            if (saved) {
                try {
                    const draft = JSON.parse(saved);
                    // Only load if less than 7 days old
                    if (Date.now() - draft.timestamp < 7 * 24 * 60 * 60 * 1000) {
                        if (confirm('Found a saved draft. Load it?')) {
                            this.content = draft.content;
                            this.currentPrompt = draft.prompt;
                            this.currentIndex = draft.promptIndex || 0;
                            this.selectedFolder = draft.folder || '';
                            this.updateCounts();
                        }
                    } else {
                        this.clearDraft();
                    }
                } catch (e) {
                    console.error('Error loading draft:', e);
                }
            }
        },

        clearDraft() {
            localStorage.removeItem('writing-prompt-draft');
        }
    };
}
