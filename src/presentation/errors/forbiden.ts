export class ForbidenError extends Error {
    constructor() {
        super('Forbiden Error');
        this.name = 'ForbidenError'
    }
}