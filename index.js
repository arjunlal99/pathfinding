/*
    Color constants
*/
const path_color = "#ff6961"
const endpoints_color = "#005540"
const visited_color = "#00ff8c"

let gridSize = {rows: 30, columns: 30}
const container = document.getElementById('grid-container');

function cellClick(cell){
    //cell.id = "selected-cell"
    console.log(cell.coordinates)
    //BFS(cell.coordinates.x,cell.coordinates.y)
   // getCellByCoordinates(cell.coordinates.x,cell.coordinates.y)
    //getCellByCoordinates(cell.coordinates.x+1, cell.coordinates.y+1).style.backgroundColor = "blue"
    //horizontal(cell.coordinates.x,cell.coordinates.y+1)
    //vertical(cell.coordinates.x+1, cell.coordinates.y)
    graph.wallVertex(cell.coordinates.x,cell.coordinates.y)
    getCellByCoordinates(cell.coordinates.x, cell.coordinates.y).style.backgroundColor = "black"
    return cell.coordinates
}

function getArrayIndexByCoordinates(x,y){
    return ( x * gridSize.columns ) + y
}

function getCellByCoordinates(x,y){
    return grid[ ( x * gridSize.columns ) + y]
}

function changeColor(x,y,color = "red"){
    getCellByCoordinates(x,y).style.backgroundColor = color
}


function makeRows(rows,cols){
    container.style.setProperty('--grid-rows', rows);
    container.style.setProperty('--grid-cols', cols);
    for (row=0; row< rows; row++){
        for (col=0; col< cols; col++ ){
            let cell = document.createElement("div");
            cell.coordinates = {x: row, y: col}
            container.appendChild(cell).className = "grid-item";
            cell.addEventListener("click", () => {
                cellClick(cell)
            })
        };

    };
    return document.getElementsByClassName('grid-item')
};

let grid = makeRows(gridSize.rows,gridSize.columns)
//console.log(grid)
//console.log(grid)
/*
setTimeout(() => {
    console.log(document.getElementsByClassName('grid-item'))
}, 1000)
*/



function horizontal(x,y){
    if (y< gridSize.columns-1){
        setTimeout(() => {
            getCellByCoordinates(x,y+1).style.backgroundColor = "blue"
            getCellByCoordinates(x,y).style.backgroundColor = "red"
            horizontal(x,y+1)
        },1000)
    }

}
function vertical(x,y){
    if (x< gridSize.rows-1){
        setTimeout(() => {
            getCellByCoordinates(x+1,y).style.backgroundColor = "blue"
            getCellByCoordinates(x,y).style.backgroundColor = "red"
            vertical(x+1,y)
        },1000)
    }
}

class ColorQueue{
    constructor(){
        this.queue = []
        this.t = 200
    }

    push(x,y,color){
        this.queue.push({x:x,y:y})
        setTimeout(() => {
            let coordinates = this.pop()
            this.changeColor(coordinates.x,coordinates.y,color)
        },this.t)
        this.t += 50
    }

    pushBack(x,y,color,revert_color){
        this.queue.push({x:x,y:y})
        setTimeout(() => {
            let coordinates = this.pop()
            this.changeColor(coordinates.x,coordinates.y,color)
            setTimeout(() => {
                this.changeColor(coordinates.x,coordinates.y,revert_color)
            },this.t)
        },this.t)
        this.t += 50
    }
    pop(){
        return this.queue.shift()
    }

    changeColor(x,y,color="red"){
        getCellByCoordinates(x,y).style.backgroundColor = color
    }
}

class Graph{
    constructor(rows, columns){
        this.rows = rows
        this.columns = columns
        this.n = rows * columns
        this.adjList = {}
        
        for (var row=0; row<rows; row++){
            for (var col=0; col<columns; col++){
                this.addVertex(row,col)
            }
        }

        for (var row=0; row<rows; row++){
            for (var col=0; col<columns; col++){
                let x1 = row
                let y1 = col

                if (x1 - 1 >= 0 ){
                    /*
                        If upper vertex is available then add that
                    */
                    this.addEdge(x1,y1,x1-1,y1)
                }
                if (x1 + 1 < gridSize.rows){
                    /*
                        If lower vertex is available then add that
                    */
                    this.addEdge(x1,y1,x1+1,y1)
                }
                if (y1 - 1 >= 0){
                    /*
                        If left vertex is available then add that
                    */
                   this.addEdge(x1,y1,x1,y1-1)
                }
                if (y1 + 1 < gridSize.columns){
                    /*
                        If right vertex is available then add that
                    */
                   this.addEdge(x1,y1,x1,y1+1)
                }

            }
        }

        
        //console.log(this.adjList)

    }
    
