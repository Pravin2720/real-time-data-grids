# Real-Time Data Grids

## Setup Instructions

### Backend

1. Install Python dependencies:

```bash
  pip install -r requirements.txt
```

2. Run the backend server:

```bash
python app.py
```

The WebSocket server will be accessible at ws://localhost:5000/ws.

### Frontend

1. Install Node.js dependencies:

```bash
  npm install
```

2. Run the frontend development server:

```bash
npm start
```

The React app will be accessible at http://localhost:5173.

### What could have been done with more time?

With more time, the following improvements could be considered:

1. Enhanced error handling and validation on both frontend and backend.
2. Improved styling and user interface design.
3. Implementing unit tests for both frontend and backend components.
4. Adding user authentication for a more secure application.
5. Highlight the cell that is currently being edited to other users
6. The cell should be updated for other users accessing the sheet only after the current user editing comes out of the cell.
7. Internal cache can be used for data management.

### Where would I refactor?

1. Enhance error handling. More specific error messages or log detailed information can be privided to help in debugging issues during development.
2. Instead of using string literals for WebSocket message types ("INITIAL_DATA," "UPDATE_CELL," "REQUEST_INITIAL_DATA"), enum constants for these types can be defined to ensure consistency and avoid potential typos.
3. Inline styles for the grid containers can be moved into a CSS module or an external stylesheet. This makes the styling more maintainable.

### Would I scrap any parts and take a different approach?

When this application is used in large scale when the number of users are significantly large, the broadcast message can be run on a different server so that the load of the current server is lesser.

### Do parts of my solution feel close to working but just need to be debugged?

The number of renders by the react application is high which can slow down the application and impact its performance. This error needs to be debugged and the number of renders can be brought down.
