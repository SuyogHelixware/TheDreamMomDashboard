import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Chip,
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

const ManageFAQ = () => {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [imgData, setImgData] = React.useState([]);
  const [selectedTags, setSelectedTags] = React.useState([]);
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [tags, setTags] = React.useState([]);
  const [data, setData] = React.useState({
    Question: "",
    Answer: "",
    QuestionL1: "",
    AnswerL1: "",
    Id: "",
    Category: "en",
  });

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

  const clearFormData = () => {
    setData({
      Id: "",
      Question: "",
      Answer: "",
      QuestionL1: "",
      AnswerL1: "",
      TagsIds: [],
      Status: 1,
    });
    setSelectedTags([]);
  };

  const handleClose = () => {
    setOn(false);
  };

  const handleOnSave = () => {
    setSaveUpdateButton("SAVE");
    setOn(true);
    clearFormData();
    setData({
      Question: "",
      Answer: "",
      QuestionL1: "",
      AnswerL1: "",
      Id: "",
      Category: "en",
    });
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

  const handleSubmitForm = () => {
    const requiredFields = ["Question", "Answer"];
    const emptyRequiredFields = requiredFields.filter(
      (field) => !data[field].trim()
    );
    if (emptyRequiredFields.length > 0 || selectedTags.length === 0) {
      validationAlert("Please fill in all required fields");
      return;
    }

    const saveObj = {
      Question: data.Question,
      Answer: data.Answer,
      QuestionL1: data.QuestionL1,
      AnswerL1: data.AnswerL1,
      TagsIds: selectedTags.map((tag) => tag._id),
    };
    const UpdateObj = {
      Question: data.Question,
      Answer: data.Answer,
      QuestionL1: data.QuestionL1,
      AnswerL1: data.AnswerL1,
      TagsIds: selectedTags.map((tag) => tag._id),
    };

    setLoaderOpen(true);

    const axiosRequest =
      SaveUpdateButton === "SAVE"
        ? axios.post(`${BASE_URL}faqs`, saveObj)
        : Swal.fire({
            text: "Do you want to Update...?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Update it!",
          }).then((result) => {
            if (result.isConfirmed) {
              return axios.patch(`${BASE_URL}faqs/${data.Id}`, UpdateObj);
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
                ? "FAQ Added Successfully"
                : "FAQ Updated Successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          getAllImgList();
          handleClose();
        } else {
          setLoaderOpen(false);
          Swal.fire({
            position: "center",
            icon: "error",
            toast: true,
            text: response.data.message,
            title: "Failed",
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
    axios.get(`${BASE_URL}faqs/`).then((response) => {
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
          .delete(`${BASE_URL}faqs/${rowData._id}`)
          .then((response) => {
            if (response.data.status) {
              setLoaderOpen(false);
              Swal.fire({
                position: "center",
                icon: "success",
                toast: true,
                title: "Data deleted successfully",
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
                text: "Failed to Delete Data",
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

  const getTagData = () => {
    axios.get(`${BASE_URL}tags`).then((response) => {
      setTags(response.data.values);
    });
  };
  React.useEffect(() => {
    getTagData();
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
    { field: "id", headerName: "SR.NO", width: 90, sortable: false },
    { field: "Question", headerName: "Question", width: 350 },
    { field: "Answer", headerName: "Answer", width: 350, flex: 1 },
  ];

  const handleUpdate = (rowData) => {
    setSaveUpdateButton("UPDATE");
    setOn(true);
    setSelectedTags(rowData.TagsIds);
    setData({
      Question: rowData.Question,
      Answer: rowData.Answer,
      QuestionL1: rowData.QuestionL1,
      AnswerL1: rowData.AnswerL1,
      Id: rowData._id,
      TagsIds: rowData.TagsIds,
      Category: "en",
    });
  };

  return (
    <>
      {loaderOpen && <Loader open={loaderOpen} />}
      <Modal open={on} onClose={handleClose}>
        <Paper
          elevation={10}
          sx={{
            width: "90%",
            maxWidth: 400,
            bgcolor: "#E6E6FA",
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
              <Typography fontWeight="bold">Add FAQS</Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon style={{ color: "black" }} />
              </IconButton>
            </Grid>

            <Grid item xs={12}>
              <FormControl
                sx={{ width: "150px" }}
                size="small"
                disabled={SaveUpdateButton === "SAVE"}
              >
                <InputLabel id="demo-select-large">
                  Select Language
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
                id="Question"
                label="Enter Question"
                name={data.Category === "en" ? "Question" : "QuestionL1"}
                value={data.Category === "en" ? data.Question : data.QuestionL1}
                onChange={onChangeHandler}
                autoFocus
                style={{ borderRadius: 10, width: "100%" }}
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

            <Grid item xs={12} paddingTop={1}>
              <TextField
                size="small"
                fullWidth
                // required
                id="Answer"
                label="Enter Answer"
                name={data.Category === "en" ? "Answer" : "AnswerL1"}
                value={data.Category === "en" ? data.Answer : data.AnswerL1}
                onChange={onChangeHandler}
                multiline
                rows={5}
                placeholder="Enter your Answer..."
              />
            </Grid>

            <Grid item xs={12} md={12} textAlign={"end"}>
              <Button
                type="submit"
                size="small"
                onClick={() => handleSubmitForm(data._id)}
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
          color={"#5C5CFF"}
          padding={1}
          noWrap
        >
          Manage FAQS
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
          Add FAQS
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
          />
        </Box>
      </Paper>
    </>
  );
};

export default ManageFAQ;
