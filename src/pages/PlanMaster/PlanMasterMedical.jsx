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
import { BASE_URL } from "../../Constant";

const PlanMasterMedical = ({ sendMedicalTestDataToParent, ...props }) => {
  const [childDialogOpen, setChildDialogOpen] = useState(false);
  const [childData, setChildData] = useState([]);
  const [medicalData, setMedicalData] = useState([]);
  const [selectedMedicalRows, setSelectedMedicalRows] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}medicaltests/`).then((response) => {
      const updatedMedicalData = response.data.values.flat().map((item) => ({
        _id: item._id,
        Name: item.Name,
        Description: item.Description,
      }));
      setMedicalData(updatedMedicalData);
      setChildData(props.medTestData);
    });
  }, [props.medTestData]);

  const handleChildDialogOpen = () => {
    setChildDialogOpen(true);
  };

  const handleChildDialogClose = () => {
    setChildDialogOpen(false);
  };

  const handleMedicalRowClick = (id) => {
    const selectedIDs = new Set(id);
    const selectedRows = medicalData.filter((row) => selectedIDs.has(row._id));
    setSelectedMedicalRows(
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
      const updatedData = [...prevState];
      updatedData.splice(data.SrNo - 1, 1);

      sendMedicalTestDataToParent(updatedData);

      return updatedData;
    });
  };

  const handleSaveMedicalSelection = () => {
    setChildData((prev) => [...childData, ...selectedMedicalRows]);
    setChildDialogOpen(false);
    sendMedicalTestDataToParent([...childData, ...selectedMedicalRows]);
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
              Add Medical Test
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
            <b>Medical Test Table</b>
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
          <b>Select Medical Test</b>
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
            rows={medicalData.map((data,index)=>({...data,id:index+1}))}
            className="datagrid-style"
            rowHeight={80}
            columns={[
              { field: "id", headerName: "SR.NO", width: 250 },
              { field: "Name", headerName: "Name", width: 250 },
              { field: "Description", headerName: "Description", width: 300 },
            ]}
            checkboxSelection
            getRowId={(row) => row._id}
            isRowSelectable={(params) => {
              return childData === undefined
                ? true
                : !childData.map((obj) => obj._id).includes(params.row._id);
            }}
            onRowSelectionModelChange={(ids) => handleMedicalRowClick(ids)}
            disableRowSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
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
            onClick={handleSaveMedicalSelection}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PlanMasterMedical;
