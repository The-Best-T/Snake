const rnd = (left, right) =>
    Math.round(Math.random() * (right - left) + left)

class Node {
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

const game = {
    score: document.querySelector("#Score"),
    queue: {
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
    },
    directionVector: {
        x: 0,
        y: 0
    },
    interval: 0,
    isMove: false,
    isPrepare: false,
    field: {
        rows: document.querySelectorAll("tr"),
        apple() {
            let isSet = false
            while (!isSet) {
                const x = rnd(0, 9)
                const y = rnd(0, 9)
                if (this.rows[x].cells[y].style.backgroundColor === 'black') {
                    this.draw(x, y, 'red')
                    isSet = true
                }
            }
        },
        draw(x, y, color = 'black') {
            this.rows[x].cells[y].style.backgroundColor = color
        }
    },
    reStart() {
        this.score.textContent = '1'
        this.directionVector.x = 1
        this.directionVector.y = 0
        this.isMove = false
        this.queue.clear()
        for (const row of this.field.rows) {
            for (const cell of row.cells) {
                cell.style.backgroundColor = 'black'
            }
        }
        clearInterval(this.interval)
        this.queue.enqueue(new Node(0, 0))
        this.field.draw(0, 0, 'green')
        this.field.apple()
        this.isPrepare = true
    },
    continue() {
        const headPosition = (this.queue.items[this.queue.head]).position
        headPosition[0] += this.directionVector.y
        headPosition[1] += this.directionVector.x

        if (headPosition[0] < 0 || headPosition[0] > 9)
            headPosition[0] = 10 - Math.abs(headPosition[0])
        if (headPosition[1] < 0 || headPosition[1] > 9)
            headPosition[1] = 10 - Math.abs(headPosition[1])

        const headCell = this.field.rows[headPosition[0]].cells[headPosition[1]]
        let isRed = false
        if (headCell.style.backgroundColor === 'red')
            isRed = true
        if (headCell.style.backgroundColor === 'green') {
            this.reStart()
            return
        }
        this.queue.enqueue(new Node(headPosition[0], headPosition[1]))
        this.field.draw(headPosition[0], headPosition[1], 'green')

        if (isRed) {
            this.field.apple()
            const newScore = +this.score.textContent + 1
            this.score.textContent = `${newScore}`
        } else {
            const tailElement = this.queue.decueue()
            this.field.draw(tailElement.position[0], tailElement.position[1])
        }

    }
}

document.addEventListener('keydown', function (event) {
    if (event.code === 'ArrowUp' && game.directionVector.y !== 1) {
        game.directionVector.x = 0
        game.directionVector.y = -1
    }
    if (event.code === 'ArrowRight' && game.directionVector.x !== -1) {
        game.directionVector.x = 1
        game.directionVector.y = 0
    }
    if (event.code === 'ArrowDown' && game.directionVector.y !== -1) {
        game.directionVector.x = 0
        game.directionVector.y = 1
    }
    if (event.code === 'ArrowLeft' && game.directionVector.x !== 1) {
        game.directionVector.x = -1
        game.directionVector.y = 0
    }
    if (event.code === 'Space' && game.isPrepare) {
        if (!game.isMove) {
            game.interval = setInterval(game.continue.bind(game), 300)
            game.isMove = true
        } else {
            game.isMove = false
            clearInterval(game.interval)
        }
    }
    if (event.code === 'Enter') {
        game.reStart()
    }
})
