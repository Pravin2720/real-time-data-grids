import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import CustomEditComponent from "../components/customEditComponent.jsx";
import useCustomWebSocket from "../hooks/useWebSocket";
import "../styles/home.css";

const socketUrl = "ws://localhost:5000/ws";

const Home = () => {
  const [grid1Data, setGrid1Data] = useState([]);
  const [grid2Data, setGrid2Data] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleWebSocketMessage = (message) => {
    if (message) {
      try {
        if (message.type === "INITIAL_DATA") {
          const initialData = message.data;
          setGrid1Data(initialData);
          setGrid2Data(initialData);
          const firstDataRow = initialData[0] || {};
          const newColumns = Object.keys(firstDataRow).map((field) => ({
            field,
            headerName: field.toUpperCase(),
            editable: field !== "id",
            renderEditCell: (params) => (
              <CustomEditComponent handleCellChange={handleCellChange} {...params} />
            ),
          }));
          setColumns(newColumns);
        } else if (message.type === "UPDATE_CELL") {
          const { rowIndex, colIndex, value } = message;
          const updatedData = grid1Data.map((row) => ({ ...row }));
          updatedData[rowIndex][colIndex] = value;
          setGrid1Data(updatedData);
          setGrid2Data(updatedData); // Reflect the change in the second grid as well
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    }
  };

  const { sendMessage } = useCustomWebSocket(socketUrl, handleWebSocketMessage);

  useEffect(() => {
    sendMessage(JSON.stringify({ type: "REQUEST_INITIAL_DATA" }));
  }, []);

  const handleCellChange = (rowIndex, colIndex, value) => {
    const updateRow = {
      type: "UPDATE_CELL",
      rowIndex,
      colIndex,
      value,
    };
    sendMessage(JSON.stringify(updateRow));
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ height: 371, width: "100%", marginRight: "4px" }}>
        <h2>Data Grid 1</h2>
        <DataGrid
          rows={grid1Data}
          columns={columns}
          showColumnVerticalBorder
          showCellVerticalBorder
        />
      </div>
      <div style={{ height: 371, width: "100%" }}>
        <h2>Data Grid 2</h2>
        <DataGrid
          rows={grid2Data}
          columns={columns}
          showColumnVerticalBorder
          showCellVerticalBorder
        />
      </div>
    </div>
  );
};

export default Home;
