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
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL, Bunny_Image_URL } from "../Constant";
import InputTextField, { InputDescriptionField } from "../components/Component";

const PlanMaster = () => {
  const [open, setOpen] = useState(false);
  const [childDialogOpen, setChildDialogOpen] = useState(false);
  const [data, setData] = useState({
    Name: "",
    Description: "",
    Age: "",
    Height: "",
    Weight: "",
  });
  const [childData, setChildData] = useState([]);
  const [dietData, setDietData] = useState([]);
  const [selectedDietRows, setSelectedDietRows] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}diet/`).then((response) => {
      const updatedDietData = response.data.values.flat().map((item) => ({
        id: item._id,
        Name: item.Name,
        Description: item.Description,
        Image: item.Image,
      }));
      setDietData(updatedDietData);
    });
  }, []);

  const handleChildDialogOpen = () => {
    setChildDialogOpen(true);
  };

  const handleChildDialogClose = () => {
    setChildDialogOpen(false);
  };

  const handleParentDialogOpen = () => {
    setOpen(true);
  };

  const handleParentDialogClose = () => {
    setOpen(false);
  };

  const handleDietRowClick = (id) => {
    const selectedIDs = new Set(id);
    const selectedRows = dietData.filter((row) => selectedIDs.has(row.id));
    setSelectedDietRows(
      selectedRows.map((item) => ({
        id: item.id,
        Name: item.Name,
        Description: item.Description,
        Image: item.Image,
      }))
    );
  };

  const handleSaveDietSelection = () => {
    setChildData((prev) => [...prev, ...selectedDietRows]);
    setChildDialogOpen(false);
  };

  const columns = [
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton color="error">
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
    { field: "Description", headerName: "Description", width: 300 },
    {
      field: "Image",
      headerName: "Image",
      width: 250,
      renderCell: (params) => (
        <img
          src={`${Bunny_Image_URL}/Schedule/Diet/${params.row.Image}`}
          alt=""
          height={50}
          width={80}
        />
      ),
    },
  ];

  return (
    <>
      <Grid
        container
        xs={12}
        sm={12}
        md={12}
        lg={12}
        component={Paper}
        textAlign={"center"}
        sx={{
          width: "100%",
          px: 5,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
        elevation={4}
      >
        <Typography
          width={"100%"}
          textAlign="center"
          textTransform="uppercase"
          fontWeight="bold"
          color={"#673AB7"}
          padding={1}
          noWrap
        >
          Plan Master
        </Typography>
      </Grid>

      <Button
        onClick={handleParentDialogOpen}
        type="text"
        size="medium"
        sx={{
          pr: 2,
          color: "white",
          backgroundColor: "#8F00FF",
          boxShadow: 5,
          "&:hover": {
            backgroundColor: "gray",
          },
        }}
      >
        Open Plan Master
      </Button>

      <Dialog
        open={open}
        onClose={handleParentDialogClose}
        aria-labelledby="parent-dialog-title"
        aria-describedby="parent-dialog-description"
        fullScreen
        // fullWidth
      >
        <DialogTitle>
          Plan Master
          <IconButton
            aria-label="close"
            onClick={handleParentDialogClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <InputTextField
                size="small"
                fullWidth
                id="Name"
                label="Enter Name"
                name="Name"
                value={data.Name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputTextField
                size="small"
                fullWidth
                id="Age"
                label="Enter Age"
                name="Age"
                value={data.Age}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputDescriptionField
                size="small"
                required
                fullWidth
                id="Description"
                label="Enter Description"
                name="Description"
                multiline
                rows={3}
                value={data.Description}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputTextField
                size="small"
                fullWidth
                id="Weight"
                label="Enter Weight"
                name="Weight"
                value={data.Weight}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputTextField
                size="small"
                fullWidth
                id="Height"
                label="Enter Height"
                name="Height"
                value={data.Height}
              />
            </Grid>
          </Grid>

          <Grid container mt={2}>
            <Grid container item lg={12}>
              <Grid item mb={1} lg={6}>
                <Button
                  size="small"
                  sx={{ bgcolor: "#8F00FF", color: "white" }}
                  onClick={handleChildDialogOpen}
                >
                  Add Diet
                </Button>
              </Grid>
              <Grid
                item
                lg={6}
                xs={6}
                fontSize={20}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <b>Diet Table</b>
              </Grid>
            </Grid>

            <Grid container item height={380} lg={12} component={Paper}>
              <DataGrid
                className="datagrid-style"
                rows={childData.map((data, index) => ({
                  ...data,
                  SrNo: index + 1,
                }))}
                getRowId={(row) => row.id}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Dialog
        open={childDialogOpen}
        onClose={handleChildDialogClose}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>
          Select Diets
          <IconButton
            aria-label="close"
            onClick={handleChildDialogClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <DataGrid
            rows={dietData}
            columns={[
              { field: "id", headerName: "ID", width: 250 },
              { field: "Name", headerName: "Name", width: 250 },
              { field: "Description", headerName: "Description", width: 300 },
              {
                field: "Image",
                headerName: "Image",
                width: 250,
                renderCell: (params) => (
                  <img
                    src={`${Bunny_Image_URL}/Schedule/Diet/${params.row.Image}`}
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
                : !childData.map((obj) => obj.id).includes(params.row.id);
            }}
            onRowSelectionModelChange={(ids) => handleDietRowClick(ids)}
            disableRowSelectionOnClick
          />
        </DialogContent>

        <DialogActions>
          <Button
            sx={{ bgcolor: "green", color: "white", px: 3 }}
            onClick={handleSaveDietSelection}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PlanMaster;
