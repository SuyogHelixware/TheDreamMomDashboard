import AddIcon from "@mui/icons-material/Add";
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import * as React from "react";
import { IconButton, Modal, Paper } from "@mui/material";
import { DatePickerField } from "../components/Component";

export default function ManageSubscription() {
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const columns = [
    {
      field: "id",
      headerName: "Sr.No",
      width: 100,
      sortable: false,
    },

    {
      field: "firstName",
      headerName: "Name",
      width: 180,
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

    {
      field: "lastName",
      headerName: "Description",
      width: 300,
      sortable: false,
    },

    {
      field: "Action",
      headerName: "Action",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleClick(params.row)}>
            <FormatListNumberedIcon />
          </IconButton>

          <IconButton color="error">
            <DeleteForeverSharpIcon />
          </IconButton>
        </>
      ),
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
            bgcolor: "#ccccff",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            // padding: 4,
            justifyContent: "center",
            background: "linear-gradient(to right,#E5D9F2, #CDC1FF)",
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
            <Grid item xs={12}>
              <Typography fontWeight="bold">Add Plans</Typography>
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
        xs={12}
        sm={6}
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
        <Box sx={{ height: 400, width: "100%", elevation: 4 }}>
          <DataGrid
            className="datagrid-style"
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
          />
        </Box>
      </Paper>
    </>
  );
}
