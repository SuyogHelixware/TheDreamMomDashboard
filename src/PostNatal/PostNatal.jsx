import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { BASE_URL } from "../Constant";

import PostNatalDiet from "./PostNatalDiet";
import PostNatalVaccination from "./PostNatalVaccination";
import PostNatalMedication from "./PostNatalMedication";
import PostNatalExercise from "./PostNatalExercise";
import PostNatalMedical from "./PostNatalMedical";
import Loader from "../components/Loader";
import InputTextField, { InputDescriptionField } from "../components/Component";

const PostNatal = () => {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    DietIds: [],
    ExerciseIds: [],
    VaccinationIds: [],
    MedTestIds: [],
    MedDetailsIds: [],
    Age: "",
    Weight: "",
    Height: "",
    Week: "",
    Status: 1,
  });
  // const [oldData, setOldData] = useState({
  //   DietIds: [],
  //   ExerciseIds: [],
  //   VaccinationIds: [],
  //   MedTestIds: [],
  //   MedDetailsIds: [],
  // });
  // const handleClose = () => {
  //   setOpen(false);
  // };

  const getAllPostNatalData = () => {
    axios.get(`${BASE_URL}postnatal`).then((response) => {
      setData(response.data.values);
    });
  };

  React.useEffect(() => {
    getAllPostNatalData();
  }, []);

  const handleParentDialogOpen = () => {
    setOpen(true);
    setSaveUpdateButton("SAVE");
  };

  const handleParentDialogClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    const UpdateObj = {
      Firstname: data.Firstname,
      Middlename: data.Middlename,
      Lastname: data.Lastname,
      DOB: data.DOB,
      Password: data.Password,
      Phone: data.Phone,
      Email: data.Email,
      Address: data.Address,
      BloodGroup: data.BloodGroup,
      UserType: "P",
    };

    setLoaderOpen(true);

    if (SaveUpdateButton === "SAVE") {
      const formattedData = {
        ...formData,
        DietIds: formData.DietIds,
        ExerciseIds: formData.ExerciseIds,
        VaccinationIds: formData.VaccinationIds,
        MedTestIds: formData.MedTestIds,
        MedDetailsIds: formData.MedDetailsIds,
      };
      console.log(formattedData);

      handleParentDialogClose();
      axios
        .post(`${BASE_URL} postnatal/`, formattedData)
        .then((response) => {
          if (response.data.status) {
            setLoaderOpen(false);
            Swal.fire({
              position: "center",
              icon: "success",
              toast: true,
              title: "Post Natal Saved Successfully",
              showConfirmButton: false,
              timer: 1500,
            });
            const newPostData = response.data.values;
            setData((prevData) => [...prevData, newPostData]);
            handleParentDialogClose();
          } else {
            setLoaderOpen(false);
            Swal.fire({
              position: "center",
              icon: "error",
              toast: true,
              title: "Failed to save Post Natal",
              text: response.data.message,
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((error) => {
          setLoaderOpen(false);
          Swal.fire({
            icon: "error",
            toast: true,
            title: "Error saving Post Natal",
            text: error.message,
            showConfirmButton: true,
          });
        });
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
        const response = await axios.patch(
          `${BASE_URL} PostNatal/${data._id}`,
          UpdateObj
        );
        console.log(response);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClick = (row) => {
    console.log(row);
    setSaveUpdateButton("UPDATE");
    setOpen(true);
    // setOldData(row);
    setFormData(row);
    // setImage(`${Bunny_Image_URL}/Users/${row.Firstname}/${row.Avatar}`);
  };

  const handleDelete = (id) => {
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
          .delete(`${BASE_URL} PostNatal/${id}`)
          .then((response) => {
            if (response.data.status) {
              setLoaderOpen(false);
              setData(data.filter((user) => user._id !== id));
              Swal.fire({
                position: "center",
                icon: "success",
                toast: true,
                title: "Post Natal deleted Successfully",
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              setLoaderOpen(false);
              Swal.fire({
                icon: "error",
                toast: true,
                title: "Failed",
                text: "Failed to Delete Post Natal",
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
      }
      setLoaderOpen(false);
    });
  };

  const columns = [
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <strong>
          <IconButton color="primary" onClick={() => handleClick(params.row)}>
            <EditNoteIcon />
          </IconButton>
          <Button
            size="medium"
            sx={{ color: "red" }}
            onClick={() => handleDelete(params.row._id)}
          >
            <DeleteForeverIcon />
          </Button>
        </strong>
      ),
    },
    {
      field: "Sr.No",
      headerName: "SrNo",
      width: 100,
    },
    { field: "Name", headerName: "Name", width: 250 },
    { field: "Description", headerName: "Description", width: 400 },
    {
      field: "Age",
      headerName: "Age",
      width: 100,
    },
    { field: "Height", headerName: "Height", width: 100 },
    { field: "Weight", headerName: "Weight", width: 100 },
    { field: "Status", headerName: "Status", width: 100 },
  ];

  const receiveDataFromDiet = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      DietIds: data.map((diet) => diet.id),
    }));
  };

  const receiveDataFromExercise = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      ExerciseIds: data.map((exercise) => exercise.id),
    }));
  };

  const receiveDataFromVaccination = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      VaccinationIds: data.map((vaccination) => vaccination.id),
    }));
  };

  const receiveDataFromMedication = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      MedDetailsIds: data.map((medication) => medication.id),
    }));
  };

  const receiveDataFromMedicalTest = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      MedTestIds: data.map((medicalTest) => medicalTest.id),
    }));
  };

  return (
    <>
      {loaderOpen && <Loader open={loaderOpen} />}
      <Grid
        container
        xs={12}
        sm={12}
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
          Post Natal
        </Typography>
      </Grid>

      <Grid textAlign={"end"} marginBottom={1}>
        <Button
          onClick={handleParentDialogOpen}
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
          Open Post Natal
        </Button>
      </Grid>

      <Grid container item height={500} lg={12} component={Paper}>
        <DataGrid
          className="datagrid-style"
          rows={data.map((data, index) => ({
            ...data,
            SrNo: index + 1,
          }))}
          rowHeight={70}
          getRowId={(row) => row._id}
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
      </Grid>

      <Dialog
        open={open}
        onClose={handleParentDialogClose}
        aria-labelledby="parent-dialog-title"
        aria-describedby="parent-dialog-description"
        fullScreen
        // fullWidth
      >
        <DialogTitle>
          <b>Post Natal</b>
          <IconButton
            aria-label="close"
            onClick={handleParentDialogClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            background: "linear-gradient(to right,#E5D9F2, #CDC1FF)",
            overflowY: { xs: "scroll", md: "auto" },
            "&::-webkit-scrollbar": {
              display: "none",
            },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <Grid container spacing={2} pt={3}>
            <Grid item xs={12} sm={4}>
              <InputTextField
                size="small"
                fullWidth
                id="Name"
                label="Enter Name"
                name="Name"
                value={formData.Name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputTextField
                size="small"
                fullWidth
                id="Age"
                label="Enter Age"
                name="Age"
                value={formData.Age}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputDescriptionField
                size="small"
                required
                fullWidth
                id="Description"
                label="Enter Description"
                name="Description"
                multiline
                rows={3}
                value={formData.Description}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputTextField
                size="small"
                fullWidth
                id="Weight"
                label="Enter Weight"
                name="Weight"
                value={formData.Weight}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputTextField
                size="small"
                fullWidth
                id="Height"
                label="Enter Height"
                name="Height"
                value={formData.Height}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputTextField
                size="small"
                fullWidth
                id="Week"
                label="Enter Week"
                name="Week"
                value={formData.Week}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          <PostNatalDiet
            sendDataToParent={receiveDataFromDiet}
            dietData={formData.DietIds}
          />
          <PostNatalVaccination
            sendVaccinationDataToParent={receiveDataFromVaccination}
            vaccinationData={formData.VaccinationIds}
          />
          <PostNatalMedication
            sendMedicationDataToParent={receiveDataFromMedication}
            medicationData={formData.MedDetailsIds}
          />
          <PostNatalExercise
            sendExerciseDataToParent={receiveDataFromExercise}
            exerciseData={formData.ExerciseIds}
          />
          <PostNatalMedical
            sendMedicalTestDataToParent={receiveDataFromMedicalTest}
            medTestData={formData.MedTestIds}
          />

          <DialogActions>
            <Button
              sx={{
                p: 1,
                px: 4,
                color: "white",
                backgroundColor: "#8F00FF",
                boxShadow: 5,
                position: "fixed",
                bottom: 10,
                right: 10,
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
              onClick={handleSave}
            >
              {SaveUpdateButton}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostNatal;
