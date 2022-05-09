export default class Node {
    #X
    #Y

    constructor(x = 0, y = 0) {
        this.#X = x
        this.#Y = y
    }

    get position() {
        return [this.#X, this.#Y]
    }
}