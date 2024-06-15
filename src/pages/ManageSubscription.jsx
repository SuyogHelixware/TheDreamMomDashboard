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
import * as React from "react";
import Swal from "sweetalert2";
import { DatePickerField } from "../components/Component";
import CloseIcon from "@mui/icons-material/Close";

export default function ManageSubscription() {
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
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

          <IconButton color="error" onClick={deldata}>
            <DeleteForeverSharpIcon />
          </IconButton>
        </>
      ),
    },
    {
      field: "id",
      headerName: "Sr.No",
      width: 170,
      sortable: false,
    },

    {
      field: "firstName",
      headerName: "Name",
      width: 180,
      sortable: false,
    },
    {
      field: "lastName",
      headerName: "Description",
      width: 300,
      sortable: false,
    },

    {
      field: "feature",
      headerName: "Features",
      width: 200,
      sortable: false,
    },

    {
      field: "price",
      headerName: "Price",
      width: 200,
      sortable: false,
    },

    {
      field: "start",
      headerName: "Start-Date",
      width: 200,
      sortable: false,
    },

    {
      field: "end",
      headerName: "End-Date",
      width: 200,
      sortable: false,
    },
  ];

  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: "devin", age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  ];

  const deldata = (id) => {
    Swal.fire({
      text: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      // if (result.isConfirmed) {
      //   axios
      //     .delete(`${BASE_URL}videos/${id}`)
      //     .then((response) => {
      //       if (response.data.status === true) {
      //         setVideos(Videos.filter((video) => video._id !== id));
      //         Swal.fire({
      //           position: "center",
      //           icon: "success",
      //           toast: true,
      //           title: "Video deleted Successfully",
      //           showConfirmButton: false,
      //           timer: 2500,
      //         });
      //       }
      //     })
      //     .catch((error) => {
      //       alert("error");
      //     });
      // }
    });
  };

  const handleClose = () => {
    setOn(false);
  };

  const handleClick = (row) => {
    setSaveUpdateButton("Update");
    setOn(true);
  };

  const handleOnSave = () => {
    setSaveUpdateButton("Save");
    setOn(true);
  };

  return (
    <>
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
            // padding: 4,
            justifyContent: "center",
          }}
        >
          <Grid
            container
            p={3}
            rowSpacing={2.2}
            columnSpacing={2}
            textAlign={"center"}
            justifyContent="center"
          >
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontWeight="bold">Add Plans</Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon style={{ color: "black" }} />
              </IconButton>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                required
                size="small"
                id="name"
                label="Enter Name"
                autoFocus
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Add Feature"
                name="feature"
                id="feature"
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="Price"
                required
                size="small"
                id="Price"
                type="number"
                label="Enter Price"
              />
            </Grid>

            <Grid item xs={6}>
              <DatePickerField id="DocumentDate" label="Start Date" />
            </Grid>
            <Grid item xs={6}>
              <DatePickerField id="DocumentDate" label="End Date" />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Enter Description"
                name="Description"
                id="Description"
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12} md={12} textAlign={"end"}>
              <Button
                type="submit"
                size="small"
                // onClick={()=>updateUser(data._id)}
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
          color={"#5C5CFF"}
          padding={1}
          noWrap
        >
          Manage Subscription
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
          Subscription
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
        <Box sx={{ height: 510, width: "100%", elevation: 4 }}>
          <DataGrid
            className="datagrid-style"
            rows={rows}
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
