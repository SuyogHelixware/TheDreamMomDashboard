import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  Box,
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
import { Document, Page } from "react-pdf";
import "react-quill/dist/quill.snow.css";
import pdf from "../../src/assets/images.png";
import Swal from "sweetalert2";
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

const ManageBlog = ({ item }) => {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [uploadedImg, setUploadedImg] = React.useState("");
  const [on, setOn] = React.useState(false);
  // const [ison, setisOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [selectedTags, setSelectedTags] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [imgData, setImgData] = React.useState([]);
  const cardsPerPage = 4;
  const [data, setData] = React.useState({
    Name: "",
    Description: "",
    NameL1: "",
    DescriptionL1: "",
    Link: "",
    Id: "",
    Category: "",
    Language: "en",
  });

  const [blogPage, setBlogPage] = React.useState(1);
  const [newsPage, setNewsPage] = React.useState(1);
  const [category, setCategory] = React.useState("");

  const clearFormData = () => {
    setData({
      Id: "",
      Name: "",
      Description: "",
      NameL1: "",
      DescriptionL1: "",
      Link: "",
      TagsIds: [],
      Status: 1,
      Category: "",
      Language: "",
    });
    setSelectedTags([]);
    setUploadedImg("");
  };

  const [open, setOpen] = React.useState(false);
  const [isopen, setisopen] = React.useState(false);
  const errorMessage = (message) => {
    Swal.fire({
      icon: "error",
      title: "Invalid File",
      text: message,
      toast: true,
      showConfirmButton: true,
    });
    setUploadedImg("");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      errorMessage("No file selected");
      return;
    }
    if (file.type.startsWith("image/")) {
      setUploadedImg(file);
    } else {
      errorMessage("Please upload a valid image file");
    }
  };

  const handleLetterUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      errorMessage("No file selected");
      return;
    }

    if (file.type.startsWith("image/") || file.type === "application/pdf") {
      setUploadedImg(file);
    } else {
      errorMessage("Please upload a valid image or PDF file");
    }
  };

  const onopen = (pdf) => {
    window.open(`${Bunny_Image_URL}/Blogs/${pdf}`, "_blank");
  };
  const isSubmitDisabled = () => {
    if (data.Name && data.Description && selectedTags.length > 0) {
      return false;
    } else {
      return true;
    }
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

  const handleClose = () => {
    setOpen(false);
    setisopen(false);
    setOn(false);
    setisopen(false);
  };

  const handleOnSave = () => {
    setCategory("N");
    setSaveUpdateButton("SAVE");

    clearFormData();
    setOn(true);

    setData({
      Name: "",
      Description: "",
      NameL1: "",
      DescriptionL1: "",
      Link: "",
      Id: "",
      Language: "en",
    });
  };
  const handleOnBlogSave = () => {
    setSaveUpdateButton("SAVE");

    setCategory("B");
    clearFormData();
    setisopen(true);
    setData({
      Name: "",
      Description: "",
      NameL1: "",
      DescriptionL1: "",
      Link: "",
      Id: "",
      Language: "en",
    });
  };
  const onchangeHandler = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const getTagData = () => {
    axios.get(`${BASE_URL}tags`).then((response) => {
      setTags(response.data.values);
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
    const newData = { ...data, Category: category };
    const requiredFields = ["Name", "Description"];
    const emptyRequiredFields = requiredFields.filter(
      (field) => !newData[field] || !newData[field].trim()
    );
    if (emptyRequiredFields.length > 0 || selectedTags.length === 0) {
      validationAlert("Please fill in all required fields");
      return;
    }
    const filename = new Date().getTime() + "_" + uploadedImg.name;
    const saveObj = {
      Name: newData.Name,
      NameL1: newData.NameL1,
      Description: newData.Description,
      DescriptionL1: newData.DescriptionL1,
      Link: filename,
      TagsIds: selectedTags.map((tag) => tag._id),
      Category: "B",
    };
    const UpdateObj = {
      Name: newData.Name,
      Description: newData.Description,
      NameL1: newData.NameL1,
      DescriptionL1: newData.DescriptionL1,
      Link: uploadedImg === "" ? newData.Link : filename,
      Category: "B",
      TagsIds: selectedTags.map((tag) => tag._id),
      Id: newData.Id,
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
          url: `${Bunny_Storage_URL}/Blogs/${filename}`,
          headers: {
            "Content-Type": "image/jpeg",
            AccessKey: Bunny_Storage_Access_Key,
          },
          data: uploadedImg,
        });

        if (res.data.HttpCode === 201) {
          const response = await axios.post(`${BASE_URL}blogs`, saveObj);
          if (response.data.status) {
            setLoaderOpen(false);
            Swal.fire({
              position: "center",
              icon: "success",
              toast: true,
              title: "Blog Added Successfully",
              showConfirmButton: false,
              timer: 1500,
            });
            handleClose();
            getAllImgList();
            setUploadedImg("");
          } else {
            setLoaderOpen(false);
            throw new Error("Failed to Add Blog");
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
        try {
          const response = await axios.patch(
            `${BASE_URL}blogs/${newData.Id}`,
            UpdateObj
          );

          if (response.data.status && uploadedImg !== "") {
            const res = await axios.request({
              method: "PUT",
              maxBodyLength: Infinity,
              url: `${Bunny_Storage_URL}/Blogs/${filename}`,
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
                  url: `${Bunny_Storage_URL}/Blogs/${newData.Link}`,
                  headers: {
                    AccessKey: Bunny_Storage_Access_Key,
                  },
                });
              }
              setLoaderOpen(false);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Blog Updated Successfully",
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
            setLoaderOpen(false);
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Blog Updated Successfully",
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

  const handleSubmitNewsletter = async () => {
    const newData = { ...data, Category: category };
    const requiredFields = ["Name", "Description"];
    const emptyRequiredFields = requiredFields.filter(
      (field) => !newData[field] || !newData[field].trim()
    );
    if (emptyRequiredFields.length > 0 || selectedTags.length === 0) {
      validationAlert("Please fill in all required fields");
      return;
    }
    const filename = new Date().getTime() + "_" + uploadedImg.name;
    const saveNewletterObj = {
      Name: newData.Name,
      NameL1: newData.NameL1,
      Description: newData.Description,
      DescriptionL1: newData.DescriptionL1,
      Link: filename,
      TagsIds: selectedTags.map((tag) => tag._id),
      Category: "N",
    };
    const UpdateNewletterObj = {
      Name: newData.Name,
      Description: newData.Description,
      NameL1: newData.NameL1,
      DescriptionL1: newData.DescriptionL1,
      Link: uploadedImg === "" ? newData.Link : filename,
      Category: "N",
      TagsIds: selectedTags.map((tag) => tag._id),
      Id: newData.Id,
    };
    console.log(UpdateNewletterObj);
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
          url: `${Bunny_Storage_URL}/Blogs/${filename}`,
          headers: {
            "Content-Type": "image/jpeg",
            AccessKey: Bunny_Storage_Access_Key,
          },
          data: uploadedImg,
        });

        if (res.data.HttpCode === 201) {
          const response = await axios.post(
            `${BASE_URL}blogs`,
            saveNewletterObj
          );
          if (response.data.status) {
            setLoaderOpen(false);
            Swal.fire({
              position: "center",
              icon: "success",
              toast: true,
              title: "Newsletter Added Successfully",
              showConfirmButton: false,
              timer: 1500,
            });
            handleClose();
            getAllImgList();
            setUploadedImg("");
          } else {
            setLoaderOpen(false);
            throw new Error("Failed to Add Newsletter");
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
        try {
          const response = await axios.patch(
            `${BASE_URL}blogs/${newData.Id}`,
            UpdateNewletterObj
          );

          if (response.data.status && uploadedImg !== "") {
            const res = await axios.request({
              method: "PUT",
              maxBodyLength: Infinity,
              url: `${Bunny_Storage_URL}/Blogs/${filename}`,
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
                  url: `${Bunny_Storage_URL}/Blogs/${newData.Link}`,
                  headers: {
                    AccessKey: Bunny_Storage_Access_Key,
                  },
                });
              }
              setLoaderOpen(false);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Newsletter Updated Successfully",
                toast: true,
                showConfirmButton: false,
                timer: 1500,
              });
              handleClose();
              getAllImgList();
              setUploadedImg("");
            } else {
              setLoaderOpen(false);
              throw new Error("Failed to Update Newsletter");
            }
          } else {
            setLoaderOpen(false);
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Newsletter Updated Successfully",
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
        setLoaderOpen(true);

        axios
          .delete(`${BASE_URL}blogs/${data._id}`)
          .then((response) => {
            if (response.data.status) {
              axios
                .delete(`${Bunny_Storage_URL}/Blogs/${data.Link}`, {
                  headers: {
                    AccessKey: Bunny_Storage_Access_Key,
                  },
                })
                .then((res) => {
                  setLoaderOpen(false);
                  if (res.data.HttpCode === 200) {
                    Swal.fire({
                      position: "center",
                      icon: "success",
                      toast: true,
                      title: "Blog Deleted Successfully",
                      showConfirmButton: false,
                      timer: 1500,
                    });
                    getAllImgList();
                  } else {
                    Swal.fire({
                      icon: "error",
                      toast: true,
                      title: "Failed",
                      text: "Something went wrong...!",
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
                    text: error.message || "Error deleting from storage",
                    showConfirmButton: true,
                  });
                });
            } else {
              setLoaderOpen(false);
              Swal.fire({
                icon: "error",
                toast: true,
                title: "Failed",
                text: "Failed to delete blog",
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
              text: error.message || "Error deleting blog",
              showConfirmButton: true,
            });
          });
      }
    });
  };

  const handleLeterDelete = (data) => {
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
          .delete(`${BASE_URL}blogs/${data._id}`)
          .then((response) => {
            if (response.data.status) {
              axios
                .delete(`${Bunny_Storage_URL}/Blogs/${data.Link}`, {
                  headers: {
                    AccessKey: Bunny_Storage_Access_Key,
                  },
                })
                .then((res) => {
                  setLoaderOpen(false);
                  if (res.data.HttpCode === 200) {
                    Swal.fire({
                      position: "center",
                      icon: "success",
                      toast: true,
                      title: "Newsletter Deleted Successfully",
                      showConfirmButton: false,
                      timer: 1500,
                    });
                    getAllImgList();
                  } else {
                    Swal.fire({
                      icon: "error",
                      toast: true,
                      title: "Failed",
                      text: "Something went wrong...!",
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
                    text: error.message || "Error deleting from storage",
                    showConfirmButton: true,
                  });
                });
            } else {
              setLoaderOpen(false);
              Swal.fire({
                icon: "error",
                toast: true,
                title: "Failed",
                text: "Failed to delete Newsletter",
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
              text: error.message || "Error deleting Newsletter",
              showConfirmButton: true,
            });
          });
      }
    });
  };

  const handleUpdate = (data) => {
    setSaveUpdateButton("UPDATE");
    setisopen(true);
    setSelectedTags(data.TagsIds);
    setData({
      Id: data._id,
      Name: data.Name,
      Description: data.Description,
      NameL1: data.NameL1,
      DescriptionL1: data.DescriptionL1,
      Link: data.Link,
      TagsIds: data.TagsIds,
      Category: data.Category,
      Language: "en",
    });
  };

  const handleLetterUpdate = (data) => {
    setSaveUpdateButton("UPDATE");
    setOn(true);
    setSelectedTags(data.TagsIds);
    setData({
      Id: data._id,
      Name: data.Name,
      Description: data.Description,
      NameL1: data.NameL1,
      DescriptionL1: data.DescriptionL1,
      Link: data.Link,
      TagsIds: data.TagsIds,
      Category: data.Category,
      Language: "en",
    });
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

  const getAllImgList = () => {
    axios.get(`${BASE_URL}blogs/`).then((response) => {
      setImgData(response.data.values.flat());
    });
  };

  React.useEffect(() => {
    getAllImgList();
  }, []);

  const handleBlogPageChange = (event, value) => {
    setBlogPage(value);
  };

  const handleNewsPageChange = (event, value) => {
    setNewsPage(value);
  };

  const startIndex = (blogPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

  const startIndexPage = (newsPage - 1) * cardsPerPage;
  const endIndexPage = startIndexPage + cardsPerPage;

  React.useEffect(() => {
    getTagData();
  }, []);

  return (
    <>
      {loaderOpen && <Loader open={loaderOpen} />}
      <Modal open={isopen} onClose={handleClose}>
        <Paper
          elevation={10}
          sx={{
            width: "90%",
            maxWidth: 800,
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
              <Typography fontWeight="bold">Add Blog </Typography>
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
                  id="Language"
                  label="Language"
                  name="Language"
                  onChange={onchangeHandler}
                  value={data.Language}
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
                fullWidth
                id="Name"
                label="Enter Name"
                name={data.Language === "en" ? "Name" : "NameL1"}
                value={data.Language === "en" ? data.Name : data.NameL1}
                onChange={onchangeHandler}
                autoFocus
                style={{ borderRadius: 10, width: "100%" }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-select-small-label">Select Tag</InputLabel>
                <Select
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
                fullWidth
                id="Description"
                label="Enter Description"
                name={data.Language === "en" ? "Description" : "DescriptionL1"}
                value={
                  data.Language === "en" ? data.Description : data.DescriptionL1
                }
                onChange={onchangeHandler}
                multiline
                rows={5}
                placeholder="Enter your Description..."
              />
            </Grid>

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
                    ? data.Link
                    : uploadedImg && uploadedImg.name
                    ? uploadedImg.name
                    : "Upload File"}
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                />
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
      {/* ------------------------------------------------------------------ */}
      <Modal open={on} onClose={handleClose}>
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
              <Typography fontWeight="bold">Add Newsletter</Typography>
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
                  id="Language"
                  label="Language"
                  name="Language"
                  onChange={onchangeHandler}
                  value={data.Language}
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
                fullWidth
                id="Name"
                label="Enter Name"
                name={data.Language === "en" ? "Name" : "NameL1"}
                value={data.Language === "en" ? data.Name : data.NameL1}
                onChange={onchangeHandler}
                autoFocus
                style={{ borderRadius: 10, width: "100%" }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-select-small-label">Select Tag</InputLabel>

                <Select
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
                fullWidth
                id="Description"
                label="Enter Description"
                name={data.Language === "en" ? "Description" : "DescriptionL1"}
                value={
                  data.Language === "en" ? data.Description : data.DescriptionL1
                }
                onChange={onchangeHandler}
                multiline
                rows={3}
                placeholder="Enter your Description..."
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                onChange={handleLetterUpload}
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
                    ? data.Link
                    : uploadedImg && uploadedImg.name
                    ? uploadedImg.name
                    : "Upload File"}
                </Typography>
                <VisuallyHiddenInput type="file" accept=".pdf,image/*" />
              </Button>
            </Grid>

            <Grid item xs={12} md={12} textAlign={"end"}>
              <Button
                type="submit"
                size="small"
                onClick={handleSubmitNewsletter}
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
          Manage Blogs
        </Typography>
      </Grid>

      <Grid textAlign={"end"} marginBottom={1}>
        <Button
          onClick={handleOnBlogSave}
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
          Add Blog
        </Button>
      </Grid>

      <Grid container spacing={3} justifyContent="start">
        {Array.isArray(imgData) &&
          imgData
            .filter((data) => data.Category === "B")
            .slice(startIndex, endIndex)
            .map((item, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card sx={{ width: "100%" }}>
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "fill",
                      aspectRatio: 5 / 3,
                    }}
                    src={`${Bunny_Image_URL}/Blogs/${item.Link}`}
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

      <Grid container spacing={3} width="100%" pt={5} pb={5}>
        <Grid item xs={12} style={{ display: "flex", justifyContent: "end" }}>
          <Pagination
            count={Math.ceil(
              imgData.filter((data) => data.Category === "B").length /
                cardsPerPage
            )}
            color="primary"
            page={blogPage}
            onChange={handleBlogPageChange}
          />
        </Grid>
      </Grid>

      {/* ----------------------------News Letters------------------------------ */}
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
          mb: 4,
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
          Manage NewsLetters
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
          Add Newsletter
        </Button>
      </Grid>

      <Grid container spacing={3} justifyContent="start">
        {Array.isArray(imgData) &&
          imgData
            .filter((data) => data.Category === "N")
            .slice(startIndexPage, endIndexPage)
            .map((item, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card sx={{ width: "100%" }}>
                  <img
                    src={pdf}
                    alt="NewsIcon"
                    onClick={() => {
                      onopen(item.Link);
                    }}
                    style={{
                      width: "40%",
                      height: "100%",
                      cursor: "pointer",
                      objectFit: "fill",
                      aspectRatio: 5 / 6,
                      paddingTop: 20,
                      borderRadius: 15,
                      borderTopRightRadius:30,
                      borderTopLeftRadius:30,
 



                    }}
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
                    <IconButton
                      color="primary"
                      onClick={() => {
                        handleLetterUpdate(item);
                      }}
                    >
                      <EditNoteIcon />
                    </IconButton>
                    <Button
                      size="medium"
                      sx={{ color: "red" }}
                      onClick={() => handleLeterDelete(item)}
                    >
                      <DeleteForeverIcon />
                    </Button>
                  </CardActions>

                  <Modal open={open} onClose={handleClose}>
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                      }}
                    >
                      <Document file={`${Bunny_Image_URL}/Blogs/${item.Link}`}>
                        <Page pageNumber={1} />
                      </Document>
                      <Button onClick={handleClose}>Close</Button>
                    </Box>
                  </Modal>
                </Card>
              </Grid>
            ))}
      </Grid>

      <Grid container spacing={3} width="100%" pt={5}>
        <Grid item xs={12} style={{ display: "flex", justifyContent: "end" }}>
          <Pagination
            count={Math.ceil(
              imgData.filter((data) => data.Category === "N").length /
                cardsPerPage
            )}
            color="primary"
            page={newsPage}
            onChange={handleNewsPageChange}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default ManageBlog;
