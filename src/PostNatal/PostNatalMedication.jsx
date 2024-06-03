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

const PostNatalMedication = ({ sendMedicationDataToParent, ...props }) => {
  const [childDialogOpen, setChildDialogOpen] = useState(false);
  const [childData, setChildData] = useState([]);
  const [MedicationData, setMedicationData] = useState([]);
  const [selectedMedicationRows, setSelectedMedicationRows] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}medicationdet/`).then((response) => {
      const updatedMedicationData = response.data.values
        .flat()
        .map((item, index) => ({
          _id: item._id,
          id: index + 1,
          Name: item.MedId.Name,
          Description: item.MedId.Description,
          DosageName: item.DosageId.Name,
          DosageDescription: item.DosageId.Description,
        }));
      setMedicationData(updatedMedicationData);
      setChildData(props.medicationData);
    });
  }, [props.medicationData]);

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
        DosageName: item.DosageName,
        DosageDescription: item.DosageDescription,
      }))
    );
  };

  const handleDelete = (data) => {
    setChildData((prevState) => {
      const updatedData = [...prevState];
      updatedData.splice(data.SrNo - 1, 1);

      sendMedicationDataToParent(updatedData);

      return updatedData;
    });
  };

  const handleSaveMedicationSelection = () => {
    setChildData((prev) => [...childData, ...selectedMedicationRows]);
    setChildDialogOpen(false);
    sendMedicationDataToParent([...childData, ...selectedMedicationRows]);
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
      headerName: "Sr.No",
      width: 100,
    },
    { field: "Name", headerName: "Name", width: 250 },
    { field: "Description", headerName: "Description", width: 400 },
    { field: "DosageName", headerName: "DosageName", width: 250 },
    { field: "DosageDescription", headerName: "DosageDescription", width: 400 },
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
                backgroundColor: "#5C5CFF",
                boxShadow: 5,
                "&:hover": {
                  backgroundColor: "#E6E6FA",
                  border: "1px solid #5C5CFF",
                  color: "#5C5CFF",
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
              childData.map((data, index) => ({
                ...data,
                SrNo: index + 1,
              })) || []
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
            rows={MedicationData.map((data,index)=>({...data,id:index+1}))}
         
            className="datagrid-style"
            rowHeight={80}
            columns={[
              { field: "id", headerName: "SR.NO", width: 200 },
              { field: "Name", headerName: "Name", width: 250 },
              { field: "Description", headerName: "Description", width: 300 },
              { field: "DosageName", headerName: "DosageName", width: 250 },
              {
                field: "DosageDescription",
                headerName: "DosageDescription",
                width: 300,
              },
            ]}
            checkboxSelection
            isRowSelectable={(params) => {
              return childData === undefined
                ? true
                : !childData.map((obj) => obj._id).includes(params.row._id);
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
              backgroundColor: "#5C5CFF",
              boxShadow: 5,
              "&:hover": {
                backgroundColor: "#E6E6FA",
                border: "1px solid #5C5CFF",
                color: "#5C5CFF",
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

export default PostNatalMedication;
