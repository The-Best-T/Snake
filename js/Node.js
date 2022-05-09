export default class Node {
    #X
    #Y

    constructor(options) {
        this.#X = options.x
        this.#Y = options.y
    }

    get position() {
        return [this.#X, this.#Y]
    }
}