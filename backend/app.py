from quart import Quart,websocket
import json

app = Quart(__name__)

ROWS = 5
COLS = 5
initial_data = [{"id":i+1, "column1": "", "column2": "", "column3": "", "column4":"", "column5":""} for i in range(ROWS)]
connected_clients = set()

@app.route('/')
async def hello():
    return 'Hello, Quart!'

@app.websocket('/ws')
async def ws():
    connected_clients.add(websocket._get_current_object())
    try:
        await websocket.send(json.dumps({"type": "INITIAL_DATA", "data": initial_data}))

        while True:
            data = await websocket.receive()
            message = json.loads(data)
            if message["type"] == "UPDATE_CELL":
                row_index = message["rowIndex"]
                col_index = message["colIndex"]
                value = message["value"]
                
                initial_data[row_index][col_index] = value
                await broadcast(json.dumps({"type": "UPDATE_CELL", "rowIndex": row_index, "colIndex": col_index, "value": value}))
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
    finally:
        connected_clients.remove(websocket._get_current_object())

async def broadcast(message):
    # Send a message to all connected clients
    print(message)
    for client in connected_clients:
        await client.send(message)

if __name__ == '__main__':
    app.run(debug=True)