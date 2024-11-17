import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
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
  // ========================
  const getApiToken = async () => {
    const data = sessionStorage.getItem('userData');
    if (data !== null) {
      const fetchedData = JSON.parse(data);
      return fetchedData.Token;
    }
  };
  // ========================
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
      flex:1,
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

  // const getTagData = () => {
  //   axios.get(`${BASE_URL}tags/`).then((response) => {
  //     setTagsData(response.data.values.flat());
  //   });
  // };

  const getTagData = async() => {
    const token = await getApiToken();
    const response = await axios.get(`${BASE_URL}/tags`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    setTagsData(response.data.values.flat());
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
  const updateUser = async (id) => {
    const requiredFields = ["Name", "Description"];
    const emptyRequiredFields = requiredFields.filter(
      (field) => !data[field].trim()
    );

    if (emptyRequiredFields.length > 0) {
      validationAlert("Please fill in all required fields");
      return;
    }

    setLoaderOpen(true);
    const token =await getApiToken();
    const axiosRequest =
      SaveUpdateButton === "SAVE"
        ? axios.post(`${BASE_URL}tags` ,
           data, {headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          }})
        : Swal.fire({
            text: "Do you want to Update...?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Update it!",
          }).then((result) => {
            if (result.isConfirmed) {
              return axios.patch(`${BASE_URL}tags/${id}`, data,{headers: {
                'Content-Type': 'application/json',
                Authorization: token,
              }});
            } else {
              throw new Error("Update cancelled");
            }
          });

    axiosRequest
      .then((response) => {
        setLoaderOpen(false);
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

  React.useEffect(() => {
    getTagData();
  }, []);

  return (
    <>
      {loaderOpen && <Loader open={loaderOpen} />}
      <Modal open={on} onClose={handleClose}
      sx={{
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      }}>
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
            xs={12}
            item
            spacing={4}
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
              <Typography fontWeight="bold">Add Tags</Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon  />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="Name"
                // required
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
                // required
                fullWidth
                id="Description"
                label="Enter Description"
                name="Description"
                multiline
                value={data.Description}
                onChange={onchangeHandler}
                rows={5}
                placeholder="Enter your Description..."
              />
            </Grid>

            <Grid item xs={12} md={12} textAlign={"end"}>
              <Button
                type="submit"
                size="small"
                onClick={() => updateUser(data._id)}
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
        className="slide-in-text"
          width={"100%"}
          textAlign="center"
          textTransform="uppercase"
          fontWeight="bold"
          // color={"#5C5CFF"}
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
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor:theme=>theme.palette.custome.datagridcolor
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
}
