export class ScrapingError extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = 'ScrapingError';
    }
}
//# sourceMappingURL=types.js.map