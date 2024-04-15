import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import * as React from "react";
import avatar from "../../src/assets/avtar.png";

export default function ManageAvoidFood() {
  const [uploadedFileName, setUploadedFileName] = React.useState("");
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [List, setList] = React.useState("");
  const handleChange = (event) => {
    setList(event.target.value);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      sortable: false,
    },
    {
      field: "firstName",
      headerName: "Name",
      width: 300,
      sortable: false,
    },
    {
      field: "lastName",
      headerName: "Description",
      width: 350,
      sortable: false,
    },
    {
      field: "schedule",
      headerName: "schedule",
      width: 200,
      sortable: false,
    },
    {
      field: "Image",
      headerName: "Image",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <img src={avatar} alt="" style={{ width: 30, height: 30 }} />
      ),
    },
    {
      field: "Action",
      headerName: "Action",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleClick(params.row)}>
            <FormatListNumberedIcon />
          </IconButton >
          <IconButton color="error" editable="false">
            <DeleteForeverSharpIcon  />
          </IconButton>
        </>
      ),
    },
  ];
  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: "devin", age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  ];

  const handleClose = () => {
    setOn(false);
  };

  const handleClick = (row) => {
    setSaveUpdateButton("Update");
    setOn(true);
  };

  const handleOnSave = () => {
    setSaveUpdateButton("Save");
    setOn(true);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log("Uploaded file:", file);
    setUploadedFileName(file.name);
  };

  return (
    <>
      <Modal open={on} onClose={handleClose}>
        <Paper
          elevation={10}
          sx={{
            width: "90%",
            maxWidth:400,
            bgcolor: "#ccccff",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: 4,
            justifyContent: "center",
            background: "linear-gradient(to right,#E5D9F2, #CDC1FF)",
          }}
        >
          <Grid
            container
            xs={12}
            item
            spacing={4}
            display={"flex"}
            flexDirection={"column"}
            // padding={4}
            justifyContent={"center"}
          >
            <Grid container item justifyContent="center" textAlign="center">
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  size="small"
                  spacing={"5"}
                  required
                  fullWidth
                  id="name"
                  label="Enter your Name"
                  name="name"
                  autoFocus
                  style={{ borderRadius: 10, width: "100%" }}
                />
              </Grid>
              <Grid item xs={12} paddingTop={2}>
                <FormControl fullWidth size="small" required>
                  <InputLabel id="demo-select-small-label">
                    Select Schedule
                  </InputLabel>

                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    label="Select schedule"
                    value={List}
                    onChange={handleChange}
                    style={{ textAlign: "left" }}
                  >
                    <MenuItem value={10}>Diet</MenuItem>
                    <MenuItem value={20}>Exercise</MenuItem>
                    <MenuItem value={30}>Medical Test</MenuItem>
                    <MenuItem value={40}>Medication</MenuItem>
                    <MenuItem value={50}>Vaccination</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* <Grid item md={12} style={{ textAlign: "left" }} paddingTop={2}>
                <InputSelectField
                  id="schedule"
                  label="Select schedule"
                  onChange={handleChange}
                  size="small"
                  data={[
                    { key: "Diet", value: "Diet" },
                    { key: "Exercise", value: "Exercise" },
                    { key: "Medical Test", value: "Medical Test" },
                    { key: "Medication", value: "Medication" },
                    { key: "Vaccination", value: "Vaccination" },
                  ]}
                />
              </Grid> */}

              <Grid item xs={12} paddingTop={1}>
                <TextField
                  margin="normal"
                  size="small"
                  required
                  fullWidth
                  id="outlined-multiline-static"
                  label="Enter Description"
                  multiline
                  rows={3}
                  placeholder="Enter your Description..."
                />
              </Grid>

              <Grid item xs={12} md={6} lg={12} marginTop={3}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                />

                <label htmlFor="file-upload">
                  <Button
                    fullWidth
                    variant="contained"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      // background: "linear-gradient(to right, #EE696B, #523A78)",
                      backgroundColor: "#8F00FF",
                      py: 1.5,
                      "&:hover": {
                        backgroundColor: "#3B444B",
                      },
                    }}
                  >
                    {uploadedFileName ? uploadedFileName : "Upload Photo"}
                  </Button>
                </label>
              </Grid>

              <Grid item xs={12} md={12} textAlign={"end"} mt={5}>
                <Button
                  onClick={handleClose}
                  type="submit"
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
          </Grid>
        </Paper>
      </Modal>

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
          Manage Avoid Food
        </Typography>
      </Grid>

      <Grid textAlign={"end"} marginBottom={1}>
        <Button
          onClick={handleOnSave}
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
          Add Food
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
        <Box sx={{ height: 400, width: "100%", elevation: 4 }}>
          <DataGrid
            className="datagrid-style"
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
          />
        </Box>
      </Paper>
    </>
  );
}
