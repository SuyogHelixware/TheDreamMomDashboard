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
import Swal from "sweetalert2";
import { BASE_URL } from "../Constant";
import Loader from "../components/Loader";

export default function MedicalCondition() {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [userData, setUserData] = React.useState([]);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [on, setOn] = React.useState(false);

  const [data, setData] = React.useState({
    id: "",
    Name: "",
    Description: "",
    Status: "",
  });

  const clearFormData = () => {
    setData({
      id: "",
      Name: "",
      Description: "",
      Status: "",
    });
  };

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
    clearFormData();
  };
  const deluser = (id) => {
    Swal.fire({
      text: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${BASE_URL}medicalconditions/${id}`)
          .then((response) => {
            if (response.data.status === true) {
              setUserData(userData.filter((user) => user._id !== id));
              Swal.fire({
                position: "center",
                icon: "success",
                toast: true,
                title: "User deleted Successfully",
                showConfirmButton: false,
                timer: 2500,
              });
            }
          })
          .catch((error) => {
            alert("error");
          });
      }
    });
  };

  const validationAlert = (message) => {
    Swal.fire({
      position: "center",
      icon: "warning",
      toast: true,
      title: message,
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const updateUser = (id) => {
    const requiredFields = ["Name", "Description", "Status"];

    const emptyRequiredFields = requiredFields.filter((field) => !data[field]);

    if (emptyRequiredFields.length > 0) {
      validationAlert("Please fill in all required fields");
      return;
    }

    setLoaderOpen(true);
    const axiosRequest =
      SaveUpdateButton === "SAVE"
        ? axios.post(`${BASE_URL}medicalconditions`, data)
        : axios.patch(`${BASE_URL}medicalconditions/${id}`, data);

    axiosRequest
      .then((response) => {
        setLoaderOpen(false);
        if (response.data.status === true) {
          Swal.fire({
            position: "center",
            icon: "success",
            toast: true,
            title:
              SaveUpdateButton === "SAVE"
                ? "User Added Successfully"
                : "User Updated Successfully",
            showConfirmButton: false,
            timer: 2500,
          });
          getUserData();
        } else if (response.data.status === false) {
          Swal.fire({
            position: "center",
            icon: "error",
            toast: true,
            title: response.data.message,
            showConfirmButton: false,
            timer: 2500,
          });
        }
        handleClose();
      })
      .catch((error) => {
        setLoaderOpen(false);
        Swal.fire({
          position: "center",
          icon: "error",
          toast: true,
          title: "Error occurred while saving/updating user",
          showConfirmButton: false,
          timer: 2500,
        });
      });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 150, sortable: false },
    {
      field: "Name",
      headerName: "Name",
      width: 200,
      sortable: false,
    },
    {
      field: "Description",
      headerName: "Description",
      width: 380,
      sortable: false,
    },
    {
      field: "Status",
      headerName: "Status",
      width: 200,
      sortable: false,
    },

    {
      field: "Action",
      headerName: "Action",
      width: 200,
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
  const getUserData = () => {
    axios.get(`${BASE_URL}medicalconditions/`).then((response) => {
      setUserData(response.data.values.flat());
    });
  };
  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      {/* =======================Modal================== */}
      {loaderOpen && <Loader open={loaderOpen} />}

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
              <Typography fontWeight="bold">Add Medical Conditions</Typography>
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
                value={data.Name}
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

            <Grid item md={12} sm={6} xs={12}>
              <TextField
                style={{ borderRadius: 10, width: "100%" }}
                label="  Status"
                id="Status"
                onChange={onchangeHandler}
                value={data.Status}
                name="Status"
              />
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
                onClick={() => updateUser(data._id)}
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
      {/* =============END====================== */}
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
          Manage Medical Conditons
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
          Add Condition
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
