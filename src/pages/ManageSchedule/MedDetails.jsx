import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import * as React from "react";
import Swal from "sweetalert2";
import { BASE_URL } from "../../Constant";
import Loader from "../../components/Loader";

const MedDetails = () => {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [imgData, setImgData] = React.useState([]);
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [medications, setMedications] = React.useState([]);
  const [Dosage, setDosage] = React.useState([]);
  const [data, setData] = React.useState({
    medication: "",
    Dosage: "",
  });

  const clearFormData = () => {
    setData({
      medication: "",
      Dosage: "",
    });
  };

  const handleClose = () => {
    setOn(false);
  };

  const handleOnSave = () => {
    setSaveUpdateButton("SAVE");
    setOn(true);
    clearFormData();
  };

  const onChangeHandler = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmitForm = () => {
    const saveObj = {
      MedId: data.medication,
      DosageId: data.Dosage,
    };

    setLoaderOpen(true);

    const axiosRequest =
      SaveUpdateButton === "SAVE"
        ? axios.post(`${BASE_URL}medicationdet`, saveObj)
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
                `${BASE_URL}medicationdet/${data.Id}`,
                saveObj
              );
            } else {
              throw new Error("Update cancelled");
            }
          });

    axiosRequest
      .then((response) => {
        setLoaderOpen(false);
        if (response.data.status) {
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
          getAllMedDetails();
          handleClose();
        } else {
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

  const getAllMedDetails = () => {
    axios.get(`${BASE_URL}medicationdet/`).then((response) => {
      const updatedMedicationData = response.data.values
        .flat()
        .map((item, index) => ({
          _id: item._id,
          id: index + 1,
          Medication: item.MedId?.Name || "",
          MedicationId: item.MedId?._id || "",
          Dosage: item.DosageId?.Name || "",
          DosageId: item.DosageId?._id || "",
        }));
      setImgData(updatedMedicationData);
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
          .delete(`${BASE_URL}medicationdet/${rowData._id}`)
          .then((response) => {
            if (response.data.status) {
              Swal.fire({
                position: "center",
                icon: "success",
                toast: true,
                title: "Data deleted successfully",
                showConfirmButton: false,
                timer: 1500,
              });
              handleClose();
              getAllMedDetails();
            } else {
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
            Swal.fire({
              position: "center",
              icon: "error",
              toast: true,
              title: "Failed",
              text: error,
              showConfirmButton: true,
            });
          })
          .finally(() => setLoaderOpen(false));
      }
    });
  };

  const getMedicationData = () => {
    axios.get(`${BASE_URL}medications`).then((response) => {
      setMedications(response.data.values);
    });
  };

  const getDosageData = () => {
    axios.get(`${BASE_URL}dosagedet`).then((response) => {
      setDosage(response.data.values);
    });
  };

  React.useEffect(() => {
    getMedicationData();
    getDosageData();
    getAllMedDetails();
  }, []);

  const columns = [
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      sortable: false,
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
    { field: "id", headerName: "SR.NO", width: 90, sortable: true },
    {
      field: "Medication",
      headerName: "Medication",
      width: 400,
      sortable: false,
    },
    { field: "Dosage", headerName: "Dosage", width: 400, sortable: false },
  ];

  const handleUpdate = (rowData) => {
    setSaveUpdateButton("UPDATE");
    setOn(true);
    setData({
      Id: rowData._id,
      Dosage: rowData.DosageId,
      medication: rowData.MedicationId,
    });
  };

  return (
    <>
      {loaderOpen && <Loader open={loaderOpen} />}
      <Modal
        open={on}
        onClose={handleClose}
        sx={{
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
      >
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
            item
            xs={12}
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
              <Typography fontWeight="bold">Add Medical Detail</Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-select-medium-label">
                  Select Medication
                </InputLabel>
                <Select
                  labelId="ChooseType"
                  id="medication"
                  label="medication"
                  name="medication"
                  value={data.medication}
                  onChange={onChangeHandler}
                  style={{ textAlign: "left" }}
                  MenuProps={{ PaperProps: { style: { maxHeight: 150 } } }}
                >
                  <MenuItem value="" disabled>
                    Select a medication
                  </MenuItem>
                  {medications.map((item) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-select-small-label">
                  Select Dosage
                </InputLabel>
                <Select
                  labelId="ChooseType"
                  id="Dosage"
                  label="Dosage"
                  name="Dosage"
                  value={data.Dosage}
                  onChange={onChangeHandler}
                  style={{ textAlign: "left" }}
                  MenuProps={{ PaperProps: { style: { maxHeight: 150 } } }}
                >
                  <MenuItem value="" disabled>
                    Select a Dosage
                  </MenuItem>
                  {Dosage.map((item) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
          // color={"#5C5CFF"}
          padding={1}
          noWrap
        >
          Manage Medical Details
        </Typography>
      </Grid>

      <Grid textAlign={"end"} marginBottom={1}>
        <Button
          onClick={handleOnSave}
          type="text"
          size="medium"
          sx={{
            pr: 2,
            // mb: 2,
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
          Add Medical Detail
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
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: (theme) => theme.palette.custome.datagridcolor,
              },
              "& .MuiDataGrid-row:hover": {
                boxShadow: "0px 4px 20px rgba(0, 0, 0.2, 0.2)", 
             },
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default MedDetails;
