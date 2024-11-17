import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import * as React from "react";
import Swal from "sweetalert2";
import { BASE_URL } from "../Constant";
import Loader from "../components/Loader";

const ManagePosts = () => {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [imgData, setImgData] = React.useState([]);
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [data, setData] = React.useState({
    Name: "",
    Description: "",
    NameL1: "",
    DescriptionL1: "",
    Id: "",
    Category:"en",
  });

  const clearFormData = () => {
    setData({
      Id: "",
      Name: "",
      Description: "",
      NameL1: "",
    DescriptionL1: "",
      Status: 1,
      Category:"en",
    });
  };

  // ========================
  const getApiToken = async () => {
    const data = sessionStorage.getItem('userData');
    if (data !== null) {
      const fetchedData = JSON.parse(data);
      return fetchedData.Token;
    }
  };
  // ========================

  const handleClose = () => {
    setOn(false);
  };

  const handleOnSave = () => {
    setSaveUpdateButton("SAVE");
    setOn(true);
    clearFormData();
     setData({ Name: "",
      Description: "",
      NameL1: "",
      DescriptionL1: "",
      Id: "",
      Category:"en",
    })
  };

  const onChangeHandler = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
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

  const handleSubmitForm = async() => {
    const token = await getApiToken();
    const requiredFields = ["Name", "Description"];
    const emptyRequiredFields = requiredFields.filter(
      (field) => !data[field].trim()
    );
    if (emptyRequiredFields.length > 0) {
      validationAlert("Please fill in all required fields");
      return;
    }

    const saveObj = {
      Name: data.Name,
      Description: data.Description,
      NameL1: data.NameL1,
      DescriptionL1: data.DescriptionL1,
    };
    const UpdateObj = {
      Name: data.Name,
      Description: data.Description,
      NameL1: data.NameL1,
      DescriptionL1: data.DescriptionL1,
    };

    setLoaderOpen(true);

    const axiosRequest =
      SaveUpdateButton === "SAVE"
        ? axios.post(`${BASE_URL}posts`, saveObj, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        })
        : Swal.fire({
            text: "Do you want to Update...?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Update it!",
          }).then((result) => {
            if (result.isConfirmed) {
              return axios.patch(`${BASE_URL}posts/${data.Id}`, UpdateObj, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: token,
                },
              });
            } else {
              throw new Error("Update cancelled");
            }
          });

    axiosRequest
      .then((response) => {
        setLoaderOpen(false);
        if (response.data.status) {
          setLoaderOpen(false);
          Swal.fire({
            position: "center",
            icon: "success",
            toast: true,
            title:
              SaveUpdateButton === "SAVE"
                ? "Post Added Successfully"
                : "Post Updated Successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          handleClose();
          getAllImgList();
        } else {
          setLoaderOpen(false);
          Swal.fire({
            position: "center",
            icon: "error",
            toast: true,
            title: "Failed",
            text: response.data.message,
            showConfirmButton: true,
          });
        }
      })
      .catch((error) => {
        setLoaderOpen(false);
        if (error.message !== "Update cancelled") {
          Swal.fire({
            position: "center",
            icon: "error",
            toast: true,
            title: "Failed",
            text: error.message,
            showConfirmButton: true,
          });
        }
      });
  };

  const getAllImgList = async() => {
    const token = await getApiToken();
    axios.get(`${BASE_URL}posts/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    }).then((response) => {
      const updatedImgData = response.data.values.flat().map((item, index) => ({
        ...item,
        id: index + 1,
      }));
      setImgData(updatedImgData);
    });
  };

  const handleDelete = async(rowData) => {
    const token = await getApiToken();
    Swal.fire({
      text: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoaderOpen(true);
        axios
          .delete(`${BASE_URL}posts/${rowData._id}`,{
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
      })
          .then((response) => {
            if (response.data.status) {
              setLoaderOpen(false);
              Swal.fire({
                position: "center",
                icon: "success",
                toast: true,
                title: "Post deleted successfully",
                showConfirmButton: false,
                timer: 1500,
              });
              handleClose();
              getAllImgList();
            } else {
              setLoaderOpen(false);
              Swal.fire({
                position: "center",
                icon: "error",
                toast: true,
                title: "Failed",
                text: "Failed to Delete Post",
                showConfirmButton: true,
              });
            }
          })
          .catch((error) => {
            setLoaderOpen(false);
            Swal.fire({
              position: "center",
              icon: "error",
              toast: true,
              title: "Failed",
              text: error,
              showConfirmButton: true,
            });
          });
      }
    });
  };

  React.useEffect(() => {
    getAllImgList();
  }, []);

  const columns = [
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      sortable:false,
      renderCell: (params) => (
        <strong>
          <IconButton color="primary" onClick={() => handleUpdate(params.row)}>
            <EditNoteIcon />
          </IconButton>
          <Button
            size="medium"
            sx={{ color: "red" }}
            onClick={() => handleDelete(params.row)}
          >
            <DeleteForeverIcon />
          </Button>
        </strong>
      ),
    },

    { field: "id", headerName: "SR.NO", width: 90, sortable: true },
    { field: "Name", headerName: "Name", width: 250 ,sortable:false },
    { field: "NameL1", headerName: "Name", width: 250 ,sortable:false },
    { field: "Description", headerName: "Description", width: 300 ,sortable:false} ,
    { field: "DescriptionL1", headerName: "Description", width: 300 ,sortable:false},
    {
      field: "Status",
      headerName: "Status",
      width: 100,
      sortable: false,
      valueGetter: (params) =>
        params.row.Status === 1 ? "Active" : "Inactive",
      renderCell: (params) => {
        const isActive = params.row.Status === 1;
        return (
          <button
            style={isActive ? activeButtonStyle : inactiveButtonStyle}
            disabled
          >
            {isActive ? "Active" : "Inactive"}
          </button>
        );
      },
    },
    
  ];

  const buttonStyles = {     // Status
    border: "none",
    borderRadius: "4px",
    padding: "4px 8px",
    fontSize: "12px",
    cursor: "pointer",
    color: "#fff",
    width:55,

  };

  const activeButtonStyle = {     // Status
    ...buttonStyles,
    backgroundColor: "green",
  };

  const inactiveButtonStyle = {     // Status
    ...buttonStyles,
    backgroundColor: "#dc3545",
  };

  const handleUpdate = (rowData) => {
    setSaveUpdateButton("UPDATE");
    setOn(true);
    setData({
      Name: rowData.Name,
      Description: rowData.Description,
      NameL1: rowData.NameL1,
      DescriptionL1: rowData.DescriptionL1,
      Id: rowData._id,
      Category:"en",
    });
  };

  return (
    <>
      {loaderOpen && <Loader open={loaderOpen} />}
      <Modal open={on} onClose={handleClose}
      sx={{
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      }}
      >
        <Paper
          elevation={10}
          sx={{
            width: "90%",
            maxWidth: 400,
            // bgcolor: "#E6E6FA",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            justifyContent: "center",
          }}
        >
          <Grid
            container
            item
            xs={12}
            spacing={4}
            display={"flex"}
            flexDirection={"column"}
            padding={3}
            justifyContent={"center"}
          >
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontWeight="bold">Add Posts</Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon   />
              </IconButton>
            </Grid>

            <Grid item xs={12}>
              <FormControl
                sx={{ width: "110px" }}
                size="small"
                disabled={SaveUpdateButton === "SAVE"}
              >
                <InputLabel id="demo-select-large-Choose-Lang">
                  Select Lang
                </InputLabel>

                <Select
                  id="Category"
                  label="Category"
                  name="Category"
                  onChange={onChangeHandler}
                  value={data.Category}
                  disabled={SaveUpdateButton === "SAVE"}
                >
                  <MenuItem key="en" value="en">
                    English
                  </MenuItem>
                  <MenuItem key="mr" value="mr">
                    Marathi
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                size="small"
                spacing={"5"}
                // required
                fullWidth
                id="Name"
                label="Enter Name"
                name={data.Category==="en"?"Name":"NameL1"}
                value={data.Category==="en"? data.Name:data.NameL1}
                onChange={onChangeHandler}
                autoFocus
                style={{ borderRadius: 10, width: "100%" }}
              />
            </Grid>

            <Grid item xs={12} paddingTop={1}>
              <TextField
                size="small"
                // required
                fullWidth
                id="Description"
                label="Enter Description"
                name={data.Category === "en"?"Description":"DescriptionL1"}
                value={
                  data.Category === "en" ? data.Description : data.DescriptionL1
                }
                onChange={onChangeHandler}
                multiline
                rows={5}
                placeholder="Enter your Description..."
              />
            </Grid>

            <Grid item xs={12} md={12} textAlign={"end"}>
              <Button
                type="submit"
                size="small"
                onClick={handleSubmitForm}
                sx={{
                  marginTop: 1,
                  p: 1,
                  width: 80,
                  color: "white",
                  boxShadow: 5,
                  backgroundColor: "#5C5CFF",
                  "&:hover": {
                    backgroundColor: "#E6E6FA",
                    border: "1px solid #5C5CFF",
                    color: "#5C5CFF",
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
        className="slide-in-text"
          width={"100%"}
          textAlign="center"
          textTransform="uppercase"
          fontWeight="bold"
          // color={"#5C5CFF"}
          padding={1}
          noWrap
        >
          Manage posts
        </Typography>
      </Grid>

      <Grid textAlign={"end"} marginBottom={1}>
        <Button
          onClick={handleOnSave}
          type="text"
          size="medium"
          sx={{
            pr: 2,
            // mb: 2,
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
          <AddIcon />
          Add posts
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
        <Box sx={{ height: 500, width: "100%", elevation: 4 }}>
          <DataGrid
            className="datagrid-style"
            rows={imgData}
            columns={columns}
            autoHeight
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 7,
                },
              },
            }}
            pageSizeOptions={[7]}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor:theme=>theme.palette.custome.datagridcolor
              },
              "& .MuiDataGrid-row:hover": {
                boxShadow: "0px 4px 20px rgba(0, 0, 0.2, 0.2)", 
             },
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default ManagePosts;
