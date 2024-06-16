import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Box, IconButton, Modal, Paper } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import * as React from "react";
import Swal from "sweetalert2";
import { BASE_URL } from "../Constant";
import Loader from "../components/Loader";
import CloseIcon from "@mui/icons-material/Close";

const ManageDoses = () => {
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [imgData, setImgData] = React.useState([]);
  const [data, setData] = React.useState({
    Name: "",
    Description: "",
    Id: "",
  });

  const clearFormData = () => {
    setData({
      Id: "",
      Name: "",
      Description: "",
      Status: 1,
    });
  };

  const handleClose = () => {
    setOn(false);
  };

  const handleOnSave = () => {
    setSaveUpdateButton("SAVE");
    setOn(true);
    clearFormData();
    setData([]);
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
      timer: 1500,
    });
  };
  const getAllImgList = () => {
    axios.get(`${BASE_URL}dosagedet/`).then((response) => {
      const updatedImgData = response.data.values.flat().map((item, index) => ({
        ...item,
        id: index + 1,
      }));
      setImgData(updatedImgData);
    });
  };
  React.useEffect(() => {
    getAllImgList();
  }, []);

  const handleSubmitForm = () => {
    const requiredFields = ["Name", "Description"];
    const emptyRequiredFields = requiredFields.filter(
      (field) => !data[field] || !data[field].trim()
    );
    if (emptyRequiredFields.length > 0) {
      validationAlert("Please fill in all required fields");
      return;
    }

    const saveObj = {
      Name: data.Name,
      Description: data.Description,
    };
    const UpdateObj = {
      Name: data.Name,
      Description: data.Description,
    };

    setLoaderOpen(true);

    const axiosRequest =
      SaveUpdateButton === "SAVE"
        ? axios.post(`${BASE_URL}dosagedet`, saveObj)
        : Swal.fire({
            text: "Do you want to Update...?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Update it!",
          }).then((result) => {
            if (result.isConfirmed) {
              return axios.patch(`${BASE_URL}dosagedet/${data.Id}`, UpdateObj);
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
          getAllImgList();
          handleClose();
        } else {
          setLoaderOpen(false);
          Swal.fire({
            position: "center",
            icon: "error",
            toast: true,
            text: "Failed",
            title: response.data.message,
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
          .delete(`${BASE_URL}dosagedet/${data._id}`)
          .then((res) => {
            if (res.data.status) {
              setLoaderOpen(false);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Data deleted successfully",
                showConfirmButton: false,
                timer: 1500,
                toast: true,
              });
              handleClose();
              getAllImgList();
            } else {
              setLoaderOpen(false);
              Swal.fire({
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
              icon: "error",
              title: "Failed",
              toast: true,
              text: error,
              showConfirmButton: true,
            });
          });
      }
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
    { field: "id", headerName: "SR.NO", width: 90, sortable: false },
    { field: "Name", headerName: "Name", width: 250 },
    { field: "Description", headerName: "Description", width: 300 , flex:1},
  ];

  const handleUpdate = (data) => {
    setSaveUpdateButton("UPDATE");
    setOn(true);
    setData({
      Name: data.Name,
      Description: data.Description,
      Id: data._id,
    });
    console.log(data);
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
            spacing={4}
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
              <Typography fontWeight="bold">Add Dosage</Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon style={{ color: "black" }} />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                spacing={"5"}
                // required
                fullWidth
                id="Name"
                label="Enter Name"
                name="Name"
                value={data.Name}
                onChange={onchangeHandler}
                autoFocus
                style={{ borderRadius: 10, width: "100%" }}
              />
            </Grid>

            <Grid item xs={12} paddingTop={1}>
              <TextField
                size="small"
                // required
                fullWidth
                id="Description"
                label="Enter Description"
                name="Description"
                value={data.Description}
                onChange={onchangeHandler}
                multiline
                rows={5}
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
                  color: "white",
                  boxShadow: 5,
                  backgroundColor: "#5C5CFF",
                  "&:hover": {
                    backgroundColor: "#E6E6FA",
                    border:"1px solid #5C5CFF",
                    color:"#5C5CFF"
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
          Manage Dosages
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
          Add Dosage
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
            autoHeight
          />
        </Box>
      </Paper>
    </>
  );
};

export default ManageDoses;
