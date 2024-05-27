import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../Constant";

const PlanMasterMedication = ({ sendMedicationDataToParent, ...props }) => {
  const [childDialogOpen, setChildDialogOpen] = useState(false);
  const [childData, setChildData] = useState([]);
  const [MedicationData, setMedicationData] = useState([]);
  const [selectedMedicationRows, setSelectedMedicationRows] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}medications/`).then((response) => {
      const updatedMedicationData = response.data.values.flat().map((item) => ({
        _id: item._id,
        Name: item.Name,
        Description: item.Description,
      }));
      setMedicationData(updatedMedicationData);
    });
  }, []);

  const handleChildDialogOpen = () => {
    setChildDialogOpen(true);
  };

  const handleChildDialogClose = () => {
    setChildDialogOpen(false);
  };

  const handleMedicationRowClick = (id) => {
    const selectedIDs = new Set(id);
    const selectedRows = MedicationData.filter((row) =>
      selectedIDs.has(row._id)
    );
    setSelectedMedicationRows(
      selectedRows.map((item) => ({
        _id: item._id,
        Name: item.Name,
        Description: item.Description,
        Image: item.Image,
      }))
    );
  };

  const handleDelete = (data) => {
    setChildData((prevState) => {
      const deleteRow = [...prevState];
      deleteRow.splice(data.SrNo - 1, 1);
      return deleteRow;
    });
  };

  const handleSaveMedicationSelection = () => {
    setChildData((prev) => [...prev, ...selectedMedicationRows]);
    setChildDialogOpen(false);
    sendMedicationDataToParent(selectedMedicationRows);
  };

  const columns = [
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton color="error" onClick={() => handleDelete(params.row)}>
            <DeleteForeverIcon />
          </IconButton>
        </>
      ),
    },
    {
      field: "SrNo",
      headerName: "SrNo",
      width: 100,
    },
    { field: "Name", headerName: "Name", width: 250 },
    { field: "Description", headerName: "Description", width: 400 },
  ];

  return (
    <>
      <Grid container mt={2}>
        <Grid container item lg={12}>
          <Grid item my={2} width={"30%"}>
            <Button
              onClick={handleChildDialogOpen}
              sx={{
                p: 1,
                color: "white",
                backgroundColor: "#8F00FF",
                boxShadow: 5,
                "&:hover": {
                  backgroundColor: "gray",
                },
                "& .MuiButton-label": {
                  display: "flex",
                  alignItems: "center",
                },
                "& .MuiSvgIcon-root": {
                  marginRight: "10px",
                },
              }}
            >
              Add Medications
            </Button>
          </Grid>
          <Grid
            item
            width={"70%"}
            fontSize={20}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <b>Medications Table</b>
          </Grid>
        </Grid>

        <Grid container item height={380} lg={12} component={Paper}>
          <DataGrid
            className="datagrid-style"
            rows={
              (childData.length === 0 ? props.medicationData : childData).map(
                (data, index) => ({
                  ...data,
                  SrNo: index + 1,
                })
              ) || []
            }
            rowHeight={70}
            getRowId={(row) => row._id}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
          />
        </Grid>
      </Grid>

      <Dialog
        open={childDialogOpen}
        onClose={handleChildDialogClose}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>
          <b>Select Medications</b>
          <IconButton
            aria-label="close"
            onClick={handleChildDialogClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ height: 400 }}>
          <DataGrid
            rows={MedicationData}
            className="datagrid-style"
            rowHeight={80}
            columns={[
              { field: "id", headerName: "ID", width: 250 },
              { field: "Name", headerName: "Name", width: 250 },
              { field: "Description", headerName: "Description", width: 300 },
            ]}
            checkboxSelection
            isRowSelectable={(params) => {
              return childData === undefined
                ? true
                : !childData.map((obj) => obj._id).includes(params.row.id);
            }}
            onRowSelectionModelChange={(ids) => handleMedicationRowClick(ids)}
            disableRowSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            getRowId={(row) => row._id}
          />
        </DialogContent>

        <DialogActions>
          <Button
            sx={{
              p: 1,
              px: 3,
              color: "white",
              backgroundColor: "#8F00FF",
              boxShadow: 5,
              "&:hover": {
                backgroundColor: "gray",
              },
              "& .MuiButton-label": {
                display: "flex",
                alignItems: "center",
              },
              "& .MuiSvgIcon-root": {
                marginRight: "10px",
              },
            }}
            onClick={handleSaveMedicationSelection}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PlanMasterMedication;
