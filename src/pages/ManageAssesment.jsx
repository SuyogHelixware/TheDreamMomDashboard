import AddIcon from "@mui/icons-material/Add";
import { Box, Modal, Paper } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import * as React from "react";
import { BASE_URL } from "../Constant";

export default function ManageAssesment() {
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [data, setData] = React.useState([
    {
      id: "",
      Weight: "",
      Height: "",
      SonogramDate: "",
      DueDate: "",
      DelDate: "",
      DelType: "",
      BabyGender: "",
      MaternityHistory: "",
      Remarks: "",
      Status: " ",
      DOB: "",
      BloodGroup: "",
      UserId: "",
    },
  ]);
  const getUserData = () => {
    axios.get(`${BASE_URL}assesment/`).then((response) => {
      setData(response.data.values || []);
    });
  };
  React.useEffect(() => {
    getUserData();
  }, []);
  const handleClose = () => {
    setOn(false);
  };
  const handleOnSave = () => {
    setSaveUpdateButton("Save");
    setOn(true);
  };
  const handleInputChange = (event) => {};
  const handleSubmitForm = () => {};

  const columns = [
    { field: "id", headerName: "ID", width: 90, sortable: false },
    {
      field: "Weight",
      headerName: "Weight",
      width: 150,
      sortable: false,
    },
    {
      field: "Height",
      headerName: "Height",
      width: 150,
      sortable: false,
    },
    {
      field: "SonogramDate",
      headerName: "SonogramDate",
      width: 150,
      sortable: false,
    },

    {
      field: "DueDate",
      headerName: "DueDate",
      width: 160,
      sortable: false,
    },
    {
      field: "DelDate",
      headerName: "DelDate",
      width: 150,
      sortable: false,
    },
    {
      field: "DelType",
      headerName: "DelType",
      width: 150,
      sortable: false,
    },
    {
      field: "BabyGender",
      headerName: "BabyGender",
      width: 130,
      sortable: false,
    },
    {
      field: "MaternityHistory",
      headerName: "MaternityHistory",
      width: 100,
      sortable: false,
    },
    {
      field: "Status",
      headerName: "Status",
      width: 100,
      sortable: false,
    },
    {
      field: "DOB",
      headerName: "DOB",
      width: 100,
      sortable: false,
    },
    {
      field: "BloodGroup",
      headerName: "BloodGroup",
      width: 100,
      sortable: false,
    },
    {
      field: "MedConIds",
      headerName: "MedConIds",
      width: 100,
      sortable: false,
    },
  ];
  return (
    <>
      <Modal open={on} onClose={handleClose}>
        <Paper
          elevation={10}
          sx={{
            width: "90%",
            maxWidth: 400,
            bgcolor: "#ccccff",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            justifyContent: "center",
            background: "linear-gradient(to right,#E5D9F2, #CDC1FF)",
          }}
        >
          <Grid
            container
            xs={12}
            item
            spacing={3}
            display={"flex"}
            flexDirection={"column"}
            padding={4}
            justifyContent={"center"}
          >
            <Grid item xs={12}>
              <Typography fontWeight="bold">Add Assesment</Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                size="small"
                required
                fullWidth
                id="name"
                label="Enter Title"
                name="name"
                onChange={handleInputChange}
                autoFocus
                style={{ borderRadius: 10, width: "100%" }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                size="small"
                required
                fullWidth
                id="description"
                label="Enter Description"
                name="description"
                onChange={handleInputChange}
                multiline
                rows={3}
                placeholder="Enter your Description..."
              />
            </Grid>

            <Grid item xs={12} md={12} textAlign={"end"}>
              <Button
                onClick={handleClose}
                type="reset"
                size="small"
                sx={{
                  marginTop: 1,
                  p: 1,
                  width: 80,
                  color: "white",
                  backgroundColor: "#3B444B",
                  mr: 1,
                  "&:hover": {
                    backgroundColor: "#3B444B",
                  },
                }}
              >
                Close
              </Button>

              <Button
                type="submit"
                size="small"
                onClick={handleSubmitForm}
                sx={{
                  marginTop: 1,
                  p: 1,
                  width: 80,
                  color: "white",
                  background: "linear-gradient(to right, #EE696B, #523A78)",
                  "&:hover": {
                    backgroundColor: "#673AB7",
                  },
                }}
              >
                {SaveUpdateButton}
              </Button>
            </Grid>
            <Grid />
          </Grid>
        </Paper>
      </Modal>

      <Grid
        container
        xs={12}
        sm={6}
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
        elevation="4"
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
          Manage Assesment
        </Typography>
      </Grid>

      <Grid textAlign={"end"} marginBottom={1}>
        <Button
          onClick={handleOnSave}
          type="text"
          size="medium"
          sx={{
            pr: 2,
            mb: 2,
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
          <AddIcon />
          Add Assesment
        </Button>
      </Grid>

      <Paper
        sx={{
          marginTop: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "#",
        }}
        elevation={7}
      >
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            className="datagrid-style"
            getRowId={(row) => row.id}
            rows={data.map((data, id) => ({ ...data, id: id + 1 }))}
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
        </Box>
      </Paper>
    </>
  );
}
