import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Button, Grid, IconButton, Modal, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import dayjs from "dayjs";
import * as React from "react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import avatar from "../../src/assets/avtar.png";
import { BASE_URL } from "../Constant";
import InputTextField, {
  DatePickerField,
  InputSelectField,
} from "../components/Component";
import Loader from "../components/Loader";

export default function ManageUsers() {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [userData, setUserData] = React.useState([]);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [on, setOn] = React.useState(false);

  const [data, setData] = React.useState({
    id: "",
    Password: "",
    Firstname: "",
    Middlename: "",
    Lastname: "",
    DOB: "",
    Phone: "",
    Address: "",
    BloodGroup: "",
    // UserType: "",
    Status: "",
    Email: "",
  });

  const clearFormData = () => {
    setData({
      id: "",
      Password: "",
      Firstname: "",
      Middlename: "",
      Lastname: "",
      DOB: "",
      Phone: "",
      Address: "",
      BloodGroup: "",
      // UserType: "",
      Status: "",
      Email: "",
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
          .delete(`${BASE_URL}Users/${id}`)
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
    const requiredFields = [
      "Firstname",
      "Lastname",
      "Password",
      "Phone",
      "Address",
      "Email",
      "DOB",
      "BloodGroup",
    ];
    const emptyRequiredFields = requiredFields.filter((field) => !data[field]);

    if (emptyRequiredFields.length > 0) {
      // alert('Please fill in all required fields.');
      validationAlert("Please fill in all required fields");
      return;
    }

    if (!isValidPhoneNumber(data.Phone)) {
      validationAlert("Please enter a valid 10-digit phone number.");
      return;
    }

    if (data.Password.length < 8) {
      validationAlert("Password must be at least 8 characters long.");
      return;
    }

    setLoaderOpen(true);
    const axiosRequest =
      SaveUpdateButton === "SAVE"
        ? axios.post(`${BASE_URL}Users`, data)
        : axios.patch(`${BASE_URL}Users/${id}`, data);

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

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90, sortable: false },
    {
      field: "Firstname",
      headerName: "First Name",
      width: 150,
      sortable: false,
    },
    {
      field: "Middlename",
      headerName: "Middle Name",
      width: 150,
      sortable: false,
    },
    {
      field: "Lastname",
      headerName: "Last Name",
      width: 150,
      sortable: false,
    },
    {
      field: "DOB",
      headerName: "DOB",
      width: 150,
      sortable: false,
      valueFormatter: (params) => dayjs(params.value).format("DD-MMM-YYYY"),
    },
    {
      field: "Password",
      headerName: "Password",
      width: 160,
      sortable: false,
    },
    {
      field: "Phone",
      headerName: "Phone",
      width: 150,
      sortable: false,
    },
    {
      field: "Address",
      headerName: "Address",
      width: 150,
      sortable: false,
    },
    {
      field: "BloodGroup",
      headerName: "BloodGroup",
      width: 130,
      sortable: false,
    },
    {
      field: "UserType",
      headerName: "UserType",
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
      field: "Email",
      headerName: "Email",
      width: 100,
      sortable: false,
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
  const getUserData = () => {
    axios.get(`${BASE_URL}Users/`).then((response) => {
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
            maxWidth: 600,
            height: 500,
            bgcolor: "#ccccff",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: 4,
            justifyContent: "center",
            background: "linear-gradient(to right,#E5D9F2, #CDC1FF)",
            overflowY: { xs: "scroll", md: "auto" },
            "&::-webkit-scrollbar": {
              display: "none",
            },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <Grid container rowSpacing={2.2} columnSpacing={2}>
            <Grid container item md={12} justifyContent="center">
              <center>
                <img src={avatar} alt="img" height={"70"} width={"75"} />
              </center>
            </Grid>

            <Grid item md={6} sm={6} xs={12}>
              <InputTextField
                label="First Name"
                id="Firstname"
                onChange={onchangeHandler}
                value={data.Firstname}
                name="Firstname"
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <InputTextField
                label="Middle Name"
                id="Middlename"
                onChange={onchangeHandler}
                value={data.Middlename}
                name="Middlename"
              />
            </Grid>

            <Grid item md={6} sm={6} xs={12}>
              <InputTextField
                label="Last Name"
                id="Lastname"
                onChange={onchangeHandler}
                value={data.Lastname}
                name="Lastname"
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <InputTextField
                label="Password"
                id="Password"
                onChange={onchangeHandler}
                type="password"
                value={data.Password}
                name="Password"
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <InputTextField
                label="Phone No"
                id="Phone"
                onChange={onchangeHandler}
                type="number"
                value={data.Phone}
                name="Phone"
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <InputTextField
                label="Address"
                id="Address"
                onChange={onchangeHandler}
                value={data.Address}
                name="Address"
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <InputTextField
                label="Email ID"
                id="Email"
                onChange={onchangeHandler}
                type="email"
                value={data.Email}
                name="Email"
              />
            </Grid>

            <Grid item md={6} sm={6} xs={12}>
              <DatePickerField
                id="DOB"
                label="DOB"
                value={dayjs(data.DOB)}
                onChange={(date) =>
                  onchangeHandler({
                    target: {
                      name: "DOB",
                      value: dayjs(date),
                    },
                  })
                }
              />
            </Grid>
            {/* <Grid item md={6} sm={6} xs={12}>
              <InputTextField
                label="User Type"
                id="UserType"
                name="UserType"
                onChange={onchangeHandler}
                value={data.UserType}
              />
            </Grid> */}

            <Grid item md={6} sm={6} xs={12}>
              <InputSelectField
                id="BloodGroup"
                label="Blood Group"
                onChange={onchangeHandler}
                value={data.BloodGroup}
                data={[
                  { key: "A+", value: "A+" },
                  { key: "A-", value: "A-" },
                  { key: "B+", value: "B+" },
                  { key: "B-", value: "B-" },
                  { key: "O+", value: "O+" },
                  { key: "O-", value: "O-" },
                  { key: "AB+", value: "AB+" },
                  { key: "AB-", value: "AB-" },
                ]}
              />
            </Grid>

            <Grid item xs={12} textAlign={"end"}>
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
          Manage Users
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
          Add User
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
