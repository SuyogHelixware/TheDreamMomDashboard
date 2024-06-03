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
import { BASE_URL, Bunny_Image_URL } from "../../Constant";

const PlanMasterVaccination = ({ sendVaccinationDataToParent, ...props }) => {
  const [childDialogOpen, setChildDialogOpen] = useState(false);
  const [childData, setChildData] = useState([]);
  const [vaccinationData, setVaccinationData] = useState([]);
  const [selectedVaccinationRows, setSelectedVaccinationRows] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}vaccination/`).then((response) => {
      setVaccinationData(response.data.values);
      setChildData(props.vaccinationData);
    });
  }, [props.vaccinationData]);

  const handleChildDialogOpen = () => {
    setChildDialogOpen(true);
  };

  const handleChildDialogClose = () => {
    setChildDialogOpen(false);
  };

  const handleVaccinationRowClick = (id) => {
    const selectedIDs = new Set(id);
    const selectedRows = vaccinationData.filter((row) =>
      selectedIDs.has(row._id)
    );
    setSelectedVaccinationRows(
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

      sendVaccinationDataToParent(updatedData);

      return updatedData;
    });
  };

  const handleSaveVaccinationSelection = () => {
    setChildData((prev) => [...childData, ...selectedVaccinationRows]);
    setChildDialogOpen(false);
    sendVaccinationDataToParent([...childData, ...selectedVaccinationRows]);
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
    {
      field: "Image",
      headerName: "Image",
      width: 250,
      renderCell: (params) => (
        <img
          src={`${Bunny_Image_URL}/Schedule/Vaccination/${params.row.Image}`}
          alt=""
          height={50}
          width={80}
        />
      ),
    },
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
              Add Vaccination
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
            <b>Vaccination Table</b>
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
          <b>Select Vaccination</b>
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
            rows={vaccinationData.map((data, index) => ({
              ...data,
              SrNo: index + 1,
            }))}
            className="datagrid-style"
            rowHeight={80}
            columns={[
              { field: "SrNo", headerName: "SR.NO", width: 250 },
              { field: "Name", headerName: "Name", width: 250 },
              { field: "Description", headerName: "Description", width: 300 },
              {
                field: "Image",
                headerName: "Image",
                width: 250,
                renderCell: (params) => (
                  <img
                    src={`${Bunny_Image_URL}/Schedule/Vaccination/${params.row.Image}`}
                    alt=""
                    height={50}
                    width={80}
                  />
                ),
              },
            ]}
            checkboxSelection
            isRowSelectable={(params) => {
              return childData === undefined
                ? true
                : !childData.map((obj) => obj._id).includes(params.row._id);
            }}
            onRowSelectionModelChange={(ids) => handleVaccinationRowClick(ids)}
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
            onClick={handleSaveVaccinationSelection}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PlanMasterVaccination;
