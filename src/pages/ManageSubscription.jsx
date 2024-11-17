import AddIcon from "@mui/icons-material/Add";
// import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import { Chip, InputAdornment } from "@material-ui/core";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import {
  CardActions,
  CardContent,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Modal,
  Pagination,
  Paper,
  Select,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import * as React from "react";
import Swal from "sweetalert2";
import Loader from "../components/Loader";
import { BASE_URL } from "../Constant";
import Grid2 from "@mui/material/Unstable_Grid2";

const styles = {
  typography: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    height: 40,
  },
};
export default function ManageSubscription() {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [imgData, setImgData] = React.useState([]);
  const [on, setOn] = React.useState(false);
  const [features, setFeatures] = React.useState([]);
  const [inputValue, setInputValue] = React.useState("");
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [AddUpdateFeactures, setAddUpdateFeactures] = React.useState("EDIT ");
  const [page, setPage] = React.useState(1);

  const [innerModalOpen, setInnerModalOpen] = React.useState(false);
  const handleInnerModalClose = () => setInnerModalOpen(false);
  


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

  // ========================
  const getApiToken = async () => {
    const data = sessionStorage.getItem("userData");
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

  const handleSubmitForm = async () => {
    const token = await getApiToken();
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
      FeaturesL1: data.Category === "mr" ? features : data.FeaturesL1,
      CreatedDate: data.CreatedDate,
      ModifiedDate: data.ModifiedDate,
      Duration: data.Duration,
      Price: data.Price,
      Status: data.Status,
    };
    console.log(UpdateObj);
    setLoaderOpen(true);

    const axiosRequest =
      SaveUpdateButton === "SAVE"
        ? axios.post(`${BASE_URL}subscriptionplan`, saveObj, {
            headers: {
              "Content-Type": "application/json",
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
              return axios.patch(
                `${BASE_URL}subscriptionplan/${data.Id}`,
                UpdateObj,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                  },
                }
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

  const getAllImgList = async () => {
    const token = await getApiToken();
    axios
      .get(`${BASE_URL}subscriptionplan/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        const updatedImgData = response.data.values
          .flat()
          .map((item, index) => ({
            ...item,
            id: index + 1,
          }));
        setImgData(updatedImgData);
      });
  };

  const handleDelete = async (rowData) => {
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
          .delete(`${BASE_URL}subscriptionplan/${rowData._id}`, {
            headers: {
              "Content-Type": "application/json",
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
  });

 

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

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const cardsPerPage = 3;

  const startIndex = (page - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

  return (
    <>
      {loaderOpen && <Loader open={loaderOpen} />}
      <Modal
        open={on}
        onClose={handleClose}
        sx={{
          backdropFilter: "blur(5px)",
          // backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
      >
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
            <Grid item xs={12}></Grid>
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
                style={{ borderRadius: 10, width: "100%", display: "flex" }}
                fullWidth
                multiline
                label="Add Feature"
                id="Features"
                size="small"
                name={data.Category === "en" ? "Features" : "FeaturesL1"}
                // value={data.Category === "en" ? data.Features : data.FeaturesL1}
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

      <Grid container spacing={5} justifyContent="start">
        {Array.isArray(imgData) &&
          imgData.slice(startIndex, endIndex).map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3.5} key={index} 
            >
              
              <Grid
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                  borderRadius:"15px",
                  textAlign: "center",
                  border:"1px solid gray",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                  transform: "translateY(-10px)",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.6)",     

                 },
                }}
              > 
                
                <CardContent>
                  <Typography
                    noWrap
                    height={25}
                    gutterBottom
                    component="div"
                    fontSize={"22px"}
                  >
                    <b>{item.Name}</b>
                  </Typography>
                  <Grid2
                    container
                    xs={12}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                  
                    <Grid2
                      item
                      xs={6}
                      sx={{
                        display: "grid",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Typography>Price</Typography>
                      <Typography
                        variant="body5"
                        style={styles.typography}
                        color="textSecondary"
                        component="div"
                        fontSize={30}
                      >
                        <b>{item.Price}</b>
                      </Typography>
                    </Grid2>
                    <Grid2
                      item
                      xs={6}
                      sx={{
                        display: "grid",
                        flexDirection: "column",
                        textAlign: "right",
                      }}
                    >
                      <Typography>Days</Typography>
                      <Typography
                        variant="body2"
                        style={styles.typography}
                        color="textSecondary"
                        component="div"
                        fontSize={30}
                      >
                        {item.Duration}
                      </Typography>
                    </Grid2>
                  </Grid2>
                  <Divider sx={{marginTop:2}} />
                  <Typography
                    variant="body2"
                    style={styles.typography}
                    color="textSecondary"
                    component="div"
                    marginTop={2}
                  >
                    {item.Description}
                  </Typography>
                   
                  <List sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    {item.Features &&
                      Array.isArray(item.Features) &&
                      item.Features.map((feature, index) => (
                        <ListItem key={index} sx={{ padding: 0 }}>
                          <IconButton color="primary">
                            <CheckIcon />
                          </IconButton>
                          <ListItemText
                            primary={
                              <Typography variant="body2">{feature}</Typography>
                            }
                          />
                        </ListItem>
                      ))}
                  </List>
                  <Typography
                    variant="body2"
                    style={styles.typography}
                    color="textSecondary"
                    component="div"
                  ></Typography>
                </CardContent>
                <CardActions
                  sx={{
                    pt: "0",
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "auto",
                  }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => handleUpdate(item)}
                  >
                    <Button sx={{ borderRadius: "25px",backgroundColor:"green" }} variant="contained">
                      Update
                    </Button>
                  </IconButton>

                  <Button
                    size="medium"
                    sx={{ color: "red" }}
                    onClick={() => handleDelete(item)}
                  >
                    <Button variant="contained" sx={{ borderRadius: "25px" }}>
                      Delete
                    </Button>
                  </Button>
                </CardActions>
              </Grid>
            </Grid>
          ))
          }
      </Grid>
      
      <Grid container spacing={3} width="100%" pt={5}>
        <Grid
          item
          xs={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Pagination
            count={Math.ceil(imgData.length / 8)}
            color="primary"
            page={page}
            onChange={handlePageChange}
          />
        </Grid>
      </Grid>

    </>
  );
}
