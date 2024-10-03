import AddIcon from "@mui/icons-material/Add";
// import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import { Chip, InputAdornment } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Paper,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import * as React from "react";
import Swal from "sweetalert2";
import Loader from "../components/Loader";
import { BASE_URL } from "../Constant";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import Stack from "@mui/material/Stack";

export default function ManageSubscription() {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [imgData, setImgData] = React.useState([]);
  const [on, setOn] = React.useState(false);
  const [features, setFeatures] = React.useState([]);
  const [inputValue, setInputValue] = React.useState("");
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [AddUpdateFeactures, setAddUpdateFeactures] = React.useState("EDIT ");

  const [innerModalOpen, setInnerModalOpen] = React.useState(false);
  const handleInnerModalClose = () => setInnerModalOpen(false);
  const [open, setOpen] = React.useState(false);

  const [data, setData] = React.useState({
    Name: "",
    Description: "",
    NameL1: "",
    DescriptionL1: "",
    Id: "",
    Features: "",
    FeaturesL1: "",
    Category: "en",
    CreatedDate: "",
    Duration: "",
    ModifiedDate: "",
    // Status:"",
    Price: "",
  });

  const clearFormData = () => {
    setData({
      Name: "",
      Description: "",
      NameL1: "",
      DescriptionL1: "",
      Id: "",
      Features: "",
      FeaturesL1: "",
      Category: "en",
      CreatedDate: "",
      ModifiedDate: "",
      Duration: "",
      Status: 1,
      Price: "",
    });
    setFeatures([]);
  };

  const handleClose = () => {
    setOn(false);
  };

  const handleOnSave = () => {
    setSaveUpdateButton("SAVE");
    setAddUpdateFeactures("Add Feacture");
    setOn(true);
    clearFormData();
    setData({
      Id: "",
      Name: "",
      Description: "",
      NameL1: "",
      DescriptionL1: "",
      Features: [],
      FeaturesL1: [],
      Category: "en",
      CreatedDate: "",
      ModifiedDate: "",
      Status: 1,
      Price: "",
      Duration: "",
    });
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target || {};
    if (name) {
      setData({
        ...data,
        [name]: value,
      });
    } else {
      console.error("Event target is undefined or missing 'name' property");
    }
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

  const handleSubmitForm = () => {
    const requiredFields = ["Name", "Description", "Duration", "Price"];
    const emptyRequiredFields = requiredFields.filter(
      // (field) => !data[field].trim()
      (field) => {
        const value = data[field];
        return typeof value === "string" && !value.trim();
      }
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
      Features: features,
      FeaturesL1: [],
      CreatedDate: data.CreatedDate,
      ModifiedDate: data.ModifiedDate,
      Duration: data.Duration,
      Price: data.Price,
      Status: data.Status,
    };

    const UpdateObj = {
      Name: data.Name,
      Description: data.Description,
      NameL1: data.NameL1,
      DescriptionL1: data.DescriptionL1,
      Features: data.Category === "en" ? features : data.Features,
      FeaturesL1: data.Category === "mr" ?  features: data.FeaturesL1,
      CreatedDate: data.CreatedDate,
      ModifiedDate: data.ModifiedDate,
      Duration: data.Duration,
      Price: data.Price,
      Status: data.Status,
    };
console.log(UpdateObj);


    return;

    setLoaderOpen(true);

    const axiosRequest =
      SaveUpdateButton === "SAVE"
        ? axios.post(`${BASE_URL}subscriptionplan`, saveObj)
        : Swal.fire({
            text: "Do you want to Update...?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Update it!",
          }).then((result) => {
            if (result.isConfirmed) {
              return axios.patch(
                `${BASE_URL}subscriptionplan/${data.Id}`,
                UpdateObj
              );
            } else {
              throw new Error("Update cancelled");
            }
          });
    console.log("ktn plan", saveObj);

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
                ? "Plan Added Successfully"
                : "Plan Updated Successfully",

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

  const getAllImgList = () => {
    axios.get(`${BASE_URL}subscriptionplan/`).then((response) => {
      const updatedImgData = response.data.values.flat().map((item, index) => ({
        ...item,
        id: index + 1,
      }));
      setImgData(updatedImgData);
    });
  };

  const handleDelete = (rowData) => {
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
          .delete(`${BASE_URL}subscriptionplan/${rowData._id}`)
          .then((response) => {
            if (response.data.status) {
              setLoaderOpen(false);
              Swal.fire({
                position: "center",
                icon: "success",
                toast: true,
                title: "Plan Deleted Successfully",
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

  const handleProfileClose = () => {
    setOpen(false);
  };
  React.useEffect(() => {
    getAllImgList();
  }, []);

  const columns = [
    {
      field: "actions",
      headerName: "Action",
      width: 120,
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

    { field: "id", headerName: "SR.NO", width: 100, sortable: true },
    { field: "Name", headerName: "Name", width: 180, sortable: false },
    { field: "NameL1", headerName: "Name", width: 180, sortable: false },
    {
      field: "Description",
      headerName: "Description",
      width: 250,
      sortable: false,
    },
    {
      field: "DescriptionL1",
      headerName: "Description",
      width: 250,
      sortable: false,
    },
    { field: "Features", headerName: "Features", width: 200, sortable: false },
    {
      field: "FeaturesL1",
      headerName: "Features",
      width: 300,
      sortable: false,
    },
    { field: "Duration", headerName: "Duration", width: 100 },
    { field: "Price", headerName: "Price", width: 100, sortable: false },

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

  const buttonStyles = {
    border: "none",
    borderRadius: "4px",
    padding: "4px 8px",
    fontSize: "12px",
    cursor: "pointer",
    color: "#fff",
  };

  const activeButtonStyle = {
    ...buttonStyles,
    backgroundColor: "green",
  };

  const inactiveButtonStyle = {
    ...buttonStyles,
    backgroundColor: "red",
  };

  const handleUpdate = (rowData) => {
    console.log(rowData);

    setSaveUpdateButton("UPDATE");
    setAddUpdateFeactures("Edit Feactures");
    setOn(true);
    setData({
      Name: rowData.Name,
      Description: rowData.Description,
      NameL1: rowData.NameL1,
      Features: rowData.Features,
      FeaturesL1: rowData.FeaturesL1,

      Duration: rowData.Duration,
      Price: rowData.Price,
      DescriptionL1: rowData.DescriptionL1,
      Id: rowData._id,
      CreatedDate: rowData.CreatedDate,
      Category: "en",
    });
    setFeatures(rowData.Features);
  };

  const handleFeatureAdd = () => {
    if (inputValue.trim() !== "") {
      setFeatures((prevFeatures) => [...prevFeatures, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
    onChangeHandler(e);
  };

  const handlefeactureDelete = (featureToDelete) => {
    setFeatures((prevFeatures) =>
      prevFeatures.filter((feature) => feature !== featureToDelete)
    );
  };

  return (
    <>
      {loaderOpen && <Loader open={loaderOpen} />}
      <Modal open={on} onClose={handleClose}>
        <Paper
          elevation={10}
          sx={{
            width: "100%",
            maxWidth: 450,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            justifyContent: "center",
          }}
        >
          <Grid
            container
            p={3}
            rowSpacing={2}
            justifyContent="center"
            flexDirection={"column"}
          >
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontWeight="bold">Add Subscription Plan</Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Grid>

            <Grid item xs={12}>
              <FormControl size="small" disabled={SaveUpdateButton === "SAVE"}>
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
                fullWidth
                required
                size="small"
                id="name"
                label="Enter Name"
                autoFocus
                name={data.Category === "en" ? "Name" : "NameL1"}
                value={data.Category === "en" ? data.Name : data.NameL1}
                onChange={onChangeHandler}
                style={{ borderRadius: 10, width: "100%" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                size="small"
                id="Price"
                type="number"
                label="Enter Price"
                name={data.Category === "en" ? "Price" : "Price"}
                value={data.Category === "en" ? data.Price : data.Price}
                onChange={onChangeHandler}
                style={{ borderRadius: 10, width: "100%" }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                size="small"
                id="Duration"
                type="number"
                label="Enter Duration(in Days)"
                name={data.Category === "en" ? "Duration" : "Duration"}
                value={data.Category === "en" ? data.Duration : data.Duration}
                onChange={onChangeHandler}
                style={{ borderRadius: 10, width: "100%" }}
              />
            </Grid>
            <Grid item xs={12}>
             
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Enter Description"
                id="Description"
                rows={3}
                name={data.Category === "en" ? "Description" : "DescriptionL1"}
                value={
                  data.Category === "en" ? data.Description : data.DescriptionL1
                }
                onChange={onChangeHandler}
                multiline
                placeholder="Enter your Description..."
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                size="small"
                endIcon={<AddIcon sx={{ color: "white" }} />}
                onClick={() => setInnerModalOpen(true)}
                sx={{
                  marginTop: 1,
                  p: 1,
                  width: 160,
                  color: "white",
                  boxShadow: 3,
                  backgroundColor: "#7C7CFF",
                  "&:hover": {
                    backgroundColor: "#E6E6FA",
                    border: "1px solid #5C5CFF",
                    color: "#5C5CFF",
                  },
                }}
              >
                {AddUpdateFeactures}
                {/* Add Features */}
              </Button>
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
          </Grid>
        </Paper>
      </Modal>

      <Modal open={innerModalOpen} onClose={handleInnerModalClose}>
        <Paper
          elevation={10}
          sx={{
            width: "80%",
            maxWidth: 400,
            p: 2,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            justifyContent: "center",
          }}
        >
          <Grid
            container
            p={3}
            rowSpacing={2.2}
            justifyContent="center"
            flexDirection={"column"}
          >
            <Typography fontWeight="bold">Add Feactures</Typography>
            <Grid item xs={12}>
              <TextField
                style={{ borderRadius: 10, width: "100%" }}
                fullWidth
                multiline
                label="Add Feature"
                id="Features"
                size="small"
                name={inputValue.Category === "en" ? "Features" : "FeaturesL1"}
                value={
                  inputValue.Category === "en"
                    ? inputValue.Features
                    : inputValue.FeaturesL1
                }
                onChange={handleChange}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleFeatureAdd();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleFeatureAdd}>
                        <AddIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {features.length > 0 && (
                <Box
                  sx={{
                    maxHeight: 100,
                    overflowY: "auto",
                    marginTop: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    width: "100%",
                  }}
                >
                  <List>
                    {features.map((feature, index) => (
                      <ListItem key={index} sx={{ padding: 0 }}>
                        <ListItemText
                          primary={
                            <Stack
                              direction="row"
                              spacing={0}
                              sx={{ width: "100%" }}
                            >
                              <Chip
                                label={feature}
                                onDelete={() => handlefeactureDelete(feature)}
                                deleteIcon={<CancelIcon />}
                              />
                            </Stack>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Grid>
            <Grid item sx={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  sx={{
                    marginTop: 1,
                    p: 1,
                    width: 75,
                    color: "white",
                    boxShadow: 3,
                    backgroundColor: "#E06666",
                    "&:hover": {
                      backgroundColor: "#E6E6FA",
                      border: "1px solid #E06666",
                      color: "#E06666",
                    },
                  }}
                  // variant="contained"
                  onClick={handleInnerModalClose}
                >
                  Close
                </Button>
                <Button
                  sx={{
                    marginTop: 1,
                    p: 1,
                    width: 75,
                    color: "white",
                    boxShadow: 3,
                    backgroundColor: "#7C7CFF",
                    "&:hover": {
                      backgroundColor: "#E6E6FA",
                      border: "1px solid #5C5CFF",
                      color: "#5C5CFF",
                    },
                  }}
                  variant="contained"
                  onClick={handleInnerModalClose}
                >
                  SAVE
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
      <Grid
        container
        md={12}
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
          className="slide-in-text"
          width={"100%"}
          textAlign="center"
          textTransform="uppercase"
          fontWeight="bold"
          // color={"#5C5CFF"}
          padding={1}
          noWrap
        >
          Manage Subscription
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
          Subscription
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
        <Box sx={{ height: 510, width: "100%", elevation: 4 }}>
          <DataGrid
            className="datagrid-style"
            rows={imgData}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 7,
                },
              },
            }}
            pageSizeOptions={[7]}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: (theme) => theme.palette.custome.datagridcolor,
              },
            }}
          />
        </Box>
      </Paper>
    </>
  );
}
