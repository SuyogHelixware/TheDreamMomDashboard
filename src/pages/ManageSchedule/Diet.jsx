import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  Card,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Pagination,
  Paper,
  Select,
  styled,
} from "@mui/material";

import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import * as React from "react";
import { BASE_URL, Bunny_Image_URL, Bunny_Storage_URL } from "../../Constant";
import Swal from "sweetalert2";

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

const ManageDiet = () => {
  const [uploadedImg, setUploadedImg] = React.useState("");
  const [imgData, setImgData] = React.useState([]);
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [page, setPage] = React.useState(1);
  const [tags, setTags] = React.useState([]);
  const [selectedTags, setSelectedTags] = React.useState([]);

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

  const handleChange = (event) => {
    setSelectedTags(event.target.value);
    console.log(event.target.value);
  };


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log("Uploaded file:", file);
    setUploadedImg(file);

    setData((prevData) => ({
      ...prevData,
      Image: file.name,
    }));
  };

  const handleClose = () => {
    setOn(false);
  };

  // const handleClick = (item) => {
  //   setData({
  //     id: item.id,
  //     Name: item.Name,
  //     Description: item.Description,
  //     Image: item.Image,
  //     TagsIds: item.TagsIds,
  //     Status: item.Status,
  //   });
  //   setSaveUpdateButton("Update");
  //   setOn(true);
  // };

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
    const filename = new Date().getTime() + "_" + uploadedImg.name;
    const saveObj = {
      Name: data.Name,
      Description: data.Description,
      Image: filename,
      TagsIds: selectedTags.map((tag) => tag._id),
    };
    console.log(saveObj);
    const UpdateObj = {
      Name: data.Name,
      Description: data.Description,
      Image: data.Image,
      TagsIds: selectedTags.map((tag) => tag._id),
    };

    if (SaveUpdateButton === "SAVE") {
      axios
        .request({
          method: "PUT",
          maxBodyLength: Infinity,
          url: `https://storage.bunnycdn.com/thedreammomstoragezone1/Schedule/Diet/${filename}`,
          headers: {
            "Content-Type": "image/jpeg",
            AccessKey: "eb240658-afa6-44a1-8b32cffac9ba-24f5-4196",
          },
          data: uploadedImg,
        })
        .then((response) => {
          console.log(response);
          axios
            .post(`${BASE_URL}diet`, saveObj)
            .then((response) => {
              console.log(response.data);
              getAllImgList();
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        });
    } else {

      console.log(UpdateObj)
      axios
        .request({
          method: "PUT",
          maxBodyLength: Infinity,
          url: `https://storage.bunnycdn.com/thedreammomstoragezone1/Schedule/Diet/${data.Image}`,
          headers: {
            "Content-Type": "image/jpeg",
            AccessKey: "eb240658-afa6-44a1-8b32cffac9ba-24f5-4196",
          },
          data: uploadedImg,
        })
        .then((response) => {
          axios
            .patch(`${BASE_URL}diet/${data.Id}`, UpdateObj)
            .then((response) => {
              console.log(response.data);
              getAllImgList();
            })
            .catch((error) => {
              console.error("Error deleting data:", error);
            });
        });
    }
    handleClose();
  };
  
  const getAllImgList = () => {
    axios.get(`${BASE_URL}diet/`).then((response) => {
      setImgData(response.data.values.flat());
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
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${Bunny_Storage_URL}/Schedule/diet/${data.Image}`, {
            headers: {
              AccessKey: "eb240658-afa6-44a1-8b32cffac9ba-24f5-4196",
            },
          })
          .then((response) => {
            console.log(data._id);
            axios
              .delete(`${BASE_URL}diet/${data._id}`)
              .then((response) => {
                console.log("Node API Data Deleted successfully:", response.data);
                getAllImgList();
                Swal.fire({
                  icon: "success",
                  title: "Success",
                  text: "Data deleted successfully",
                });
              })
              .catch((error) => {
                console.error("Error deleting data:", error);
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Something went wrong while deleting data from the server!",
                });
              });
          })
          .catch((error) => {
            console.error("Error deleting data from storage:", error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong while deleting data from storage!",
            });
          });
      }
    });
  };

  const handleUpdate = (data) => {
    setSaveUpdateButton("UPDATE");
    setOn(true);
    setSelectedTags(data.TagsIds)
    setData({
      Name: data.Name,
      Description: data.Description,
      Image: data.Image,
      Id: data._id,
      TagsIds: data.TagsIds,
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

  // const isSubmitDisabled = () => {
  //   if (data.Name && data.Description && data.Tag) {
  //     return false;
  //   } else {
  //     // console.log("Please fill all fields");
  //     return true;
  //   }
  // };

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
              <Typography fontWeight="bold">Add Diet</Typography>
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
                  multiple
                  value={selectedTags}
                  onChange={handleChange}
                  renderValue={(selected) => (
                    <div>
                      {selected.map((value) => (
                        <Chip
                          key={value._id}
                          label={tags.find((tag) => tag._id === value._id).Name}
                        />
                      ))}
                    </div>
                  )}
                  style={{ textAlign: "left" }}
                  MenuProps={{ PaperProps: { style: { maxHeight: 150 } } }}
                >
                  {tags.map((item) => (
                    <MenuItem key={item._id} value={item}>
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

<Grid item xs={12}>
              <Button
                fullWidth
                onChange={handleFileUpload}
                component="label"
                role={undefined}
                // disabled={isSubmitDisabled()}
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
                <Typography
                  noWrap
                  style={{ width: "80%", textAlign: "center" }}
                >
                  {SaveUpdateButton === "UPDATE"
                    ? data.Image
                    : uploadedImg && uploadedImg.name
                    ? uploadedImg.name
                    : "Upload File"}
                </Typography>
                <VisuallyHiddenInput type="file" />
              </Button>
            </Grid>

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
          Manage Diet
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
          Add Diet
        </Button>
      </Grid>

      <Grid container spacing={3} justifyContent="start">
        {Array.isArray(imgData) &&
          imgData.slice(startIndex, endIndex).map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card sx={{ width: "100%" }}>
                <img
                  height="100%"
                  width="100%"
                  src={`${Bunny_Image_URL}/Schedule/Diet/${item.Image}`}
                  alt="img"
                  title={item.Name}
                />
                <CardContent>
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
      </Grid>

      <Grid container spacing={3} width="100%" pt={5}>
        <Grid item xs={12}>
          <Pagination
            count={Math.ceil(19 / 8)}
            color="primary"
            page={page}
            onChange={handlePageChange}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default ManageDiet;
