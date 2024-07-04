import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Box, Chip, Paper } from "@mui/material";
import Swal from "sweetalert2";
import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import * as React from "react";
import { BASE_URL } from "../../Constant";
import Loader from "../../components/Loader";

const Medical = () => {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [imgData, setImgData] = React.useState({
    Name: "",
    Description: "",
    NameL1: "",
    DescriptionL1: "",
    // Image: "",
    Category:"en",
  });
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [selectedTags, setSelectedTags] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [data, setData] = React.useState({
    Name: "",
    NameL1: "",
    Description: "",
    DescriptionL1: "",
    Id: "",
    Category:"en",
  });

  const clearFormData = () => {
    setData({
      Id: "",
      Name: "",
      NameL1: "",
      Description: "",
      DescriptionL1: "",
      // Image: "",
      TagsIds: [],
      Status: 1,
    });
    setSelectedTags([]);
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
      Category:"en",
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
      timer: 2500,
    });
  };

  const handleSubmitForm = () => {
    const requiredFields = ["Name", "Description"];
    const emptyRequiredFields = requiredFields.filter(
      (field) => !data[field] || !data[field].trim()
    );

    if (emptyRequiredFields.length > 0 || selectedTags.length === 0) {
      validationAlert("Please fill in all required fields");
      return;
    }

    const saveObj = {
      Name: data.Name,
      Description: data.Description,
      NameL1: data.NameL1,
      DescriptionL1: data.DescriptionL1,
      TagsIds: selectedTags.map((tag) => tag._id),
    };
    const UpdateObj = {
      Name: data.Name,
      Description: data.Description,
      NameL1: data.NameL1,
      DescriptionL1: data.DescriptionL1,
      TagsIds: selectedTags.map((tag) => tag._id),
    };
    setLoaderOpen(true);

    const axiosRequest =
      SaveUpdateButton === "SAVE"
        ? axios.post(`${BASE_URL}medicaltests`, saveObj)
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
                `${BASE_URL}medicaltests/${data.Id}`,
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
                ? "Data Added Successfully"
                : "Data Updated Successfully",
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
    axios.get(`${BASE_URL}medicaltests/`).then((response) => {
      const updatedImgData = response.data.values.flat().map((item, index) => ({
        ...item,
        id: index + 1,
      }));
      setImgData(updatedImgData);
    });
  };

  const getTagData = () => {
    axios.get(`${BASE_URL}tags`).then((response) => {
      setTags(response.data.values);
    });
  };

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
    { field: "id", headerName: "SR.No", width: 100, sortable: false },
    { field: "Name", headerName: "Title", width: 250 },
    { field: "Description", headerName: "Description", width: 300 ,flex:1},
  ];

  const handleDelete = (data) => {
    setLoaderOpen(true);
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
          .delete(`${BASE_URL}medicaltests/${data._id}`)
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
                text: "Failed to Delete!",
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
      setLoaderOpen(false);
    });
  };

  const handleUpdate = (data) => {
    setSaveUpdateButton("UPDATE");
    setOn(true);
    setSelectedTags(data.TagsIds);
    setData({
      Name: data.Name,
      Description: data.Description,
      NameL1: data.NameL1,
      DescriptionL1: data.DescriptionL1,
      // Image: data.Image,
      Id: data._id,
      TagsIds: data.TagsIds,
      Category:"en",
    });
    console.log(data);
  };

  React.useEffect(() => {
    getAllImgList();
    getTagData();
  }, []);

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
            spacing={3}
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
              <Typography fontWeight="bold">Add Medical Test</Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon style={{ color: "black" }} />
              </IconButton>
            </Grid>
    
    <Grid item xs={12}>
              <FormControl sx={{ width: "110px" }} size="small"
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
                  <MenuItem value="en" >
                    English
                  </MenuItem>
                  <MenuItem value="mr" >
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
                name={data.Category==="en"? "Name" :"NameL1"}
                value={data.Category==="en"? data.Name : data.NameL1}
                onChange={onchangeHandler}
                autoFocus
                style={{ borderRadius: 10, width: "100%" }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth size="small" 
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
                id="Description"
                label="Enter Description"
                name={data.Category==="en"? "Description": "DescriptionL1"}
                value={data.Category==="en"? data.Description : data.DescriptionL1 }
               
                onChange={onchangeHandler}
                multiline
                rows={3}
                placeholder="Enter your Description..."
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
                  boxShadow: 5,
                  color: "white",
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
          Manage Medical Test
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
          Add Medical Test
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

export default Medical;