    addVertex(x,y){
        this.adjList[( x * gridSize.columns ) + y] = []
        //changeColor(x,y)
    }

    addEdge(x1,y1,x2,y2){
        /*
            Add (x2,y2) to adjList of (x1,y1)
        */
        this.adjList[( x1 * gridSize.columns ) + y1].push( ( x2 * gridSize.columns ) + y2)
    }

    removeEdge(x1,y1,x2,y2){
        /*
            Remove (x2,y2) from adjList of (x1,y1)
        */
        let v1 = this.getVertexByCoordinates(x1,y1)
        let v2 = this.getVertexByCoordinates(x2,y2)

        let index = this.adjList[v1].indexOf(v2)
        this.adjList[v1].splice(index,1)
        return {x:x2,y:y2}
    }

    removeEdgeByIndex(v1,v2){
        let index = this.adjList[v1].indexOf(v2)
        this.adjList[v1].splice(index,1)
        return v2
    }

    getNeighbors(x,y){
        /*
            Get neighboring vertices of (x,y)
        */
       return this.adjList[( x * gridSize.columns ) + y]
    }

    getNeighborsByIndex(v){
        return this.adjList[v]
    }

    wallVertex(x,y){
        /*
            Convert a vertex into a wall (Remove all edges to vertex(x,y))
        */
        let neighbors = this.getNeighbors(x,y)
        let index = this.getVertexByCoordinates(x,y)
        for (const v of neighbors){
            this.removeEdgeByIndex(v,index)
        }
    }

    neighborColorChange(x,y){
        this.getNeighbors(x,y).forEach(cell => setTimeout(() => {
            let coordinates = this.getCoordinatesByIndex(cell)
        getCellByCoordinates(coordinates.x,coordinates.y).style.backgroundColor = "black"
        },1000))
    }

    getVertexByCoordinates(x,y){
        return ( x * gridSize.columns ) + y
    }

    getCoordinatesByIndex(index){
        return {x:Math.floor(index/gridSize.columns), y:index%gridSize.columns}
    }

}

let graph = new Graph(gridSize.rows, gridSize.columns)

function BFS(x,y,x2,y2){
    changeColor(x,y,endpoints_color)
    changeColor(x2,y2,endpoints_color)
    let cq = new ColorQueue()
    
    let end = graph.getVertexByCoordinates(x2,y2)
    let queue = []
    let visited = []
    visited.push(graph.getVertexByCoordinates(x,y))
    queue.push(graph.getVertexByCoordinates(x,y))
    let dist = []
    let pred = []
    for (var i=0; i<gridSize.columns * gridSize.rows; i++){
        dist.push(null)
        pred.push(null)
    }
    dist[graph.getVertexByCoordinates(x,y)] = 0
    pred[graph.getVertexByCoordinates(x,y)] = graph.getVertexByCoordinates(x,y)
    while(queue.length != 0){
        let vertex = queue.shift()
        let coordinates = graph.getCoordinatesByIndex(vertex)
        //cq.pushBack(coordinates.x,coordinates.y,"#00ffbf", visited_color)
        for (const n of graph.getNeighbors(coordinates.x, coordinates.y)){
            if (!visited.includes(n)){
                
                if (n == end){
                    pred[n] = vertex
                    dist[n] = vertex + 1
                    //return pred
                    let path = []
                    let i = pred[n]
                    while(i != graph.getVertexByCoordinates(x,y)){
                        path.push(pred[i])
                        let coordinates = graph.getCoordinatesByIndex(i)
                        cq.push(coordinates.x,coordinates.y,path_color)
                        i=pred[i]
                    }
                    return path
                }
                let coordinates = graph.getCoordinatesByIndex(n)
                cq.push(coordinates.x,coordinates.y,visited_color) 
                queue.push(n)
                dist[n] = vertex + 1
                pred[n] = vertex
                visited.push(n)
                //console.log(n)

                
            }
        }
        
        
    }
}