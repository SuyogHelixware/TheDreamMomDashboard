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
// import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import CancelIcon from "@mui/icons-material/Cancel";
import Stack from "@mui/material/Stack";

export default function ManageSubscription() {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [imgData, setImgData] = React.useState([]);
  const [on, setOn] = React.useState(false);
  const [features, setFeatures] = React.useState([]);
  const [inputValue, setInputValue] = React.useState("");
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
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
      Status: 1,
      Price: "",
    });
  };

  const handleClose = () => {
    setOn(false);
  };

  const handleOnSave = () => {
    setSaveUpdateButton("SAVE");
    setOn(true);
    clearFormData();
    setData({
      Id: "",
      Name: "",
      Description: "",
      NameL1: "",
      DescriptionL1: "",
      Features: "",
      FeaturesL1: "",
      Category: "en",
      CreatedDate: "",
      ModifiedDate: "",
      Status: 1,
      Price: "",
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
      Features: data.Features,
      FeaturesL1: data.FeaturesL1,
      CreatedDate: data.CreatedDate,
      ModifiedDate: data.ModifiedDate,
      Price: data.Price,

      Status: data.Status,
    };
    const UpdateObj = {
      Name: data.Name,
      Description: data.Description,
      NameL1: data.NameL1,
      DescriptionL1: data.DescriptionL1,
      Features: data.Features,
      FeaturesL1: data.FeaturesL1,
      CreatedDate: data.CreatedDate,
      ModifiedDate: data.ModifiedDate,
      Price: data.Price,

      Status: data.Status,
    };

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

  React.useEffect(() => {
    getAllImgList();
  }, []);

  const columns = [
    {
      field: "actions",
      headerName: "Action",
      width: 150,
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
    { field: "Name", headerName: "Name", width: 250, sortable: false },
    // { field: "NameL1", headerName: "Name", width: 250 ,sortable: false},
    {
      field: "Description",
      headerName: "Description",
      width: 300,
      sortable: false,
    },
    // { field: "DescriptionL1", headerName: "Description", width: 300 ,sortable: false},
    { field: "Features", headerName: "Features", width: 200, sortable: false },
    // { field: "FeaturesL1", headerName: "Features", width: 300 ,sortable: false},
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
          <span style={{ color: isActive ? "green" : "red" }}>
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },
  ];

  const handleUpdate = (rowData) => {
    setSaveUpdateButton("UPDATE");
    setOn(true);
    setData({
      Name: rowData.Name,
      Description: rowData.Description,
      NameL1: rowData.NameL1,
      Features: rowData.Features,
      Price: rowData.Price,
      DescriptionL1: rowData.DescriptionL1,
      Id: rowData._id,
      CreatedDate: rowData.CreatedDate,
      Category: "en",
    });
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
            width: "90%",
            maxWidth: 450,
            // bgcolor: "#E6E6FA",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            // padding: 4,
            justifyContent: "center",
          }}
        >
          <Grid
            container
            p={3}
            rowSpacing={2.2}
            columnSpacing={2}
            textAlign={"center"}
            justifyContent="center"
          >
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontWeight="bold">Add Plans</Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon   />
              </IconButton>
            </Grid>
            {/* ----------------------------------------------------- */}
            {/* <Grid item xs={12}>
              <FormControl
                // sx={{ width: "100px"  }}
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
            </Grid> */}
            {/* ------------------------------------------------------ */}
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
                name={data.Category === "en" ? "Price" : "NameL1"}
                value={data.Category === "en" ? data.Price : data.NameL1}
                onChange={onChangeHandler}
                style={{ borderRadius: 10, width: "100%" }}
              />
            </Grid>

            
            <Grid item xs={12}>
              <TextField
                style={{ borderRadius: 10, width: "100%" }}
                fullWidth
                multiline
                label="Add Feature"
                id="Features"
                size="small"
                name={data.Category === "en" ? "Features" : "NameL1"}
                value={inputValue}
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

            

            {/* <Grid item xs={6}>
              <DatePickerField
                id="CreatedDate"
                label="Start Date"
                name={data.Category.CreatedDate}
                value={data.Category.CreatedDate}
                onChange={onChangeHandler}
              />
            </Grid>
            <Grid item xs={6}>
              <DatePickerField id="DocumentDate" label="End Date" />
            </Grid> */}

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
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor:theme=>theme.palette.custome.datagridcolor
              },
            }}
          />
        </Box>
      </Paper>
    </>
  );
}
