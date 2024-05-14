import AddIcon from "@mui/icons-material/Add";
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { IconButton, Modal, Paper } from "@mui/material";
import Box from "@mui/material/Box";
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

export default function ManageTags() {
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [tagData, setTagsData] = React.useState([]);
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [data, setData] = React.useState({
    id: "",
    Name: "",
    Description: "",
  });

  const clearFormData = () => {
    setData({
      id: "",
      Name: "",
      Description: "",
    });
  };

  const onchangeHandler = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const columns = [
    {
      field: "Action",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleClick(params.row)}>
            <EditNoteIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row)}>
            <DeleteForeverSharpIcon />
          </IconButton>
        </>
      ),
    },
    {
      field: "id",
      headerName: " Sr.No",
      width: 130,
      sortable: false,
    },
    {
      field: "Name",
      headerName: "Name",
      width: 300,
      sortable: false,
    },
    {
      field: "Description",
      headerName: "Description",
      width: 500,
      sortable: false,
    },
  ];

  const handleClose = () => {
    setOn(false);
  };

  const handleClick = (row) => {
    setSaveUpdateButton("UPDATE");
    setOn(true);
    setData(row);
  };

  const handleOnSave = () => {
    setSaveUpdateButton("SAVE");
    setOn(true);
    clearFormData();
  };

  const getTagData = () => {
    axios.get(`${BASE_URL}tags/`).then((response) => {
      setTagsData(response.data.values.flat());
    });
  };

  const handleDelete = (data) => {
    setLoaderOpen(true);
    Swal.fire({
      text: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${BASE_URL}tags/${data._id}`)
          .then((res) => {
            if (res.data.status) {
              setLoaderOpen(false);
              Swal.fire({
                position: "center",
                icon: "success",
                toast: true,
                title: "Tag deleted successfully",
                showConfirmButton: false,
                timer: 1500,
              });
              handleClose();
              getTagData();
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
  const updateUser = (id) => {
    const requiredFields = ["Name", "Description"];
    const emptyRequiredFields = requiredFields.filter((field) => !data[field]);

    if (emptyRequiredFields.length > 0) {
      validationAlert("Please fill in all required fields");
      return;
    }

    setLoaderOpen(true);
    const axiosRequest =
      SaveUpdateButton === "SAVE"
        ? axios.post(`${BASE_URL}tags`, data)
        : axios.patch(`${BASE_URL}tags/${id}`, data);

    axiosRequest
      .then((response) => {
        if (response.data.status === true) {
          setLoaderOpen(false);
          Swal.fire({
            position: "center",
            icon: "success",
            toast: true,
            title:
              SaveUpdateButton === "SAVE"
                ? "Tag Added Successfully"
                : "Tag Updated Successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          getTagData();
          handleClose();
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
        Swal.fire({
          position: "center",
          icon: "error",
          toast: true,
          title: "Failed",
          text: error,
          showConfirmButton: true,
        });
      });
  };

  React.useEffect(() => {
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
            bgcolor: "#ccccff",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            justifyContent: "center",
            background: "linear-gradient(to right,#E5D9F2, #CDC1FF)",
          }}
        >
          <Grid
            container
            xs={12}
            item
            spacing={4}
            display={"flex"}
            flexDirection={"column"}
            padding={4}
            justifyContent={"center"}
          >
            <Grid item xs={12}>
              <Typography fontWeight="bold">Add Tags</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="Name"
                required
                size="small"
                id="Name"
                label="Enter Name"
                style={{ borderRadius: 10, width: "100%" }}
                autoFocus
                onChange={onchangeHandler}
                value={data.Name}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                size="small"
                required
                fullWidth
                id="Description"
                label="Enter Description"
                name="Description"
                multiline
                value={data.Description}
                onChange={onchangeHandler}
                rows={3}
                placeholder="Enter your Description..."
              />
            </Grid>

            <Grid item xs={12} md={12} textAlign={"end"}>
              <Button
                onClick={handleClose}
                type="submit"
                size="small"
                sx={{
                  marginTop: 1,
                  p: 1,
                  width: 80,
                  color: "white",
                  backgroundColor: "#3B444B",
                  mr: 1,
                  "&:hover": {
                    backgroundColor: "#3B444B",
                  },
                }}
              >
                Close
              </Button>

              <Button
                type="submit"
                size="small"
                onClick={() => updateUser(data._id)}
                sx={{
                  marginTop: 1,
                  p: 1,
                  width: 80,
                  color: "white",
                  background: "linear-gradient(to right, #EE696B, #523A78)",
                  "&:hover": {
                    backgroundColor: "#673AB7",
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
          width={"100%"}
          textAlign="center"
          textTransform="uppercase"
          fontWeight="bold"
          color={"#673AB7"}
          padding={1}
          noWrap
        >
          Manage Tags
        </Typography>
      </Grid>

      <Grid textAlign={"end"} marginBottom={1}>
        <Button
          onClick={handleOnSave}
          type="text"
          size="medium"
          sx={{
            pr: 2,
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
          <AddIcon />
          Add Tags
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
            getRowId={(row) => row._id}
            rows={tagData.map((data, id) => ({ ...data, id: id + 1 }))}
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
}
