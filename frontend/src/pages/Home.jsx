import React, { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import "../styles/home.css";
import { DataGrid } from "@mui/x-data-grid";
import { useGridApiContext } from "@mui/x-data-grid";

const Home = () => {
  const [gridData, setGridData] = useState([]);

  const socketUrl = "ws://localhost:5000/ws";
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    // Send a request for initial data when the component mounts
    sendMessage(JSON.stringify({ type: "REQUEST_INITIAL_DATA" }));
  }, []);

  useEffect(() => {
    if (lastMessage && lastMessage.data) {
      try {
        const message = JSON.parse(lastMessage.data);
        if (message.type === "INITIAL_DATA") {
          setGridData(message.data);
        } else if (message.type === "UPDATE_CELL") {
          const { rowIndex, colIndex, value } = message;
          const updatedData = [...gridData];
          updatedData[rowIndex][colIndex] = value;
          setGridData(updatedData);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    }
  }, [lastMessage]);

  const handleCellChange = (rowIndex, colIndex, value) => {
    const updateRow = {
      type: "UPDATE_CELL",
      rowIndex,
      colIndex,
      value,
    };
    sendMessage(JSON.stringify(updateRow));
  };

  const CustomEditComponent = (props) => {
    const { id, value, field, hasFocus } = props;
    const apiRef = useGridApiContext();
    const ref = React.useRef();

    React.useLayoutEffect(() => {
      if (hasFocus) {
        ref.current.focus();
      }
    }, [hasFocus]);

    const handleValueChange = (event) => {
      const newValue = event.target.value;
      const { id: rowIndex, colDef } = apiRef.current.getCellParams(id, field);
      handleCellChange(rowIndex - 1, colDef.field, newValue);
      // const newValue = event.target.value; // The new value entered by the user
      apiRef.current.setEditCellValue({ id, field, value: newValue });
    };

    return <input ref={ref} type="text" value={value} onChange={handleValueChange} />;
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      editable: true,
    },
    {
      field: "column1",
      headerName: "Column 1",
      editable: true,
      renderEditCell: (params) => <CustomEditComponent {...params} />,
    },
    {
      field: "column2",
      headerName: "Column 2",
      editable: true,
      renderEditCell: (params) => <CustomEditComponent {...params} />,
    },
    {
      field: "column3",
      headerName: "Column 3",
      editable: true,
      renderEditCell: (params) => <CustomEditComponent {...params} />,
    },
    {
      field: "column4",
      headerName: "Column 4",
      editable: true,
      renderEditCell: (params) => <CustomEditComponent {...params} />,
    },
    {
      field: "column5",
      headerName: "Column 5",
      editable: true,
      renderEditCell: (params) => <CustomEditComponent {...params} />,
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={gridData}
        columns={columns}
        // checkboxSelection
        // disableSelectionOnClick
        editable
      />
    </div>
  );
};

export default Home;
