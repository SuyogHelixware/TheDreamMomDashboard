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
   
  const ClearForm=()=>{
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
    
  }

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
    console.log(formattedData);

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
    ClearForm();
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
          width={"100%"}
          textAlign="center"
          textTransform="uppercase"
          fontWeight="bold"
          color={"#673AB7"}
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
          Open Plan Master
        </Button>
      </Grid>

      <Grid container item height={500} lg={12} component={Paper}>
        <DataGrid
          className="datagrid-style"
          rows={data.map((data, id) => ({ ...data, id: id + 1 }))}
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
         <DialogTitle style={{ color: "white", backgroundColor: "#6f5eb7" }}>
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
              }}
            ></CloseIcon>
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
           <Paper elevation={3} sx={{ width:"100%",  padding: 3,marginTop: 3,  textAlign: 'center',      
      display: 'inline-block'}} >
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
                type="number"                
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
                type="number"
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
                type="number"
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
                type="number"
                fullWidth
                id="Week"
                label="Enter Week"
                name="Week"
                value={formData.Week}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid></Paper>

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
