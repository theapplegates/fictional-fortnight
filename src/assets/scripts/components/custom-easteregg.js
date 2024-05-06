class customEasteregg extends HTMLElement {
  constructor() {
    super();
    // Initialize with default keywords
    this.keywords = ['eleventy', 'excellent'];
    // Add any custom keyword passed as an attribute
    const customKeyword = this.getAttribute('keyword');
    if (customKeyword) {
      this.keywords.push(customKeyword);
    }
    // Initialize codes and indexes for each keyword
    this.codes = this.keywords.map(keyword => keyword.split(''));
    this.indexes = new Array(this.keywords.length).fill(0);
  }

  connectedCallback() {
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.handleKeydown.bind(this));
  }

  handleKeydown(event) {
    const key = event.key.toLowerCase();
    this.codes.forEach((code, idx) => {
      if (code[this.indexes[idx]] === key) {
        this.indexes[idx]++;
        if (this.indexes[idx] === code.length) {
          this.triggerEffect(this.keywords[idx]);
          this.indexes[idx] = 0; // Reset index after triggering
        }
      } else {
        this.indexes[idx] = 0; // Reset index if sequence breaks
      }
    });
  }

  triggerEffect(keyword) {
    console.log(`Hooray ${keyword}!`);
    import('https://esm.run/canvas-confetti').then(({default: confetti}) => {
      const scalar = 4;
      const particleCount = 30;
      const star = confetti.shapeFromText({text: '⭐️', scalar});

      confetti({
        shapes: [star],
        scalar,
        particleCount
      });
    });
  }
}

customElements.define('custom-easteregg', customEasteregg);
