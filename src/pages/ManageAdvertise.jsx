import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Swal from "sweetalert2";
import CloseIcon from "@mui/icons-material/Close";
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
import {
  BASE_URL,
  Bunny_Image_URL,
  Bunny_Storage_Access_Key,
  Bunny_Storage_URL,
} from "../Constant";
import Loader from "../components/Loader";

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

const ManageAdvertise = () => {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [uploadedImg, setUploadedImg] = React.useState("");
  const [selectedTags, setSelectedTags] = React.useState([]);
  const [imgData, setImgData] = React.useState([]);
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [page, setPage] = React.useState(1);
  const [tags, setTags] = React.useState([]);
  const cardsPerPage = 8;
  const [data, setData] = React.useState({
    Name: "",
    Description: "",
    NameL1: "",
    DescriptionL1: "",
    Category: "en",
    Image: "",
    Id: "",
    Tag: "",
  });

  const clearFormData = () => {
    setData({
      Id: "",
      Name: "",
      Description: "",
      NameL1: "",
      DescriptionL1: "",
      Category: "en",
      Image: "",
      TagsIds: [],
      Status: 1,
      Tag: "",
    });
    setSelectedTags([]);
    setUploadedImg("");
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

  const handleChange = (event) => {
    const selectedTags = event.target.value;
    const uniqueSelectedTags = selectedTags.filter(
      (tag, index, self) => self.findIndex((t) => t._id === tag._id) === index
    );
    setSelectedTags(uniqueSelectedTags);

    const removedTag = selectedTags.find(
      (tag) => selectedTags.filter((t) => t._id === tag._id).length > 1
    );
    if (removedTag) {
      setSelectedTags((prevTags) =>
        prevTags.filter((tag) => tag._id !== removedTag._id)
      );
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploadedImg(file);
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please upload a valid image file",
        toast: true,
        showConfirmButton: true,
      });
      setUploadedImg("");
    }
  };

  const handleClose = () => {
    setOn(false);
  };

  const handleOnSave = () => {
    setSaveUpdateButton("SAVE");
    setOn(true);
    clearFormData();
    setData({
      Name: "",
      Description: "",
      NameL1: "",
      DescriptionL1: "",
      Category: "en",
      Image: "",
      Id: "",
      Tag: "",
    });
  };

  const onchangeHandler = (event) => {
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

  const handleSubmitForm = async () => {
    const requiredFields = ["Name", "Description"];
    const emptyRequiredFields = requiredFields.filter(
      (field) => !data[field] || !data[field].trim()
    );
    if (emptyRequiredFields.length > 0 || selectedTags.length === 0) {
      validationAlert("Please fill in all required fields");
      return;
    }

    const filename = new Date().getTime() + "_" + uploadedImg.name;
    const saveObj = {
      Name: data.Name,
      Description: data.Description,
      NameL1: data.NameL1,
      DescriptionL1: data.DescriptionL1,
      Image: filename,
      TagsIds: selectedTags.map((tag) => tag._id),
    };

    const UpdateObj = {
      Name: data.Name,
      Description: data.Description,
      NameL1: data.NameL1,
      DescriptionL1: data.DescriptionL1,
      Image: uploadedImg === "" ? data.Image : filename,
      TagsIds: selectedTags.map((tag) => tag._id),
    };

    setLoaderOpen(true);

    if (SaveUpdateButton === "SAVE") {
      if (uploadedImg === "") {
        setLoaderOpen(false);
        validationAlert("Please select file");
        return;
      }
      try {
        const res = await axios.request({
          method: "PUT",
          maxBodyLength: Infinity,
          url: `${Bunny_Storage_URL}/Advertisement/${filename}`,
          headers: {
            "Content-Type": "image/jpeg",
            AccessKey: Bunny_Storage_Access_Key,
          },
          data: uploadedImg,
        });

        if (res.data.HttpCode === 201) {
          const token = await getApiToken();
          const response = await axios.post(
            `${BASE_URL}advertisement`,
            saveObj,{
              headers: {
                'Content-Type': 'application/json',
                Authorization: token,
              },
            }
          );
          if (response.data.status) {
            setLoaderOpen(false);
            Swal.fire({
              position: "center",
              icon: "success",
              toast: true,
              title: "Data Added Successfully",
              showConfirmButton: false,
              timer: 1500,
            });
            handleClose();
            getAllImgList();
            setUploadedImg("");
          } else {
            setLoaderOpen(false);
            throw new Error("Failed to Add Data");
          }
        } else {
          setLoaderOpen(false);
          throw new Error("Failed to Upload Image");
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
        const token = await getApiToken();
        try {
          const response = await axios.patch(
            `${BASE_URL}advertisement/${data.Id}`,
            UpdateObj,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: token,
              },
            }
          );

          if (response.data.status && uploadedImg !== "") {
            const res = await axios.request({
              method: "PUT",
              maxBodyLength: Infinity,
              url: `${Bunny_Storage_URL}/Advertisement/${filename}`,
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
                  url: `${Bunny_Storage_URL}/Advertisement/${data.Image}`,
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
              getAllImgList();
              setUploadedImg("");
            } else {
              setLoaderOpen(false);
              throw new Error("Failed to Update Data");
            }
          } else {
            // setLoaderOpen(false);
            // throw new Error("Failed to Upload Image");
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
            getAllImgList();
            setUploadedImg("");
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
        setLoaderOpen(false);
      }
    }
  };

  const getAllImgList = async() => {
    const token = await getApiToken();
    axios.get(`${BASE_URL}advertisement/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    }).then((response) => {
      setImgData(response.data.values.flat());
    });
  };

  const getTagData = async() => {
    const token = await getApiToken();
    axios.get(`${BASE_URL}tags`,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    }).then((response) => {
      setTags(response.data.values);
    });
  };

  const handleDelete = async(data) => {
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
          .delete(`${BASE_URL}advertisement/${data._id}`,{
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
          })
          .then((response) => {
            if (response.data.status) {
              axios
                .delete(`${Bunny_Storage_URL}/Advertisement/${data.Image}`, {
                  headers: {
                    AccessKey: Bunny_Storage_Access_Key,
                  },
                })
                .then((res) => {
                  if (res.data.HttpCode === 200) {
                    setLoaderOpen(false);
                    Swal.fire({
                      position: "center",
                      icon: "success",
                      toast: true,
                      title: "Data Deleted Successfully",
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
                      text: "Failed to Delete from Bunny Storage!",
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
            } else {
              setLoaderOpen(false);
              Swal.fire({
                position: "center",
                icon: "error",
                toast: true,
                title: "Failed",
                text: "Failed to Delete Advertisement!",
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

  const handleUpdate = (data) => {
    setSaveUpdateButton("UPDATE");
    setOn(true);
    setSelectedTags(data.TagsIds);
    setData({
      Id: data._id,
      Name: data.Name,
      Description: data.Description,
      NameL1: data.NameL1,
      DescriptionL1: data.DescriptionL1,
      Image: data.Image,
      TagsIds: data.TagsIds,
      Category: "en",
    });
  };

  React.useEffect(() => {
    getAllImgList();
  });

  React.useEffect(() => {
    getTagData();
  });

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const isSubmitDisabled = () => {
    if (data.Name && data.Description && selectedTags.length > 0) {
      return false;
    } else {
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
      {loaderOpen && <Loader open={loaderOpen} />}
      <Modal
        open={on}
        onClose={handleClose}
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
            spacing={2}
            display={"flex"}
            flexDirection={"column"}
            padding={4}
            justifyContent={"center"}
          >
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontWeight="bold">Add Advertisement</Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
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
                  onChange={onchangeHandler}
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
                name={data.Category === "en" ? "Name" : "NameL1"}
                value={data.Category === "en" ? data.Name : data.NameL1}
                onChange={onchangeHandler}
                autoFocus
                style={{ borderRadius: 10, width: "100%" }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl
                fullWidth
                size="small"
                // required
              >
                <InputLabel id="demo-select-small-label">Select Tag</InputLabel>
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
                          // onDelete={() => handleDelete(value)}
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
                // required
                fullWidth
                id="Description"
                label="Enter Description"
                name={data.Category === "en" ? "Description" : "DescriptionL1"}
                value={
                  data.Category === "en" ? data.Description : data.DescriptionL1
                }
                onChange={onchangeHandler}
                multiline
                rows={3}
                placeholder="Enter your Description..."
              />
            </Grid>

            <Grid item xs={12}>
              {/* <Typography color={"red"} fontSize={14} >Please upload image with a resolution of 70x90 pixel</Typography> */}
              <Button
                fullWidth
                onChange={handleFileUpload}
                component="label"
                role={undefined}
                disabled={isSubmitDisabled()}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                required
                sx={{
                  backgroundColor: "#5C5CFF",
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "#E6E6FA",
                    border: "1px solid #5C5CFF",
                    color: "#5C5CFF",
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
              <Typography fontSize={"small"} color={"red"}textAlign={"center"}>
                Please upload an image with in 192:19 aspect ratio
              </Typography>
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
          Manage Advertisement
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
          Add Advertisement
        </Button>
      </Grid>

      <Grid container spacing={3} justifyContent="start">
        {Array.isArray(imgData) &&
          imgData.slice(startIndex, endIndex).map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                sx={{
                  minHeight: 300,
                  width: "100%",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-10px)",

                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.6)",
                  },
                }}
              >
                <img
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "fill",
                    aspectRatio: 5 / 3,
                  }}
                  src={`${Bunny_Image_URL}/Advertisement/${item.Image}`}
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
                    <b>{item.Name} </b>
                  </Typography>
                  <Typography
                    textAlign={"start"}
                    variant="body2"
                    style={styles.typography}
                    color="textSecondary"
                    component="div"
                  >
                    {item.Description}
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
};

export default ManageAdvertise;
