from quart import Quart
from routes import initialize_routes
from handlers import WebSocketHandler

app = Quart(__name__)

ROWS = 5
COLS = 5
initial_data = [{"id":i+1, "column1": "", "column2": "", "column3": "", "column4":"", "column5":""} for i in range(ROWS)]
connected_clients = set()

# Initialize WebSocketHandler instance once
websocket_handler = WebSocketHandler(initial_data, connected_clients)

initialize_routes(app, websocket_handler)

if __name__ == '__main__':
    app.run(debug=True)
