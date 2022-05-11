import {queue} from './Queue.js'
import Node from './Node.js'
import * as fieldFile from './Field.js'

const $score = document.querySelector("#Score")

const game = {
    score: $score,
    isKeyEnable: true,
    snake: queue,
    directionVector: {},
    interval: 0,
    isMove: false,
    isPrepare: false,
    field: fieldFile.field,
    reStart() {
        this.isKeyEnable = true
        this.score.textContent = '1'
        this.directionVector.x = 1
        this.directionVector.y = 0
        this.isMove = false
        this.snake.clear()
        clearInterval(this.interval)
        this.snake.enqueue(new Node({
            x: 0, y: 0
        }))

        for (const row of this.field.rows) {
            for (const cell of row.cells) {
                cell.style.backgroundColor = fieldFile.fieldColor
            }
        }
        this.field.draw(0, 0, fieldFile.headColor)
        this.field.setApple()
        this.isPrepare = true
    },
    continue() {
        const headPosition = (this.snake.items[this.snake.head]).position
        let newHeadX = headPosition[0] + this.directionVector.y
        let newHeadY = headPosition[1] + this.directionVector.x

        if (newHeadX < 0 || newHeadX >= fieldFile.field.rowsCount)
            newHeadX = fieldFile.field.rowsCount - Math.abs(newHeadX)
        if (newHeadY < 0 || newHeadY >= fieldFile.field.columnsCount)
            newHeadY = fieldFile.field.columnsCount - Math.abs(newHeadY)

        let isApple = false
        if (newHeadX === fieldFile.field.apple.x && newHeadY === fieldFile.field.apple.y) isApple = true
        if (fieldFile.field.rows[newHeadX].cells[newHeadY].style.backgroundColor === fieldFile.bodyColor) {
            this.reStart()
            return
        }

        this.snake.enqueue(new Node({
            x: newHeadX, y: newHeadY
        }))
        this.field.draw(newHeadX, newHeadY, fieldFile.headColor)
        this.field.draw(headPosition[0], headPosition[1], fieldFile.bodyColor)

        if (isApple) {
            this.field.setApple()
            this.score.textContent = `${this.snake.length}`
        } else {
            const tailElement = this.snake.decueue()
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
            game.interval = setInterval(game.continue.bind(game), 200 + game.snake.length * 10)
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