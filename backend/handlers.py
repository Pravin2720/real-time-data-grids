import json
from quart import websocket
from models import CellUpdateSchema, InitialDataSchema

class WebSocketHandler:
    def __init__(self, initial_data, connected_clients):
        self.initial_data = initial_data
        self.connected_clients = connected_clients
        self.cell_update_schema = CellUpdateSchema()
        self.initial_data_schema = InitialDataSchema()

    def add_client(self, client):
        self.connected_clients.add(client)

    async def handle_websocket(self):
        try:
            initial_data_payload = {"type": "INITIAL_DATA", "data": self.initial_data}
            await websocket.send(json.dumps(self.initial_data_schema.dump(initial_data_payload)))

            while True:
                data = await websocket.receive()
                message = json.loads(data)
                if message["type"] == "UPDATE_CELL":
                    update_data = self.cell_update_schema.load(message)
                    row_index = update_data["rowIndex"]
                    col_index = update_data["colIndex"]
                    value = update_data["value"]

                    self.initial_data[row_index][col_index] = value
                    await self.broadcast_message(
                        self.cell_update_schema.dumps(
                            {"type": "UPDATE_CELL", "rowIndex": row_index, "colIndex": col_index, "value": value}
                        )
                    )
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
        except ValueError as e:
            print(f"Error handling WebSocket message: {e}")
        except Exception as e:
            print(f"Unexpected error: {e}")

    async def broadcast_message(self, message):
        for client in self.connected_clients:
            await client.send(message)
