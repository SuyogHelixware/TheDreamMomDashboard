import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  styled,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import * as React from "react";
import { BASE_URL } from "../../Constant";

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

const Medication = () => {
  const [uploadedImg, setUploadedImg] = React.useState("");
  const [imgData, setImgData] = React.useState({
    Name: "",
    Description: "",
    Image: "",
  });
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [page, setPage] = React.useState(1);
  const [tags, setTags] = React.useState([]);
  const cardsPerPage = 8;
  const [data, setData] = React.useState({
    Name: "",
    Description: "",
    Image: "",
    Id: "",
  });

  const clearFormData = () => {
    setData({
      Id: "",
      Name: "",
      Description: "",
      Image: "",
      TagsIds: [],
      Status: 1,
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log("Uploaded file:", file);
    setUploadedImg(file);

    setData((prevData) => ({
      ...prevData,
    }));
  };

  const handleClose = () => {
    setOn(false);
  };

  const handleClick = (item) => {
    setData({
      id: item.id,
      Name: item.Name,
      Description: item.Description,
      TagsIds: item.TagsIds,
      Status: item.Status,
    });
    setSaveUpdateButton("Update");
    setOn(true);
  };

  const handleOnSave = () => {
    setSaveUpdateButton("SAVE");
    setOn(true);
    clearFormData();
    setData([]);
  };

  const onchangeHandler = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmitForm = () => {
    const saveObj = {
      Name: data.Name,
      Description: data.Description,
    };
    const UpdateObj = {
      Name: data.Name,
      Description: data.Description,
    };
  
    let requestPromise;
    if (SaveUpdateButton === "SAVE") {
      requestPromise = axios.post(`${BASE_URL}medications`, saveObj);
    } else {
      requestPromise = axios.patch(`${BASE_URL}Medications/${data.Id}`, UpdateObj);
    }
  
    requestPromise
      .then((response) => {
        console.log(response.data);
        getAllImgList();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data saved successfully",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      })
      .finally(() => {
        handleClose();
      });
  };

  const getAllImgList = () => {
    axios.get(`${BASE_URL}Medications/`).then((response) => {
      const updatedImgData = response.data.values.flat().map((item, index) => ({
        ...item,
        id: index + 1, // You can use any unique identifier here, like item._id if available
      }));
      setImgData(updatedImgData);
    });
  };

  const getTagData = () => {
    axios.get(`${BASE_URL}tags`).then((response) => {
      setTags(response.data.values);
      // console.log(response.data.values.flat());
    });
  };


  const handleDelete = (data) => {
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
          .delete(`${BASE_URL}Medications/${data._id}`)
          .then((response) => {
            console.log("Node API Data Deleted successfully:", response.data);
            getAllImgList();
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Data deleted successfully",
              showConfirmButton: false,
              timer: 2500,
            });
          })
          .catch((error) => {
            console.error("Error deleting data:", error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          });
      }
    });
  };
  const columns = [
    {
      field: "actions",
      headerName: "Action",
      width: 250,
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
    { field: "Name", headerName: "Title", width: 250 },
    { field: "Description", headerName: "Description", width: 300 },
   
  ];

  const handleUpdate = (data) => {
    setSaveUpdateButton("UPDATE");
    setOn(true);
    setData({
      Name: data.Name,
      Description: data.Description,
      Image: data.Image,
      Id: data._id,
    });
    console.log(data);
  };

  React.useEffect(() => {
    getAllImgList();
  }, []);

  React.useEffect(() => {
    getTagData();
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const isSubmitDisabled = () => {
    if (data.Name && data.Description && data.Tag) {
      return false;
    } else {
      // console.log("Please fill all fields");
      return true;
    }
  };

  const startIndex = (page - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 3,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 6,
  });
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
            item
            xs={12}
            spacing={2}
            display={"flex"}
            flexDirection={"column"}
            padding={4}
            justifyContent={"center"}
          >
            <Grid item xs={12}>
              <Typography fontWeight="bold">Add MedicalTest</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                spacing={"5"}
                required
                fullWidth
                id="Name"
                label="Enter Name"
                name="Name"
                value={data.Name}
                onChange={onchangeHandler}
                autoFocus
                style={{ borderRadius: 10, width: "100%" }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth size="small" required>
                <InputLabel id="demo-select-small-label">
                  Select Type
                </InputLabel>

                <Select
                  labelId="ChooseType"
                  id="Tag"
                  label="Tag"
                  name="Tag"
                  onChange={onchangeHandler}
                  style={{ textAlign: "left" }}
                  MenuProps={{ PaperProps: { style: { maxHeight: 150 } } }}
                >
                  {tags.map((item) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} paddingTop={1}>
              <TextField
                size="small"
                required
                fullWidth
                id="Description"
                label="Enter Description"
                name="Description"
                value={data.Description}
                onChange={onchangeHandler}
                multiline
                rows={3}
                placeholder="Enter your Description..."
              />
            </Grid>

            {/* <Grid item xs={12} lg={12}>
              <input
                accept="image/*"
                id="contained-button-file"
                type="file"
                onChange={handleFileUpload}
                style={{ display: "none" }} 
              />
              <label htmlFor="contained-button-file">
                <Button
                  fullWidth
                  variant="contained"
                  component="span"
                  disabled={isSubmitDisabled()}
                  sx={{
                    backgroundColor: "#8F00FF",
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: "#3B444B",
                    },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <CloudUploadIcon sx={{ marginRight: 1 }} />
                  <Typography noWrap>
                    {uploadedImg && uploadedImg.name
                      ? uploadedImg.name
                      : "Upload File"}
                  </Typography>
                </Button>
              </label>
            </Grid> */}
            {/* 
            <Grid item xs={12}>
              <Button
                fullWidth
                onChange={handleFileUpload}
                component="label"
                role={undefined}
                disabled={isSubmitDisabled()}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                sx={{
                  backgroundColor: "#8F00FF",

                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "#3B444B",
                  },
                }}
              >
                <Typography noWrap width={"80%"}>
                  {SaveUpdateButton === "UPDATE"
                    ? data.Image
                    : uploadedImg && uploadedImg.name
                    ? uploadedImg.name
                    : "Upload File"}
                </Typography>

                <VisuallyHiddenInput type="file" />
              </Button>
            </Grid> */}

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
        // xs={12}
        // sm={6}
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
          width={"100%"}
          textAlign="center"
          textTransform="uppercase"
          fontWeight="bold"
          color={"#673AB7"}
          padding={1}
          noWrap
        >
          Manage MedicalTest
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
          Add MedicalTest
        </Button>
      </Grid>

      {/* <Grid container spacing={3} justifyContent="start">
        {Array.isArray(imgData) &&
          imgData.slice(startIndex, endIndex).map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card sx={{ width: "100%" }}> */}
      {/* <img
                  height="100%"
                  width="100%"
                  src={`${Bunny_Image_URL}/Schedule/MedicalTest/${item.Image}`}
                  alt="img"
                  title={item.Name}
                /> */}
      {/* <CardContent>
                  <Typography
                    noWrap
                    height={25}
                    gutterBottom
                    component="div"
                    textAlign={"start"}
                  >
                    <b>Title:{item.Name}</b>
                  </Typography>
                  <Typography
                    textAlign={"start"}
                    variant="body2"
                    style={styles.typography}
                    color="textSecondary"
                    component="div"
                  >
                    <b>Description: </b> {item.Description}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{
                    pt: "0",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => handleUpdate(item)}
                  >
                    <EditNoteIcon />
                  </IconButton>

                  <Button
                    size="medium"
                    sx={{ color: "red" }}
                    onClick={() => handleDelete(item)}
                  >
                    <DeleteForeverIcon />
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid> */}
      {/* 
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(imgData) &&
              imgData.slice(startIndex, endIndex).map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.Name}</TableCell>
                  <TableCell>{item.Description}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleUpdate(item)}
                    >
                      <EditNoteIcon />
                    </IconButton>
                    <Button
                      size="medium"
                      sx={{ color: "red" }}
                      onClick={() => handleDelete(item)}
                    >
                      <DeleteForeverIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer> */}
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
          rows={imgData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          autoHeight
        />
      </Box>
      </Paper>
    </>
  );
};

export default Medication;
