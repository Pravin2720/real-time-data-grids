import React from "react";
import { useGridApiContext } from "@mui/x-data-grid";

const CustomEditComponent = (props) => {
  const { id, value, field, hasFocus, handleCellChange } = props;
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
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return <input ref={ref} type="text" value={value} onChange={handleValueChange} />;
};

export default CustomEditComponent;
