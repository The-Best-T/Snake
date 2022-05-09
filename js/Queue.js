export const queue = {
    items: [],
    head: 0,
    length: 0,
    enqueue(elemet) {
        this.length++;
        this.items.unshift(elemet)
    },
    decueue() {
        if (this.length < 1)
            return undefined
        this.length--
        return this.items.pop()
    },
    clear() {
        this.items = []
        this.length = 0
    }
}