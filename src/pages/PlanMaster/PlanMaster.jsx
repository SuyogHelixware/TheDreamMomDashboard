import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { BASE_URL } from "../../Constant";
import InputTextField, {
  InputDescriptionField,
} from "../../components/Component";
import Loader from "../../components/Loader";
import PlanMasterDiet from "./PlanMasterDiet";
import PlanMasterExercise from "./PlanMasterExercise";
import PlanMasterMedical from "./PlanMasterMedical";
import PlanMasterMedication from "./PlanMasterMedication";
import PlanMasterVaccination from "./PlanMasterVaccination";

const PlanMaster = () => {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
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

  const ClearForm = () => {
    setFormData({
      id: "",
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
  };

  const getAllPlanMasterData = () => {
    axios.get(`${BASE_URL}planmaster/`).then((response) => {
      setData(response.data.values);
    });
  };

  React.useEffect(() => {
    getAllPlanMasterData();
  }, []);

  const handleParentDialogOpen = () => {
    setOpen(true);
    setSaveUpdateButton("SAVE");
  };

  const handleParentDialogClose = () => {
    ClearForm();
    setOpen(false);
  };

  const handleSave = async () => {
    const formattedData = {
      ...formData,
      DietIds: formData.DietIds ? formData.DietIds.map((diet) => diet._id) : [],
      ExerciseIds: formData.ExerciseIds
        ? formData.ExerciseIds.map((exercise) => exercise._id)
        : [],
      VaccinationIds: formData.VaccinationIds
        ? formData.VaccinationIds.map((vaccination) => vaccination._id)
        : [],
      MedTestIds: formData.MedTestIds
        ? formData.MedTestIds.map((medTest) => medTest._id)
        : [],
      MedDetailsIds: formData.MedDetailsIds
        ? formData.MedDetailsIds.map((medDet) => medDet._id)
        : [],
    };

    setLoaderOpen(true);

    if (SaveUpdateButton === "SAVE") {
      handleParentDialogClose();
      axios
        .post(`${BASE_URL}planmaster/`, formattedData)
        .then((response) => {
          if (response.data.status) {
            setLoaderOpen(false);
            getAllPlanMasterData();
            Swal.fire({
              position: "center",
              icon: "success",
              toast: true,
              title: "Plan master Saved Successfully",
              showConfirmButton: false,
              timer: 1500,
            });
            const newPlanData = response.data.values;
            setData((prevData) => [...prevData, newPlanData]);
            handleParentDialogClose();
          } else {
            setLoaderOpen(false);
            Swal.fire({
              position: "center",
              icon: "error",
              toast: true,
              title: "Failed to save plan master",
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
            title: "Error saving plan master",
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
          `${BASE_URL}planmaster/${formData._id}`,
          formattedData
        );
        if (response.data.status) {
          ClearForm();
          handleParentDialogClose();
          setLoaderOpen(false);
          getAllPlanMasterData();
          Swal.fire({
            position: "center",
            icon: "success",
            toast: true,
            title: "Plan master update Successfully",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          setLoaderOpen(false);
          Swal.fire({
            position: "center",
            icon: "error",
            toast: true,
            title: "Failed to update plan master",
            text: response.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } else {
        setLoaderOpen(false);
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
    setSaveUpdateButton("UPDATE");
    setOpen(true);
    setFormData({
      ...row,
      MedDetailsIds: row.MedDetailsIds.map((data) => ({
        _id: data._id,
        Name: data.MedId.Name,
        Description: data.MedId.Description,
        DosageName: data.DosageId.Name,
        DosageDescription: data.DosageId.Description,
      })),
    });
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
          .delete(`${BASE_URL}planmaster/${id}`)
          .then((response) => {
            if (response.data.status) {
              setLoaderOpen(false);
              setData(data.filter((user) => user._id !== id));
              Swal.fire({
                position: "center",
                icon: "success",
                toast: true,
                title: "Plan Master deleted Successfully",
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              setLoaderOpen(false);
              Swal.fire({
                icon: "error",
                toast: true,
                title: "Failed",
                text: "Failed to Delete Plan Master",
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
      field: "id",
      headerName: "Sr.No",
      width: 100,
    },
    { field: "Name", headerName: "Name", width: 150 },
    { field: "Description", headerName: "Description", width: 250 },
    {
      field: "Week",
      headerName: "Week",
      width: 100,
    },
    {
      field: "Age",
      headerName: "Age",
      width: 100,
    },
    { field: "Height", headerName: "Height", width: 100 },
    { field: "Weight", headerName: "Weight", width: 100 },
    {
      field: "Status",
      headerName: "Status",
      width: 100,
      sortable: false,
      valueGetter: (params) =>
        params.row.Status === 1 ? "Active" : "InActive",
    },
  ];

  const receiveDataFromDiet = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      DietIds: [...data],
    }));
  };

  const receiveDataFromExercise = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      ExerciseIds: [...data],
    }));
  };

  const receiveDataFromVaccination = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      VaccinationIds: [...data],
    }));
  };

  const receiveDataFromMedication = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      MedDetailsIds: [...data],
    }));
  };

  const receiveDataFromMedicalTest = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      MedTestIds: [...data],
    }));
  };

  const isSaveDisabled = () => {
    return (
      !formData.Name ||
      !formData.Description ||
      !formData.Age ||
      !formData.Weight ||
      !formData.Height ||
      !formData.Week
    );
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
        className="slide-in-text"
          width={"100%"}
          textAlign="center"
          textTransform="uppercase"
          fontWeight="bold"
          color={"#5C5CFF"}
          padding={1}
          noWrap
        >
          Plan Master
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
          Open Plan Master
        </Button>
      </Grid>

      <Grid container item height={500} lg={12} component={Paper}>
        <DataGrid
          className="datagrid-style"
          rows={data.map((data, id) => ({ ...data, id: id + 1 }))}
          // rowHeight={70}
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
        <DialogTitle style={{ color: "white", backgroundColor: "#5C5CFF" }}>
          <b>Plan Master</b>
          <IconButton
            aria-label="close"
            onClick={handleParentDialogClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon
              style={{
                backgroundColor: "white",
                borderRadius: 50,
                height: 32,
                width: 32,
                boxShadow: "0px 6px 6px 0px rgba(0, 0, 0, 0.25)", 
              }}
            ></CloseIcon>
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            // background: "linear-gradient(to right,#E5D9F2, #CDC1FF)",
            bgcolor: "#E6E6FA",
            overflowY: { xs: "scroll", md: "auto" },
            "&::-webkit-scrollbar": {
              display: "none",
            },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              padding: 3,
              marginTop: 3,
              textAlign: "center",
              display: "inline-block",
            }}
          >
            <Grid container spacing={2} pt={3}>
              <Grid item xs={12} sm={4}>
                <InputTextField
                  size="small"
                  fullWidth
                  id="Name"
                  label="Enter Title"
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl style={{ width: 220 }} size="small"  >
                  <InputLabel id="demo-select-small-label">
                    Select Age
                  </InputLabel>

                  <Select
                    type="number"
                    fullWidth
                    id="Age"
                    label="Enter Age"
                    name="Age"
                    value={formData.Age}
                    onChange={handleInputChange}
                    style={{ textAlign: "left" }}
                    MenuProps={{ PaperProps: { style: { maxHeight: 150 } } }}
                  >
                    <MenuItem value="0-20">Below-20</MenuItem>
                    <MenuItem value="21-25">21-25</MenuItem>
                    <MenuItem value="26-30">26-30</MenuItem>
                    <MenuItem value="31-35">31-35</MenuItem>
                    <MenuItem value="36-40">36-40</MenuItem>
                    <MenuItem value="41-45">41-45</MenuItem>
                    <MenuItem value="46-50">46-50</MenuItem>
                    <MenuItem value="51-99">51-Above</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputDescriptionField
                  size="small"
                   
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
                <FormControl size="small"   style={{ width: 220 }}>
                  <InputLabel id="demo-select-small-label">
                    Select Weight
                  </InputLabel>

                  <Select
                    type="number"
                    id="Weight"
                    label="Enter Weight"
                    name="Weight"
                    onChange={handleInputChange}
                    value={formData.Weight}
                    style={{ textAlign: "left" }}
                    MenuProps={{
                      PaperProps: { style: { maxHeight: 150, maxWidth: 220 } },
                    }}
                  >
                    <MenuItem value="0-25">Below-25</MenuItem>
                    <MenuItem value="26-30">26-30</MenuItem>
                    <MenuItem value="31-35">31-35</MenuItem>
                    <MenuItem value="36-40">36-40</MenuItem>
                    <MenuItem value="41-45">41-45</MenuItem>
                    <MenuItem value="46-50">46-50</MenuItem>
                    <MenuItem value="51-55">51-55</MenuItem>
                    <MenuItem value="56-60">56-60</MenuItem>
                    <MenuItem value="61-99">61-Above</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl style={{ width: 220 }} size="small"  >
                  <InputLabel id="demo-select-small-label">
                    Select Height
                  </InputLabel>

                  <Select
                    type="number"
                    fullWidth
                    id="Height"
                    label="Enter Height"
                    name="Height"
                    value={formData.Height}
                    onChange={handleInputChange}
                    style={{ textAlign: "left" }}
                    MenuProps={{ PaperProps: { style: { maxHeight: 150 } } }}
                  >
                    <MenuItem value="0-4">0-4 ft</MenuItem>
                    <MenuItem value="4-5">4-5 ft</MenuItem>
                    <MenuItem value="5-6">5-6 ft</MenuItem>
                    <MenuItem value="6-7">6-7 ft</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl style={{ width: 220 }} size="small"  >
                  <InputLabel id="demo-select-small-label">
                    Select Week
                  </InputLabel>

                  <Select
                    type="number"
                    fullWidth
                    id="Week"
                    label="Enter Week"
                    name="Week"
                    value={formData.Week}
                    onChange={handleInputChange}
                    style={{ textAlign: "left" }}
                    MenuProps={{ PaperProps: { style: { maxHeight: 150 } } }}
                  >
                    <MenuItem value="1-6">1-6</MenuItem>
                    <MenuItem value="7-12">7-12</MenuItem>
                    <MenuItem value="13-18">13-18</MenuItem>
                    <MenuItem value="19-24">19-24</MenuItem>
                    <MenuItem value="25-30">25-30</MenuItem>
                    <MenuItem value="31-36">31-36</MenuItem>
                    <MenuItem value="37-42">37-42</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          <PlanMasterDiet
            sendDataToParent={receiveDataFromDiet}
            dietData={formData.DietIds}
          />
          <PlanMasterVaccination
            sendVaccinationDataToParent={receiveDataFromVaccination}
            vaccinationData={formData.VaccinationIds}
          />
          <PlanMasterMedication
            sendMedicationDataToParent={receiveDataFromMedication}
            medicationData={formData.MedDetailsIds}
          />
          <PlanMasterExercise
            sendExerciseDataToParent={receiveDataFromExercise}
            exerciseData={formData.ExerciseIds}
          />
          <PlanMasterMedical
            sendMedicalTestDataToParent={receiveDataFromMedicalTest}
            medTestData={formData.MedTestIds}
          />

          <DialogActions>
            <Button
              sx={{
                p: 1,
                px: 4,
                backgroundColor: "#5C5CFF",
                boxShadow: 5,
                position: "fixed",
                bottom: 10,
                right: 10,
                color: "white",
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
              onClick={handleSave}
              disabled={isSaveDisabled()}
            >
              {SaveUpdateButton}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlanMaster;
