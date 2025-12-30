function promptApp() {
    return {
        prompts: [],
        filteredPrompts: [],
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
        searchQuery: '',
        viewMode: 'split', // 'edit', 'split', 'preview'
        previewHtml: '',
        showMarkdownRef: false,
        usedPrompts: {}, // {prompt: [{date, filepath}]}
        favorites: [], // array of prompt strings

        async init() {
            await this.loadPrompts();
            await this.loadFolders();
            this.loadUsageData();
            this.loadDraft();
            this.filteredPrompts = [...this.prompts];
            this.currentPrompt = this.filteredPrompts[0] || 'Loading...';
            this.updatePreview();
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

        // Search & Filter
        filterPrompts() {
            const query = this.searchQuery.toLowerCase().trim();
            if (!query) {
                this.filteredPrompts = [...this.prompts];
            } else {
                this.filteredPrompts = this.prompts.filter(prompt =>
                    prompt.toLowerCase().includes(query)
                );
            }

            // Reset to first filtered prompt
            if (this.filteredPrompts.length > 0) {
                this.currentIndex = 0;
                this.currentPrompt = this.filteredPrompts[0];
            } else {
                this.currentPrompt = 'No prompts match your search';
            }
        },

        clearSearch() {
            this.searchQuery = '';
            this.filterPrompts();
        },

        // Prompt Navigation
        nextPrompt() {
            if (this.filteredPrompts.length === 0) return;
            this.currentIndex = (this.currentIndex + 1) % this.filteredPrompts.length;
            this.currentPrompt = this.filteredPrompts[this.currentIndex];
        },

        previousPrompt() {
            if (this.filteredPrompts.length === 0) return;
            this.currentIndex = (this.currentIndex - 1 + this.filteredPrompts.length) % this.filteredPrompts.length;
            this.currentPrompt = this.filteredPrompts[this.currentIndex];
        },

        randomPrompt() {
            if (this.filteredPrompts.length === 0) return;

            // Try to avoid recently used prompts if possible
            const unused = this.filteredPrompts.filter(p => !this.usedPrompts[p] || this.usedPrompts[p].length === 0);
            const pool = unused.length > 0 ? unused : this.filteredPrompts;

            const newIndex = Math.floor(Math.random() * pool.length);
            const selectedPrompt = pool[newIndex];

            // Find index in filtered prompts
            this.currentIndex = this.filteredPrompts.indexOf(selectedPrompt);
            this.currentPrompt = selectedPrompt;
        },

        getPromptCounter() {
            if (this.filteredPrompts.length === 0) return '0 of 0';
            return `${this.currentIndex + 1} of ${this.filteredPrompts.length}`;
        },

        // Markdown Preview
        updatePreview() {
            if (typeof marked !== 'undefined') {
                this.previewHtml = marked.parse(this.content || '*Preview will appear here...*');
            } else {
                this.previewHtml = '<p>Loading preview...</p>';
            }
        },

        // Word/Character Count
        updateCounts() {
            this.charCount = this.content.length;
            this.wordCount = this.content.trim().split(/\s+/).filter(word => word.length > 0).length;
            this.saveDraft();
        },

        // Usage Tracking
        loadUsageData() {
            try {
                const data = localStorage.getItem('prompt-usage-data');
                if (data) {
                    const parsed = JSON.parse(data);
                    this.usedPrompts = parsed.used || {};
                    this.favorites = parsed.favorites || [];
                }
            } catch (e) {
                console.error('Error loading usage data:', e);
                this.usedPrompts = {};
                this.favorites = [];
            }
        },

        saveUsageData() {
            const data = {
                used: this.usedPrompts,
                favorites: this.favorites,
                lastUpdated: Date.now()
            };
            localStorage.setItem('prompt-usage-data', JSON.stringify(data));
        },

        recordUsage(prompt, filepath) {
            if (!this.usedPrompts[prompt]) {
                this.usedPrompts[prompt] = [];
            }
            this.usedPrompts[prompt].push({
                date: new Date().toISOString(),
                filepath: filepath
            });
            this.saveUsageData();
        },

        getUsageCount(prompt) {
            return this.usedPrompts[prompt] ? this.usedPrompts[prompt].length : 0;
        },

        toggleFavorite(prompt) {
            const index = this.favorites.indexOf(prompt);
            if (index > -1) {
                this.favorites.splice(index, 1);
                this.showStatus('Removed from favorites', 'success');
            } else {
                this.favorites.push(prompt);
                this.showStatus('Added to favorites ⭐', 'success');
            }
            this.saveUsageData();
        },

        isFavorite(prompt) {
            return this.favorites.includes(prompt);
        },

        // Folder Management
        folderChanged() {
            if (this.selectedFolder === '__new__') {
                setTimeout(() => {
                    const input = document.querySelector('.new-subfolder input');
                    if (input) input.focus();
                }, 100);
            }
        },

        // Save
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

                    // Record usage
                    this.recordUsage(this.currentPrompt, result.path);

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
                            this.randomPrompt(); // Get a new unused prompt
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
                this.previewHtml = '';
                this.clearDraft();
                this.updatePreview();
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
                viewMode: this.viewMode,
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
                            this.viewMode = draft.viewMode || 'split';
                            this.updateCounts();
                            this.updatePreview();
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
