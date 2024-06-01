import AddIcon from "@mui/icons-material/Add";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  Badge,
  Button,
  Grid,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import dayjs from "dayjs";
import * as React from "react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import avatar from "../../src/assets/avtar.png";
import {
  BASE_URL,
  Bunny_Image_URL,
  Bunny_Storage_Access_Key,
  Bunny_Storage_URL,
} from "../Constant";
import InputTextField, {
  CheckboxInputs,
  DatePickerField,
  InputPasswordField,
  InputSelectField,
} from "../components/Component";
import Loader from "../components/Loader";

export default function ManageUsers() {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [userData, setUserData] = React.useState([]);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [on, setOn] = React.useState(false);
  const [uploadedImg, setUploadedImg] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [Image, setImage] = React.useState("");
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
      setUploadedImg(file);
    }

    // const file = event.target.files[0];
    // if (file && file.type.startsWith("image/")) {
    //   setUploadedImg(file);
    // } else {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Invalid File",
    //     text: "Please upload a valid image file",
    //     toast: true,
    //     showConfirmButton: true,
    //   });
    // setUploadedImg("");
    // }
  };

  const [data, setData] = React.useState({
    id: "",
    Password: "",
    Firstname: "",
    Middlename: "",
    Lastname: "",
    DOB: dayjs(undefined),
    Phone: "",
    Address: "",
    BloodGroup: "",
    Status: 1,
    Email: "",
    Avatar: "",
  });

  const clearFormData = () => {
    setData({
      id: "",
      Password: "",
      Firstname: "",
      Middlename: "",
      Lastname: "",
      DOB: dayjs(undefined),
      Phone: "",
      Address: "",
      BloodGroup: "",
      Status: 1,
      Email: "",
      Avatar: "",
    });
    setImage("");
  };

  const onchangeHandler = (event) => {
    if (event.target.name === "Password") {
      const password = event.target.value;
      if (password.length > 16) {
        validationAlert("Password must be at most 16 characters long.");
        return;
      }
    }

    if (event.target.name === "Phone") {
      const phone = event.target.value;
      if (phone.length > 10) {
        validationAlert("Phone number must be exactly 10 digits long.");
        return;
      } else if (phone.includes("e")) {
        validationAlert("Please enter valid number");
        return;
      }
    }

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
    setImage(`${Bunny_Image_URL}/Users/${row._id}/${row.Avatar}`);
  };
  const handleOnSave = () => {
    setSaveUpdateButton("SAVE");
    setOn(true);
    clearFormData();
  };
  const deluser = (id) => {
    setLoaderOpen(true);
    Swal.fire({
      text: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${BASE_URL}Users/${id}`)
          .then((response) => {
            if (response.data.status) {
              setLoaderOpen(false);
              setUserData(userData.filter((user) => user._id !== id));
              Swal.fire({
                position: "center",
                icon: "success",
                toast: true,
                title: "User deleted Successfully",
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              setLoaderOpen(false);
              Swal.fire({
                icon: "error",
                toast: true,
                title: "Failed",
                text: "Failed to Delete Video",
                showConfirmButton: true,
              });
            }
          })
          .catch((error) => {
            setLoaderOpen(false);
            Swal.fire({
              icon: "error",
              toast: true,
              title: "Failed",
              text: error,
              showConfirmButton: true,
            });
          });
      }
      setLoaderOpen(false);
    });
  };
  const validationAlert = (message) => {
    Swal.fire({
      position: "center",
      icon: "warning",
      toast: true,
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  };
  const updateUser = async (id) => {
    const requiredFields = [
      "Firstname",
      "Lastname",
      "Password",
      "Phone",
      "DOB",
      "BloodGroup",
    ];
    const emptyRequiredFields = requiredFields.filter((field) => !data[field]);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.Email);

    if (emptyRequiredFields.length > 0) {
      validationAlert("Please fill in all required fields");
      return;
    } else if (!isValidPhoneNumber(data.Phone)) {
      validationAlert("Please enter a valid 10-digit phone number.");
      return;
    } else if (data.Password.length < 6 || data.Password.length > 16) {
      validationAlert("Password must be at least 8 characters long.");
      return;
    } else if (data.Email.length > 0 && !emailRegex) {
      validationAlert("Please enter a valid email address.");
      return;
    }

    setLoaderOpen(true);

    const filename = new Date().getTime() + "_" + uploadedImg.name;
    const saveObj = {
      Firstname: data.Firstname,
      Middlename: data.Middlename,
      Lastname: data.Lastname,
      DOB: data.DOB,
      Password: data.Password,
      Phone: data.Phone,
      Email: data.Email,
      Address: data.Address,
      BloodGroup: data.BloodGroup,
      UserType: "P",
      Avatar: filename,
      Status: data.Status,
    };
    const UpdateObj = {
      Firstname: data.Firstname,
      Middlename: data.Middlename,
      Lastname: data.Lastname,
      DOB: data.DOB,
      Password: data.Password,
      Phone: data.Phone,
      Email: data.Email,
      Address: data.Address,
      BloodGroup: data.BloodGroup,
      Status: data.Status,
      UserType: "P",
      Avatar: uploadedImg === "" ? data.Avatar : filename,
    };

    setLoaderOpen(true);

    if (SaveUpdateButton === "SAVE") {
      if (uploadedImg === "") {
        setLoaderOpen(false);
        validationAlert("Please select file");
        return;
      }
      try {
        // First, send the request to add the user
        const response = await axios.post(`${BASE_URL}Users`, saveObj);

        if (response.data.status) {
          // If the user is added successfully, upload the image
          const res = await axios.request({
            method: "PUT",
            maxBodyLength: Infinity,
            url: `${Bunny_Storage_URL}/Users/${response.data.values._id}/${filename}`,
            headers: {
              "Content-Type": "image/jpeg",
              AccessKey: Bunny_Storage_Access_Key,
            },
            data: uploadedImg,
          });

          if (res.data.HttpCode === 201) {
            setLoaderOpen(false);
            Swal.fire({
              position: "center",
              icon: "success",
              toast: true,
              title: "User Added and Image Uploaded Successfully",
              showConfirmButton: false,
              timer: 1500,
            });
            handleClose();
            getUserData();
            setUploadedImg("");
          } else {
            setLoaderOpen(false);
            throw new Error("User Added but Failed to Upload Image");
          }
        } else {
          setLoaderOpen(false);
          throw new Error("Failed to Add User");
        }
      } catch (error) {
        setLoaderOpen(false);
        Swal.fire({
          icon: "error",
          toast: true,
          title: "Failed",
          text: error.message,
          showConfirmButton: true,
        });
      }
    } else {
      const result = await Swal.fire({
        text: "Do you want to Update...?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Update it!",
      });

      if (result.isConfirmed) {
        debugger;
        try {
          const response = await axios.patch(
            `${BASE_URL}Users/${data._id}`,
            UpdateObj
          );

          if (response.data.status && uploadedImg !== "") {
            const res = await axios.request({
              method: "PUT",
              maxBodyLength: Infinity,
              url: `${Bunny_Storage_URL}/Users/${data._id}/${filename}`,
              headers: {
                "Content-Type": "image/jpeg",
                AccessKey: Bunny_Storage_Access_Key,
              },
              data: uploadedImg,
            });
            if (res.data.HttpCode === 201) {
              if (uploadedImg !== "") {
                await axios.request({
                  method: "DELETE",
                  maxBodyLength: Infinity,
                  url: `${Bunny_Storage_URL}/Users/${data._id}/${data.Avatar}`,
                  headers: {
                    AccessKey: Bunny_Storage_Access_Key,
                  },
                });
              }
              setLoaderOpen(false);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Data Updated Successfully",
                toast: true,
                showConfirmButton: false,
                timer: 1500,
              });
              handleClose();
              getUserData();
              setUploadedImg("");
            } else {
              setLoaderOpen(false);
              throw new Error("Failed to Update Data");
            }
          } else {
            setLoaderOpen(false);
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Data Updated Successfully",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            });
            handleClose();
            getUserData();
            setUploadedImg("");
          }
        } catch (error) {
          if (error.response.data.HttpCode === 404) {
            setLoaderOpen(false);
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Data Updated Successfully",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            });
            handleClose();
            getUserData();
            setUploadedImg("");
            return;
          }
          setLoaderOpen(false);
          Swal.fire({
            icon: "error",
            toast: true,
            title: "Failed",
            text: error.message,
            showConfirmButton: true,
          });
        }
      } else {
        setLoaderOpen(false);
      }
    }
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const columns = [
    {
      field: "Action",
      headerName: "Action",
      width: 150,
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
    { field: "id", headerName: "SR.No", width: 90, sortable: false },
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
      valueFormatter: (params) => dayjs(params.value).format("YYYY-MM-DD"),
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
      field: "Status",
      headerName: "Status",
      width: 100,
      sortable: false,
      valueGetter: (params) =>
        params.row.Status === 1 ? "Active" : "Inactive",
    },
    {
      field: "Email",
      headerName: "Email",
      width: 100,
      sortable: false,
    },
    {
      field: "Avatar",
      headerName: "Image",
      width: 250,
      renderCell: (params) => (
        <img
          // src={`${Bunny_Image_URL}/Users/${params.row.Avatar}`}
          src={`${Bunny_Image_URL}/Users/${params.row._id}/${params.row.Avatar}`}
          alt=""
          height={50}
          width={80}
        />
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
            textAlign: "center",
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
            <Grid
              container
              item
              md={12}
              justifyContent="center"
              alignItems="flex-end"
              style={{ position: "relative" }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <label htmlFor="upload-image">
                    <CameraAltIcon
                      style={{ cursor: "pointer", color: "white" }}
                    />
                    <input
                      accept="image/*"
                      id="upload-image"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleImageUpload}
                    />
                  </label>
                }
              >
                <img
                  src={Image || avatar}
                  alt="Upload"
                  height={70}
                  width={70}
                  style={{ display: "block", borderRadius: "50%" }}
                />
              </Badge>
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
              <InputPasswordField
                label="Password"
                id="Password"
                onChange={onchangeHandler}
                value={data.Password}
                name="Password"
                type={showPassword ? "text" : "password"}
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
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
                maxDate={dayjs(undefined)}
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
            <Grid item md={3} sm={3} xs={12} textAlign={"left"} ml={3}>
              <CheckboxInputs
                checked={data.Status}
                label="Active"
                id="Status"
                onChange={(event) =>
                  onchangeHandler({
                    target: {
                      name: "Status",
                      id: "Status",
                      value: event.target.checked,
                    },
                  })
                }
                value={data.Status}
                name="Status"
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
                  boxShadow: 5,
                  color: "white",
                  backgroundColor: "#463C8A",
                  mr: 1,
                  "&:hover": {
                    backgroundColor: "#4f52b2",
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
                  boxShadow: 5,
                  background: "linear-gradient(to right, #8F00FF  , #8F00FF)",
                  "&:hover": {
                    backgroundColor: "#8F00FF",
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
        <Box sx={{ height: "80vh", width: "100%" }}>
          <DataGrid
            className="datagrid-style"
            rowHeight={70}
            getRowId={(row) => row._id}
            rows={userData.map((data, id) => ({ ...data, id: id + 1 }))}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[5]}
            // hideFooter
          />
        </Box>
      </Paper>
    </>
  );
}
