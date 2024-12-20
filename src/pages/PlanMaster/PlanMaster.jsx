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
    Description:"",
    DietIds: [],
    ExerciseIds: [],
    VaccinationIds: [],
    MedTestIds: [],
    MedDetailsIds: [],
    Weight: {
      FromWeight: "",
      ToWeight: "",
    },

    Age: {
      FromAge: "",
      ToAge: "",
    },

    Height: {
      FromHeight: "",
      ToHeight: "",
    },

    Week: {
      FromWeek: "",
      ToWeek: "",
    },

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
      Age: {
        FromAge: "",
        ToAge: "",
      },

      Weight: {
        FromWeight: "",
        ToWeight: "",
      },

      Height: {
        FromHeight: "",
        ToHeight: "",
      },

      Week: {
        FromWeek: "",
        ToWeek: "",
      },
      Status: 1,
    });
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

  const getAllPlanMasterData = async() => {
    const token = await getApiToken();
    axios.get(`${BASE_URL}planmaster/`,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    }).then((response) => {
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
    const token = await getApiToken();
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
        .post(`${BASE_URL}planmaster/`, formattedData,{
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        })
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
          formattedData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
          }
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
    // const selectedValue = e.target.value;
    // const [fromHeight, toHeight] = selectedValue.split("-");

    // console.log(formData);
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleClick = (row) => {
  //   setSaveUpdateButton("UPDATE");
  //   setOpen(true);
  //   setFormData({
  //     ...row,
  //     MedDetailsIds: row.MedDetailsIds.map((data) => ({
  //       _id: data._id,
  //       Name: data.MedId.Name,
  //       Description: data.MedId.Description,
  //       DosageName: data.DosageId.Name,
  //       DosageDescription: data.DosageId.Description,
  //     })),
  //   });
  // };

  const handleClick = (row) => {
    setSaveUpdateButton("UPDATE");
    setOpen(true);
    setFormData({
      ...row,
      MedDetailsIds: row.MedDetailsIds.map((data) => ({
        _id: data._id,
        Name: data.MedId ? data.MedId.Name : "",
        Description: data.MedId ? data.MedId.Description : "",
        DosageName: data.DosageId ? data.DosageId.Name : "",
        DosageDescription: data.DosageId ? data.DosageId.Description : "",
      })),
    });
  };

  const handleDelete = async (id) => {
    try {
      const token = await getApiToken(); // Ensure token is fetched properly
      setLoaderOpen(true); // Show loader
  
      // Show confirmation dialog
      const result = await Swal.fire({
        text: "Are you sure you want to delete?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });
  
      if (result.isConfirmed) {
        // Proceed with the deletion if the user confirms
        const response = await axios.delete(`${BASE_URL}planmaster/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
  
        if (response.data.status) {
          // If delete was successful
          setData((prevData) => prevData.filter((user) => user._id !== id)); // Update the state by filtering out the deleted item
          Swal.fire({
            position: "center",
            icon: "success",
            toast: true,
            title: "Plan Master deleted successfully",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          // If deletion failed
          Swal.fire({
            icon: "error",
            toast: true,
            title: "Failed",
            text: "Failed to delete Plan Master",
            showConfirmButton: true,
          });
        }
      }
    } catch (error) {
      // Handle any errors from token fetch, axios request, or anything else
      console.error("Error during delete operation:", error);
      Swal.fire({
        icon: "error",
        toast: true,
        title: "Failed",
        text: error.message || "Something went wrong",
        showConfirmButton: true,
      });
    } finally {
      setLoaderOpen(false); // Hide loader, regardless of success or failure
    }
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
      sortable: true,
    },
    { field: "Name", headerName: "Name", width: 200, sortable: false },
    {
      field: "Description",
      headerName: "Description",
      width: 250,
      sortable: false,
    },
    // {
    //   field: "FromWeek",
    //   headerName: "FromWeek",
    //   width: 100,
    //   valueGetter: (params) => {
    //     return params.row.Week.FromWeek;
    //   },
    // },
    // {
    //   field: "ToWeek",
    //   headerName: "ToWeek",
    //   width: 100,
    //   valueGetter: (params) => {
    //     return params.row.Week.ToWeek;
    //   },
    // },
    {
      field: "Week",
      headerName: "Week",
      sortable: false,
      width: 200,
      valueGetter: (params) => {
        const FromWeek = params.row.Week.FromWeek;
        const ToWeek = params.row.Week.ToWeek;
        return `${FromWeek}-${ToWeek}`;
      },
    },
    // {
    //   field: "FromAge",
    //   headerName: "FromAge",
    //   width: 100,
    //   valueGetter: (params) => {
    //     return params.row.Age.FromAge;
    //   },
    // },
    // {
    //   field: "ToAge",
    //   headerName: "ToAge",
    //   width: 100,
    //   valueGetter: (params) => {
    //     return params.row.Age.ToAge;
    //   },
    // },

    {
      field: "Age",
      headerName: "Age",
      sortable: false,
      width: 200,
      valueGetter: (params) => {
        const fromAge = params.row.Age.FromAge;
        const toAge = params.row.Age.ToAge;
        return `${fromAge}-${toAge}`;
      },
    },

    // {
    //   field: "FromWeight",
    //   headerName: "FromWeight",
    //   width: 100,
    //   valueGetter: (params) => {
    //     return params.row.Weight.FromWeight;
    //   },
    // },
    // {
    //   field: "ToWeight",
    //   headerName: "ToWeight",
    //   width: 100,
    //   valueGetter: (params) => {
    //     return params.row.Weight.ToWeight;
    //   },
    // },
    {
      field: "Weight",
      headerName: "Weight",
      width: 200,
      sortable: false,
      valueGetter: (params) => {
        const FromWeight = params.row.Weight.FromWeight;
        const ToWeight = params.row.Weight.ToWeight;
        return `${FromWeight}-${ToWeight}`;
      },
    },
    // {
    //   field: "FromHeight",
    //   headerName: "FromHeight",
    //   width: 100,
    //   valueGetter: (params) => {
    //     return params.row.Height.FromHeight;
    //   },
    // },
    // {
    //   field: "ToHeight",
    //   headerName: "ToHeight",
    //   width: 100,
    //   valueGetter: (params) => {
    //     return params.row.Height.ToHeight;
    //   },
    // },
    {
      field: "Height",
      headerName: "Height",
      sortable: false,
      width: 200,
      valueGetter: (params) => {
        const FromHeight = params.row.Height.FromHeight;
        const ToHeight = params.row.Height.ToHeight;
        return `${FromHeight}-${ToHeight}`;
      },
    },

    // {
    //   field: "Status",
    //   headerName: "Status",
    //   width: 100,
    //   sortable: false,
    //   valueGetter: (params) => (params.row.Status === 1 ? "Active" : "Inactive"),
    //   renderCell: (params) => {
    //     const isActive = params.row.Status === 1;
    //     return (
    //       <span style={{ color: isActive ? 'green' : 'red' }}>
    //         {isActive ? 'Active' : 'Inactive'}
    //       </span>
    //     );
    //   },
    // },
    {
      field: "Status",
      headerName: "Status",
      width: 100,
      sortable: false,
      valueGetter: (params) =>
        params.row.Status === 1 ? "Active" : "Inactive",
      renderCell: (params) => {
        const isActive = params.row.Status === 1;
        return (
          <button
            style={isActive ? activeButtonStyle : inactiveButtonStyle}
            disabled
          >
            {isActive ? "Active" : "Inactive"}
          </button>
        );
      },
    },
  ];
  const buttonStyles = {
    border: "none",
    borderRadius: "4px",
    padding: "4px 8px",
    fontSize: "12px",
    cursor: "pointer",
    color: "#fff",
  };

  const activeButtonStyle = {
    ...buttonStyles,
    backgroundColor: "green",
  };

  const inactiveButtonStyle = {
    ...buttonStyles,
    backgroundColor: "red",
  };

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
      !formData.Age.FromAge ||
      !formData.Age.ToAge ||
      !formData.Weight.FromWeight ||
      !formData.Weight.ToWeight ||
      !formData.Height.FromHeight ||
      !formData.Height.ToHeight ||
      !formData.Week.FromWeek ||
      !formData.Week.ToWeek
    );
  };

  const handleFromWeekChange = (e) => {
    const fromWeekValue = e.target.value;
    const toWeekValue = formData.Week.ToWeek;

    setFormData({
      ...formData,
      Week: {
        FromWeek: fromWeekValue,
        ToWeek: toWeekValue,
      },
    });
  };

  const handleToWeekChange = (e) => {
    const toWeekValue = e.target.value;

    setFormData({
      ...formData,
      Week: {
        ...formData.Week,
        ToWeek: toWeekValue,
      },
    });
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
          // color={"#5C5CFF"}
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
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: (theme) => theme.palette.custome.datagridcolor,
            },
            "& .MuiDataGrid-row:hover": {
              boxShadow: "0px 4px 20px rgba(0, 0, 0.2, 0.2)", 
           },
          }}
        />
      </Grid>

      <Dialog
        open={open}
        onClose={handleParentDialogClose}
        aria-labelledby="parent-dialog-title"
        aria-describedby="parent-dialog-description"
        fullScreen
      >
        <DialogTitle
          sx={{
            color: "white",
            backgroundColor: (theme) =>
              theme.palette.customAppbar?.appbarcolor || "#5C5CFF",
          }}
        >
          <b>Plan Master</b>
          <IconButton
            aria-label="close"
            onClick={handleParentDialogClose}
            sx={{ color: "black", position: "absolute", top: 8, right: 8 }}
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
            // bgcolor: "#E6E6FA",
            backgroundColor: (theme) => theme.palette.background.default,

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
                <FormControl style={{ width: 220 }} size="small">
                  <InputLabel id="demo-select-small-label">
                    Select Age
                  </InputLabel>

                  <Select
                    type="number"
                    fullWidth
                    id="Age"
                    label="Enter Age"
                    name="Age"
                    // value={formData.Age}
                    // onChange={handleInputChange}
                    value={`${formData.Age.FromAge}-${formData.Age.ToAge}`}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      const [FromAge, ToAge] = selectedValue.split("-");
                      setFormData({
                        ...formData,
                        Age: {
                          FromAge: FromAge,
                          ToAge: ToAge,
                        },
                      });
                    }}
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
                  // size="small"
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
                <FormControl size="small" style={{ width: 220 }}>
                  <InputLabel id="demo-select-small-label">
                    Select Weight
                  </InputLabel>

                  <Select
                    type="number"
                    id="Weight"
                    label="Enter Weight"
                    name="Weight"
                    value={`${formData.Weight.FromWeight}-${formData.Weight.ToWeight}`}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      const [FromWeight, ToWeight] = selectedValue.split("-");
                      setFormData({
                        ...formData,
                        Weight: {
                          FromWeight: FromWeight,
                          ToWeight: ToWeight,
                        },
                      });
                    }}
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
              {/* <Grid item xs={12} sm={4} width={200}>
                <Paper
                  elevation={0}
                  style={{ padding: "1rem", textAlign: "center" }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    Select Weight
                  </Typography>

                  <Grid
                    container
                    spacing={1}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid item>
                      <FormControl style={{ width: 110 }} size="small">
                        <InputLabel id="from-select-label">From</InputLabel>
                        <Select
                          type="number"
                          fullWidth
                          id="FromWeight"
                          label="From"
                          name="FromWeight"
                          value={formData.Weight.FromWeight}
                          onChange={(e) => {
                            console.log(e.target.value);
                            setFormData({
                              ...formData,
                              Weight: {
                                ...formData.Weight,
                                FromWeight: e.target.value,
                              },
                            });
                          }}
                          MenuProps={{
                            PaperProps: { style: { maxHeight: 150 } },
                          }}
                        >
                          {[...Array(42).keys()].map((index) => (
                            <MenuItem key={index + 1} value={index + 1}>
                              {index + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <FormControl style={{ width: 110 }} size="small">
                        <InputLabel id="to-select-label">To</InputLabel>
                        <Select
                          type="number"
                          fullWidth
                          id="ToWeight"
                          label="To"
                          name="ToWeight"
                          value={formData.Weight.ToWeight}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              Weight: {
                                ...formData.Weight,
                                ToWeight: e.target.value,
                              },
                            })
                          }
                          MenuProps={{
                            PaperProps: { style: { maxHeight: 150 } },
                          }}
                        >
                          {[...Array(42).keys()].map((index) => (
                            <MenuItem
                              key={index + 1}
                              value={index + 1}
                              disabled={index + 1 < formData.Weight.FromWeight}
                            >
                              {index + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid> */}

              {/* <Grid item xs={12} sm={4} width={200}>
                <Paper
                  elevation={0}
                  style={{ padding: "1rem", textAlign: "center" }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    Select Height
                  </Typography>

                  <Grid
                    container
                    spacing={1}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid item>
                      <FormControl style={{ width: 110 }} size="small">
                        <InputLabel id="from-select-label">From</InputLabel>
                        <Select
                          type="number"
                          fullWidth
                          id="FromHeight"
                          label="From"
                          name="FromHeight"
                          value={formData.Height.FromHeight}
                          onChange={(e) => {
                            console.log(e.target.value);
                            setFormData({
                              ...formData,
                              Height: {
                                ...formData.Height,
                                FromHeight: e.target.value,
                              },
                            });
                          }}
                          MenuProps={{
                            PaperProps: { style: { maxHeight: 150 } },
                          }}
                        >
                          {[...Array(7).keys()].map((index) => (
                            <MenuItem key={index + 1} value={index + 1}>
                              {index + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <FormControl style={{ width: 110 }} size="small">
                        <InputLabel id="to-select-label">To</InputLabel>
                        <Select
                          type="number"
                          fullWidth
                          id="ToHeight"
                          label="To"
                          name="ToHeight"
                          value={formData.Height.ToHeight}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              Height: {
                                ...formData.Height,
                                ToHeight: e.target.value,
                              },
                            })
                          }
                          MenuProps={{
                            PaperProps: { style: { maxHeight: 150 } },
                          }}
                        >
                          {[...Array(7).keys()].map((index) => (
                            <MenuItem
                              key={index + 1}
                              value={index + 1}
                              disabled={index + 1 < formData.Height.FromHeight}
                            >
                              {index + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid> */}

              <Grid item xs={12} sm={4}>
                <FormControl style={{ width: 220 }} size="small">
                  <InputLabel id="demo-select-small-label">
                    Select Height
                  </InputLabel>

                  <Select
                    type="number"
                    fullWidth
                    id="Height"
                    label="Enter Height"
                    name="Height"
                    value={`${formData.Height.FromHeight}-${formData.Height.ToHeight}`}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      const [FromHeight, ToHeight] = selectedValue.split("-");
                      setFormData({
                        ...formData,
                        Height: {
                          FromHeight: FromHeight,
                          ToHeight: ToHeight,
                        },
                      });
                    }}
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

              <Grid
                item
                xs={12}
                sm={4}
                width={200}
                sx={
                  {
                    // backgroundColor: (theme) => theme.palette.secondary.default,
                  }
                }
              >
                {/* <Paper
                  elevation={0}
                  style={{ padding: "0rem", textAlign: "center" }}
                > */}
                  <Grid
                    container
                    spacing={1}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid item>
                      <FormControl style={{ width: 120 }} size="small">
                        <InputLabel id="from-select-label">
                          From week
                        </InputLabel>
                        <Select
                          type="number"
                          fullWidth
                          id="FromWeek"
                          label="From"
                          name="FromWeek"
                          value={formData.Week.FromWeek}
                          onChange={handleFromWeekChange}
                          MenuProps={{
                            PaperProps: { style: { maxHeight: 150 } },
                          }}
                        >
                          {[...Array(42).keys()].map((index) => (
                            <MenuItem key={index + 1} value={index + 1}>
                              {index + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <FormControl style={{ width: 120 }} size="small">
                        <InputLabel id="to-select-label">To week</InputLabel>
                        <Select
                          type="number"
                          fullWidth
                          id="ToWeek"
                          label="To"
                          name="ToWeek"
                          value={formData.Week.ToWeek}
                          onChange={handleToWeekChange}
                          disabled={!formData.Week.FromWeek}
                          MenuProps={{
                            PaperProps: { style: { maxHeight: 150 } },
                          }}
                        >
                          {[...Array(42).keys()].map((index) => (
                            <MenuItem
                              key={index + 1}
                              value={index + 1}
                              disabled={index + 1 < formData.Week.FromWeek}
                              style={{
                                opacity:
                                  index + 1 < formData.Week.FromWeek ? 0.5 : 1,
                              }}
                            >
                              {index + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                {/* </Paper> */}
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
