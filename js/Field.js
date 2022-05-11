const $table = document.querySelectorAll("tr")
const rnd = (left, right) =>
    Math.trunc(Math.random() * (right - left) + left)

export const headColor = 'lawngreen'
export const bodyColor = 'yellow'
export const appleColor = 'red'
export const fieldColor = 'white'

export const field = {
    apple: {},
    rows: $table,
    setApple() {
        let isSet = false
        while (!isSet) {
            const x = rnd(0, this.rowsCount)
            const y = rnd(0, this.columnsCount)
            if (this.rows[x].cells[y].style.backgroundColor === fieldColor) {
                this.apple.x = x
                this.apple.y = y
                this.draw(x, y, appleColor)
                isSet = true
            }
        }
    },
    rowsCount: $table.length,
    columnsCount: $table[0].cells.length,
    draw(x, y, color = fieldColor) {
        this.rows[x].cells[y].style.backgroundColor = color
    }
}