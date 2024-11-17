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
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { BASE_URL } from "../Constant";
import InputTextField, { InputDescriptionField } from "../components/Component";
import Loader from "../components/Loader";
import PostNatalDiet from "./PostNatalDiet";
import PostNatalExercise from "./PostNatalExercise";
import PostNatalMedication from "./PostNatalMedication";
import PostNatalPrecaution from "./PostNatalPrecaution";
import PostNatalVaccination from "./PostNatalVaccination";
const PostNatal = () => {
  const [loaderOpen, setLoaderOpen] = useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = useState("UPDATE");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);

  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    DietIds: [],
    ExerciseIds: [],
    VaccinationIds: [],
    PrecautionIds: [],
    MedDetailsIds: [],
    Week: {
      FromWeek: "",
      ToWeek: "",
    },
    Status: 1,
  });

  const clearFormData = () => {
    setFormData({
      Name: "",
      Description: "",
      DietIds: [],
      ExerciseIds: [],
      VaccinationIds: [],
      PrecautionIds: [],
      MedDetailsIds: [],
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

  const getAllPostNatalData = async() => {
    const token = await getApiToken();
    axios.get(`${BASE_URL}postnatal`,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    }).then((response) => {
      setData(response.data.values);
    });
  };

  useEffect(() => {
    getAllPostNatalData();
  }, []);

  const handleParentDialogOpen = () => {
    setOpen(true);
    setSaveUpdateButton("SAVE");
  };

  const handleParentDialogClose = () => {
    clearFormData();
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
      PrecautionIds: formData.PrecautionIds
        ? formData.PrecautionIds.map((medTest) => medTest._id)
        : [],
      MedDetailsIds: formData.MedDetailsIds
        ? formData.MedDetailsIds.map((medDet) => medDet._id)
        : [],
    };

    setLoaderOpen(true);

    if (SaveUpdateButton === "SAVE") {
      handleParentDialogClose();
      axios
        .post(`${BASE_URL}postnatal/`, formattedData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        })
        .then((response) => {
          if (response.data.status) {
            setLoaderOpen(false);
            getAllPostNatalData();
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
          `${BASE_URL}postnatal/${formData._id}`,
          formattedData,{
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
          }
        );
        if (response.data.status) {
          clearFormData();
          handleParentDialogClose();
          setLoaderOpen(false);
          getAllPostNatalData();
          Swal.fire({
            position: "center",
            icon: "success",
            toast: true,
            title: "Post Natal update Successfully",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          setLoaderOpen(false);
          Swal.fire({
            position: "center",
            icon: "error",
            toast: true,
            title: "Failed to update Post Natal",
            text: response.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
        }
        // console.log(response);
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

  // const handleClick = (row) => {
  //   // console.log(row);
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

  const handleDelete = async(id) => {
    const token = await getApiToken();
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
          .delete(`${BASE_URL}PostNatal/${id}`,{
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
          })
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

  const validateForm = () => {
    const { Name, Description, Week } = formData;
    return Name && Description && Week;
  };

  const columns = [
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      sortable: false,
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
    { field: "Name", headerName: "Name", width: 250, sortable: false },
    {
      field: "Description",
      headerName: "Description",
      flex: 1,
      sortable: false,
    },

    {
      field: "Week",
      headerName: "Week",
      width: 120,
      sortable: false,
      valueGetter: (params) => {
        const FromWeek = params.row.Week.FromWeek;
        const ToWeek = params.row.Week.ToWeek;
        return `${FromWeek}-${ToWeek}`;
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
    // }
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

  const receiveDataFromPrecaution = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      PrecautionIds: [...data],
    }));
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
          Open Post Natal
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
        elevation={7}
        component={Paper}
        boxShadow={20}
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
          <b>Post Natal</b>
          <IconButton
            aria-label="close"
            onClick={handleParentDialogClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon
              style={{
                backgroundColor: "white",
                color: "black",
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

              {/* <Grid item xs={12} sm={4}>
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
              </Grid> */}
              {/* --------------------------------------------- */}
              <Grid item xs={12} sm={4} width={200} >
                {/* <Paper
                  elevation={0}
                  style={{ padding: "0rem", textAlign: "center" , backgroundColor:"yellow" }}
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
              {/* --------------------------------------------- */}
              <Grid item xs={12} sm={4}>
                <InputDescriptionField
                  size="small"
                  fullWidth
                  id="Description"
                  label="Enter Description"
                  name="Description"
                  multiline
                  rows={2}
                  value={formData.Description}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Paper>
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
          <PostNatalPrecaution
            sendPrecautionDataToParent={receiveDataFromPrecaution}
            PrecautionData={formData.PrecautionIds}
          />

          <DialogActions>
            <Button
              sx={{
                p: 1,
                px: 4,
                color: "white",
                backgroundColor: "#5C5CFF",

                boxShadow: 5,
                position: "fixed",
                bottom: 10,
                right: 10,
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
              disabled={!validateForm()}
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
