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

const headColor = 'lawngreen'
const bodyColor = 'yellow'
const appleColor = 'red'
const fieldColor = 'white'

const game = {
    score: document.querySelector("#Score"),
    isKeyEnable: true,
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
                if (this.rows[x].cells[y].style.backgroundColor === fieldColor) {
                    this.draw(x, y, appleColor)
                    isSet = true
                }
            }
        },
        draw(x, y, color = fieldColor) {
            this.rows[x].cells[y].style.backgroundColor = color
        }
    },
    reStart() {
        this.isKeyEnable = true
        this.score.textContent = '1'
        this.directionVector.x = 1
        this.directionVector.y = 0
        this.isMove = false
        this.queue.clear()
        for (const row of this.field.rows) {
            for (const cell of row.cells) {
                cell.style.backgroundColor = fieldColor
            }
        }
        clearInterval(this.interval)
        this.queue.enqueue(new Node(0, 0))
        this.field.draw(0, 0, headColor)
        this.field.apple()
        this.isPrepare = true
    },
    continue() {
        const headPosition = (this.queue.items[this.queue.head]).position
        let newHeadX = headPosition[0] + this.directionVector.y
        let newHeadY = headPosition[1] + this.directionVector.x

        if (newHeadX < 0 || newHeadX > 9)
            newHeadX = 10 - Math.abs(newHeadX)
        if (newHeadY < 0 || newHeadY > 9)
            newHeadY = 10 - Math.abs(newHeadY)

        const headCell = this.field.rows[newHeadX].cells[newHeadY]
        let isRed = false
        if (headCell.style.backgroundColor === appleColor)
            isRed = true
        if (headCell.style.backgroundColor === bodyColor) {
            this.reStart()
            return
        }
        this.queue.enqueue(new Node(newHeadX, newHeadY))
        this.field.draw(newHeadX, newHeadY, headColor)
        this.field.draw(headPosition[0], headPosition[1], bodyColor)

        if (isRed) {
            this.field.apple()
            const newScore = +this.score.textContent + 1
            this.score.textContent = `${newScore}`
        } else {
            const tailElement = this.queue.decueue()
            this.field.draw(tailElement.position[0], tailElement.position[1])
        }
        this.isKeyEnable = true
    }
}

document.addEventListener('keydown', function (event) {
    if (event.code === 'ArrowUp' && game.directionVector.y !== 1 && game.isKeyEnable) {
        game.directionVector.x = 0
        game.directionVector.y = -1
        game.isKeyEnable = false
    }
    if (event.code === 'ArrowRight' && game.directionVector.x !== -1 && game.isKeyEnable) {
        game.directionVector.x = 1
        game.directionVector.y = 0
        game.isKeyEnable = false
    }
    if (event.code === 'ArrowDown' && game.directionVector.y !== -1 && game.isKeyEnable) {
        game.directionVector.x = 0
        game.directionVector.y = 1
        game.isKeyEnable = false
    }
    if (event.code === 'ArrowLeft' && game.directionVector.x !== 1 && game.isKeyEnable) {
        game.directionVector.x = -1
        game.directionVector.y = 0
        game.isKeyEnable = false
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
