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
import Swal from "sweetalert2";
import {
  BASE_URL,
  Bunny_Stream_Access_Key,
  Bunny_Stream_GET_URL,
  Bunny_Stream_URL,
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
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [uploadedVideo, setUploadedVideo] = React.useState("");
  const [formData, setFormData] = React.useState({
    Name: "",
    Description: "",
    Id: "",
  });
  const [Videos, setVideos] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const cardsPerPage = 8;
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [selectedTags, setSelectedTags] = React.useState([]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const clearFormData = () => {
    setFormData({
      Name: "",
      Description: "",
      TagsIds: "",
      Status: 1,
    });
    setSelectedTags([]);
    setUploadedVideo("");
  };

  React.useEffect(() => {
    getAllVideoList();
  }, []);

  React.useEffect(() => {
    getTagData();
  }, []);
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
    setFormData([]);
  };

  const handleUpdate = (data) => {
    console.log(data);
    setSaveUpdateButton("UPDATE");
    setOn(true);
    setSelectedTags(data.TagsIds);
    setFormData({
      Name: data.Name,
      Description: data.Description,
      Id: data._id,
      TagsIds: data.TagsIds,
      StorageVideoId: data.StorageVideoId,
    });
    console.log("Update Video id", data);
  };

  const handleVideoUpload = (event) => {
    const video = event.target.files[0];
    setUploadedVideo(video);
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

  const handleSubmitForm = () => {
    const requiredFields = ["Name", "Description"];
    const emptyRequiredFields = requiredFields.filter(
      (field) => !formData[field]
    );
    if (emptyRequiredFields.length > 0 || selectedTags.length === 0) {
      validationAlert("Please fill in all required fields");
      return;
    }

    const videoname = new Date().getTime() + "_" + uploadVideo.name;

    const UpdateObj = {
      Name: formData.Name,
      Description: formData.Description,
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
        text: "Do you want to Update?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Update it!",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .patch(`${BASE_URL}videos/${formData.Id}`, UpdateObj)
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
            .post(`${BASE_URL}videos`, {
              Name: formData.Name,
              Description: formData.Description,
              Link: `${Bunny_Stream_GET_URL}/${data.videoLibraryId}/${data.guid}`,
              StorageLabId: data.videoLibraryId,
              StorageVideoId: data.guid,
              // TagsIds: formData.tag,
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

  const getAllVideoList = () => {
    axios.get(`${BASE_URL}videos/`).then((response) => {
      setVideos(response.data.values);
      // console.log(response.data.values.flat());
    });
  };
  const getTagData = () => {
    axios.get(`${BASE_URL}tags`).then((response) => {
      setTags(response.data.values);
      // console.log(response.data.values.flat());
    });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const play = () => {
    setIsPlaying(true);
  };

  const deleteVideo = (data) => {
    setLoaderOpen(true);
    console.log(data);
    Swal.fire({
      text: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    })
      .then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`${Bunny_Stream_URL}/${data.StorageVideoId}`, {
              headers: {
                AccessKey: Bunny_Stream_Access_Key,
              },
            })
            .then((res) => {
              console.log(res);
              if (res.data.success) {
                axios
                  .delete(`${BASE_URL}videos/${data._id}`)
                  .then((response) => {
                    if (response.data.status) {
                      setLoaderOpen(false);
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
            });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          toast: true,
          title: "Failed",
          text: error,
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
      // console.log("Please fill all fields");
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
  return (
    <>
      {loaderOpen && <Loader open={loaderOpen} />}
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
            xs={12}
            item
            spacing={3}
            display={"flex"}
            flexDirection={"column"}
            padding={4}
            justifyContent={"center"}
          >
            <Grid item xs={12}>
              <Typography fontWeight="bold">Add Video</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                spacing={"5"}
                required
                fullWidth
                id="Name"
                label="Enter Title"
                name="Name"
                autoFocus
                value={formData.Name}
                style={{ borderRadius: 10, width: "100%" }}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                size="small"
                required
                fullWidth
                id="Description"
                label="Enter Description"
                multiline
                name="Description"
                value={formData.Description}
                rows={3}
                onChange={handleInputChange}
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
                  backgroundColor: "#8F00FF",

                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "#3B444B",
                  },
                }}
              >
                {uploadedVideo.name ? uploadedVideo.name : "Upload Video"}

                <VisuallyHiddenInput type="file" />
              </Button>
            </Grid>

            <Grid item xs={12} textAlign={"end"}>
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
        // xs={12}
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
          width={"100%"}
          textAlign="center"
          textTransform="uppercase"
          fontWeight="bold"
          color={"#673AB7"}
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
          Add Videos
        </Button>
      </Grid>

      <Grid container spacing={3} justifyContent="start">
        {Videos.slice(startIndex, endIndex).map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card sx={{ width: "100%" }}>
              <iframe
                src={`${Bunny_Stream_GET_URL}/${item.StorageLabId}/${item.StorageVideoId}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "fill",
                  aspectRatio: 5 / 3,
                }}
                title="Video Player"
                frameBorder="0"
                autoPlay={play}
                onClick={togglePlay}
                allowFullScreen
              />

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
}
