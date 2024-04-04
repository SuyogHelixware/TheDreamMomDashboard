import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  Button,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import * as React from "react";
import { useEffect } from "react";
import avatar from "../../assets/avtar.png";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { BASE_URL } from "../../Constant";

export default function Medication() {
  const [uploadedFileName, setUploadedFileName] = React.useState("");
  const [userData, setUserData] = React.useState([]);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [on, setOn] = React.useState(false);
  const [data, setData] = React.useState({
    id: "",
    Password: "",
    Firstname: "",
    Middlename: "",
    Lastname: "",
  });

  const onchangeHandler = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };
  const handleClose = () => {
    setOn(false);
  };

  const handleClick = (row) => {
    setSaveUpdateButton("UPDATE");
    setOn(true);
    setData(row);
  };
  const handleOnSave = () => {
    setSaveUpdateButton("SAVE");
    setOn(true);
  };
  const deluser = (id) => {
    axios
      .delete(`${BASE_URL}Users/${id}`)
      .then((response) => {
        if (response.data.status === true) {
          alert("record deleted");
        }
      })
      .catch((error) => {
        alert("error");
      });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 ,sortable: false,},
    {
      field: "Firstname",
      headerName: "Name",
      width: 300,
      sortable: false,
    },
    {
      field: "Middlename",
      headerName: "Description",
      width: 500,
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
          <IconButton
            onClick={() => handleClick(params.row)}
            sx={{
              "& .MuiButtonBase-root,": {
                padding: 0,
              },
            }}
            color="primary"
          >
            <EditNoteIcon />
          </IconButton>
          <IconButton
            sx={{
              "& .MuiButtonBase-root,": {
                padding: 0,
                marginLeft: 3,
              },
            }}
            onClick={() => deluser(params.row._id)}
            color="primary"
          >
            <DeleteForeverIcon style={{ color: "red" }} />
          </IconButton>
        </>
      ),
    },
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log("Uploaded file:", file);
    setUploadedFileName(file.name);
  };

  useEffect(() => {
    const getUserData = () => {
      axios.get(`${BASE_URL}Users/`).then((response) => {
        setUserData(response.data.values.flat());
      });
    };

    getUserData();
  }, []);

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
            spacing={4}
            display={"flex"}
            flexDirection={"column"}
            padding={4}
            justifyContent={"center"}
          >
            <Grid item xs={12}>
              <Typography fontWeight="bold">Add Medications</Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="name"
                required
                size="small"
                id="name"
                label="Enter Name"
                style={{ borderRadius: 10, width: "100%" }}
                autoFocus
                onChange={onchangeHandler}
                value={data.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Enter Description"
                name="Description"
                id="outlined-multiline-static"
                style={{ borderRadius: 10, width: "100%" }}
                value={data.Description}
                multiline
                rows={2}
                onChange={onchangeHandler}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={12}>
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

            <Grid item xs={12} md={12} textAlign={"end"}>
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
          Manage Medication
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
          Add Medications
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
            getRowId={(row) => row._id}
            rows={userData.map((data, id) => ({ ...data, id: id + 1 }))}
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
