import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
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
import Swal from "sweetalert2";
import {
  BASE_URL,
  Bunny_Stream_Access_Key,
  Bunny_Stream_GET_URL,
  Bunny_Stream_URL,
  Bunny_Thumbnail_URL,
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

export default function ManageVideos() {
  const [play, setPlay] = React.useState(null);
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [uploadedVideo, setUploadedVideo] = React.useState("");

  const [Videos, setVideos] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const cardsPerPage = 8;
  const [selectedTags, setSelectedTags] = React.useState([]);
  const [formData, setFormData] = React.useState({
    Name: "",
    Description: "",
    Id: "",
    NameL1: "",
    DescriptionL1: "",
    Category: "en",
  });

  const clearFormData = () => {
    setFormData({
      Name: "",
      Description: "",
      NameL1: "",
      DescriptionL1: "",
      Category: "en",
      TagsIds: "",
      Status: 1,
    });
    setSelectedTags([]);
    setUploadedVideo("");
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

  React.useEffect(() => {
    getAllVideoList();
    getTagData();
  });
  const handleClose = () => {
    setOn(false);
  };

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

  const handleOnSave = () => {
    setSaveUpdateButton("SAVE");
    setOn(true);
    clearFormData();
    setFormData({
      Name: "",
      Description: "",
      Id: "",
      NameL1: "",
      DescriptionL1: "",
      Category: "en",
    });
  };

  const handleUpdate = (data) => {
    console.log(data);
    setSaveUpdateButton("UPDATE");
    setOn(true);
    setSelectedTags(data.TagsIds);
    setFormData({
      Name: data.Name,
      NameL1: data.NameL1,
      Description: data.Description,
      DescriptionL1: data.DescriptionL1,
      Id: data._id,
      TagsIds: data.TagsIds,
      StorageVideoId: data.StorageVideoId,
      Category: "en",
    });

    if (data.Link) {
      setUploadedVideo({
        name: data.Link,
      });
    } else {
      setUploadedVideo("");
    }

    console.log("Update Video id", data);
  };

  const handleVideoUpload = (event) => {
    const video = event.target.files[0];
    if (video && video.type.startsWith("video/")) {
      setUploadedVideo(video);
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please upload a valid video file",
        toast: true,
        showConfirmButton: true,
      });
      setUploadedVideo("");
    }

    if (formData.Link) {
      setUploadedVideo({
        name: formData.Link,
      });
    }
  };

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
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

  const handleOnPlay = (id) => {
    setPlay(id);
  };

  const handleSubmitForm = async() => {
    const token = await getApiToken();
    const requiredFields = ["Name", "Description"];
    const emptyRequiredFields = requiredFields.filter(
      (field) => !formData[field] || !formData[field].trim()
    );
    if (emptyRequiredFields.length > 0 || selectedTags.length === 0) {
      validationAlert("Please fill in all required fields");
      return;
    }

    const videoname = new Date().getTime() + "_" + uploadVideo.name;

    const UpdateObj = {
      Name: formData.Name,
      Description: formData.Description,
      NameL1: formData.NameL1,
      DescriptionL1: formData.DescriptionL1,
      Link: videoname,
      TagsIds: selectedTags.map((tag) => tag._id),
    };

    console.log(UpdateObj);

    setLoaderOpen(true);
    if (SaveUpdateButton === "SAVE") {
      if (uploadedVideo === "") {
        setLoaderOpen(false);
        validationAlert("Please select Video");
        return;
      }

      const obj = {
        title: videoname,
      };
      axios
        .request({
          method: "POST",
          url: `${Bunny_Stream_URL}`,
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            AccessKey: Bunny_Stream_Access_Key,
          },
          data: obj,
        })
        .then((response) => {
          uploadVideo(response.data);
        });
    } else {
      Swal.fire({
        text: "Do you want to Update...?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Update it!",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .patch(`${BASE_URL}videos/${formData.Id}`, UpdateObj,{
              headers: {
                'Content-Type': 'application/json',
                Authorization: token,
              },
            })
            .then((response) => {
              console.log(response);
              if (response.data.status) {
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
                getAllVideoList();
              } else {
                setLoaderOpen(false);
                Swal.fire({
                  icon: "error",
                  toast: true,
                  title: "Failed",
                  text: "Failed to Update Data",
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
                text: "Failed to Update Data",
                showConfirmButton: true,
              });
            });
        } else {
          setLoaderOpen(false);
        }
      });
    }
  };
  const uploadVideo = (data) => {
    axios
      .request({
        method: "PUT",
        maxBodyLength: Infinity,
        url: `${Bunny_Stream_URL}/${data.guid}`,
        headers: {
          "Content-Type": "video/mp4",
          AccessKey: Bunny_Stream_Access_Key,
        },
        data: uploadedVideo,
      })
      .then((res) => {
        console.log(res);

        if (res.data.success) {
          setLoaderOpen(false);
          axios
            .post(`${BASE_URL}videos/`, {
              Name: formData.Name,
              Description: formData.Description,
              NameL1: formData.NameL1,
              DescriptionL1: formData.DescriptionL1,
              Link: `${Bunny_Stream_GET_URL}/${data.videoLibraryId}/${data.guid}`,
              StorageLabId: data.videoLibraryId,
              StorageVideoId: data.guid,
              Thumbnail: data.thumbnailFileName,
              TagsIds: selectedTags.map((tag) => tag._id),
            })
            .then((response) => {
              if (response.data.status) {
                setLoaderOpen(false);
                Swal.fire({
                  position: "center",
                  icon: "success",
                  toast: true,
                  title: "Video Added Successfully",
                  showConfirmButton: false,
                  timer: 1500,
                });
                handleClose();
                getAllVideoList();
              } else {
                setLoaderOpen(false);
                Swal.fire({
                  icon: "error",
                  toast: true,
                  title: "Failed",
                  text: "Failed to Add Video",
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
        } else {
          setLoaderOpen(false);
          Swal.fire({
            icon: "error",
            toast: true,
            title: "Failed",
            text: "Failed to Add Video",
            showConfirmButton: true,
          });
        }
      });
  };

  const getAllVideoList = async() => {
    const token = await getApiToken();
    axios.get(`${BASE_URL}videos/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    }).then((response) => {
      setVideos(response.data.values);
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

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const deleteVideo = async(data) => {
    const token = await getApiToken();
    console.log(data);
    Swal.fire({
      text: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    })
      .then((result) => {
        if (result.isConfirmed) {
          setLoaderOpen(true);
          axios
            .delete(`${BASE_URL}videos/${data._id}`,
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: token,
                },
              }
            )
            .then((response) => {
              if (response.data.status) {
                axios
                  .delete(`${Bunny_Stream_URL}/${data.StorageVideoId}`, {
                    headers: {
                      AccessKey: Bunny_Stream_Access_Key,
                    },
                  })
                  .then((res) => {
                    setLoaderOpen(false);
                    if (res.data.success) {
                      Swal.fire({
                        position: "center",
                        icon: "success",
                        toast: true,
                        title: "Video deleted Successfully",
                        showConfirmButton: false,
                        timer: 1500,
                      });
                      handleClose();
                      getAllVideoList();
                    } else {
                      Swal.fire({
                        icon: "error",
                        toast: true,
                        title: "Failed",
                        text: "Failed to Delete Video from storage",
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
                      text: error.message,
                      showConfirmButton: true,
                    });
                  });
              } else {
                setLoaderOpen(false);
                Swal.fire({
                  icon: "error",
                  toast: true,
                  title: "Failed",
                  text: "Failed to Delete Video entry",
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
                text: error.message,
                showConfirmButton: true,
              });
            });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          toast: true,
          title: "Failed",
          text: error.message,
          showConfirmButton: true,
        });
      });
  };

  const startIndex = (page - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

  const isSubmitDisabled = () => {
    if (formData.Name && formData.Description && selectedTags.length > 0) {
      return false;
    } else {
      return true;
    }
  };

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

  const containerStyle = {
    position: "relative",
    width: "100%",
  };

  // const buttonStyle = {
  //   position: "absolute",
  //   top: "50px",
  //   left: "50%",
  //   transform: "translateX(-50%)",
  //   backgroundColor: "#C0C0C0",
  //   border: "none",
  //   borderRadius: "50%",
  //   padding: "5px",
  //   cursor: "pointer",
  //   opacity: 0.9,
  //   display: "flex",
  //   justifyContent: "center",
  //   alignItems: "center",
  // };
 
 

  return (
    <>
      {loaderOpen && <Loader open={loaderOpen} />}
      <Modal open={on} onClose={handleClose}
      sx={{
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      }}>
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
            xs={12}
            item
            spacing={2}
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
              <Typography fontWeight="bold">Add Videos</Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon  />
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
                  onChange={handleInputChange}
                  value={formData.Category}
                  disabled={SaveUpdateButton === "SAVE"}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="mr">Marathi</MenuItem>
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
                label="Enter Title"
                autoFocus
                name={formData.Category === "en" ? "Name" : "NameL1"}
                value={
                  formData.Category === "en" ? formData.Name : formData.NameL1
                }
                style={{ borderRadius: 10, width: "100%" }}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl
                fullWidth
                size="small"
                //  required
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

            <Grid item xs={12}>
              <TextField
                size="small"
                // required
                fullWidth
                id="Description"
                label="Enter Description"
                multiline
                name={
                  formData.Category === "en" ? "Description" : "DescriptionL1"
                }
                value={
                  formData.Category === "en"
                    ? formData.Description
                    : formData.DescriptionL1
                }
                rows={3}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                onChange={handleVideoUpload}
                component="label"
                role={undefined}
                disabled={isSubmitDisabled()}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
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
                  {uploadedVideo.name ? uploadedVideo.name : "Upload Video"}
                </Typography>

                <VisuallyHiddenInput type="file" />
              </Button>
            </Grid>

            <Grid item xs={12} textAlign={"end"}>
              <Button
                type="submit"
                size="small"
                sx={{
                  marginTop: 1,
                  p: 1,
                  width: 80,
                  boxShadow: 5,
                  color: "white",
                  backgroundColor: "#5C5CFF",
                  "&:hover": {
                    backgroundColor: "#E6E6FA",
                    border: "1px solid #5C5CFF",
                    color: "#5C5CFF",
                  },
                }}
                onClick={handleSubmitForm}
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
        component={Paper}
        textAlign={"center"}
        elevation={4}
        sx={{
          width: "100%",
          px: 5,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
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
          Manage Videos
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
          Add Videos
        </Button>
      </Grid>

      <Grid container spacing={3} justifyContent="start" sx={{ color: "red" }}>
        {Videos.slice(startIndex, endIndex).map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card  
             sx={{
              width: "100%",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-10px)",

                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.6)", 
              },
            }}
            >
              {item.StorageVideoId === play ? (
                <iframe
                  src={`${Bunny_Stream_GET_URL}/${item.StorageLabId}/${item.StorageVideoId}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "fill",
                    aspectRatio: "5 / 3",
                  }}
                  title="Video Player"
                  autoPlay={play}
                  allowFullScreen
                />
              ) : (
                // <iframe src="https://iframe.mediadelivery.net/embed/222011/47d67bce-03aa-47d3-bad8-f5c89bcbe746?autoplay=true&loop=false&muted=true&preload=false&responsive=true" loading="lazy"   allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;" allowfullscreen="true"></iframe>

                <div style={containerStyle}>
                  <img
                    src={`${Bunny_Thumbnail_URL}/${item.StorageVideoId}/${item.Thumbnail}`}
                    alt="Thumbnail"
                    onClick={() => {
                      handleOnPlay(item.StorageVideoId);
                    }}
                    style={{
                      width: "100%",
                      objectFit: "cover",
                      aspectRatio: "5 / 3",
                    }}
                  />
                </div>
              )}
              <CardContent>
                <Typography
                  noWrap
                  height={25}
                  gutterBottom
                  component="div"
                  textAlign={"start"}
                >
                  <b>{item.Name}</b>
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
                <IconButton color="primary" onClick={() => handleUpdate(item)}>
                  <EditNoteIcon />
                </IconButton>
                <Button
                  size="medium"
                  sx={{ color: "red" }}
                  onClick={() => deleteVideo(item)}
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
            count={Math.ceil(Videos.length / 8)}
            color="primary"
            page={page}
            onChange={handlePageChange}
          />
        </Grid>
      </Grid>
    </>
  );
}
