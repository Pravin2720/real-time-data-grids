from quart import websocket
from handlers import WebSocketHandler

def initialize_routes(app, websocket_handler):
    @app.route('/')
    async def hello():
        return 'Hello, Quart!'

    @app.websocket('/ws')
    async def ws():
        # Add new clients to the existing WebSocketHandler instance
        websocket_handler.add_client(websocket._get_current_object())
        await websocket_handler.handle_websocket()
