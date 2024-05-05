import {
  Box,
  Button,
  Grid,
  Modal,
  Paper,
  Typography
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import InputTextField, { InputDescriptionField } from "../components/Component";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const columns = [
  {
    field: "actions",
    headerName: "Action",
    width: 250,
  },
  { field: "Name", headerName: "Title", width: 250 },
  { field: "Description", headerName: "Description", width: 300 },
];

const rows = [
  { id: 1, actions: "Snow", Name: "Jon", Description: 14 },
  { id: 2, actions: "Lannister", Name: "Cersei", Description: 31 },
  { id: 3, actions: "Lannister", Name: "Jaime", Description: 31 },
];

function ChildModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpen} size="small" sx={{ color: "white" }}>
        Open Demo
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: "80%" }}>
          <h2 id="child-modal-title">Text in a child modal</h2>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
          <Button onClick={handleClose}>Close Child Modal</Button>
        </Box>
      </Modal>
    </>
  );
}

export default function PlanMaster() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: "90%" }}>
          <Paper
            elevation={10}
            sx={{
              width: "100%",
              maxWidth: "100%",
              height: 500,
              bgcolor: "#ccccff",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: 4,
              justifyContent: "center",
              // textAlign: "center",
              background: "linear-gradient(to right,#E5D9F2, #CDC1FF)",
              overflowY: { xs: "scroll", md: "auto" },
              "&::-webkit-scrollbar": {
                display: "none",
              },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            <Grid container columnSpacing={2}>
              <Grid item md={4} sm={4} xs={12}>
                <InputTextField
                  size="small"
                  required
                  fullWidth
                  id="Name"
                  label="Enter Name"
                  name="Name"
                  autoFocus
                  style={{ borderRadius: 10, width: "100%" }}
                />
              </Grid>

              <Grid item md={4} sm={4} xs={12}>
                <InputTextField
                  size="small"
                  required
                  fullWidth
                  id="Age"
                  label="Enter Age"
                  name="Age"
                  style={{ borderRadius: 10, width: "100%" }}
                />
              </Grid>

              <Grid item md={4} sm={4} xs={12}>
                <InputDescriptionField
                  size="small"
                  required F
                  id="Description"
                  label="Enter Description"
                  name="Description"
                  multiline
                  rows={2}
                  placeholder="Enter your Description..."
                />
              </Grid>

              <Grid item md={4} sm={4} xs={12}>
                <InputTextField
                  size="small"
                  required
                  fullWidth
                  id="Weight"
                  label="Enter Weight"
                  name="Weight"
                  style={{ borderRadius: 10, width: "100%" }}
                />
              </Grid>

              <Grid item md={4} sm={4} xs={12}>
                <InputTextField
                  size="small"
                  required
                  fullWidth
                  id="Height"
                  label="Enter Height"
                  name="Height"
                  autoFocus
                  style={{ borderRadius: 10, width: "100%" }}
                />
              </Grid>
            </Grid>

            <Grid container mt={2}>
              <Grid container item lg={12}>
                <Grid item mb={1} lg={6}>
                  <Button
                    size="small"
                    sx={{ bgcolor: "#8F00FF", color: "white" }}
                  >
                    <ChildModal />
                  </Button>
                </Grid>
                <Grid item lg={6} fontSize={20}>
                  <b>Diet Table</b>
                </Grid>
              </Grid>
              <Grid container item lg={12} component={Paper} bgcolor={"#"}>
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
                  autoHeight
                />
              </Grid>
            </Grid>

            <Grid container mt={2}>
              <Grid container item lg={12}>
                <Grid item mb={2} lg={6}>
                  <Button sx={{ bgcolor: "#8F00FF", color: "white" }}>
                    <ChildModal />
                  </Button>
                </Grid>
                <Grid item lg={6} fontSize={20}>
                  <b>Exrcise Table</b>
                </Grid>
              </Grid>
              <Grid container item lg={12} component={Paper} bgcolor={"#"}>
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
                  autoHeight
                />
              </Grid>
            </Grid>

            <Grid container mt={2}>
              <Grid container item lg={12}>
                <Grid item mb={2} lg={6}>
                  <Button sx={{ bgcolor: "#8F00FF", color: "white" }}>
                    <ChildModal />
                  </Button>
                </Grid>
                <Grid item lg={6} fontSize={20}>
                  <b>Medical Test Table</b>
                </Grid>
              </Grid>
              <Grid container item lg={12} component={Paper} bgcolor={"#"}>
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
                  autoHeight
                />
              </Grid>
            </Grid>

            <Grid container mt={2}>
              <Grid container item lg={12}>
                <Grid item mb={2} lg={6}>
                  <Button sx={{ bgcolor: "#8F00FF", color: "white" }}>
                    <ChildModal />
                  </Button>
                </Grid>
                <Grid item lg={6} fontSize={20}>
                  <b>Vaccination Table</b>
                </Grid>
              </Grid>
              <Grid container item lg={12} component={Paper} bgcolor={"#"}>
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
                  autoHeight
                />
              </Grid>
            </Grid>

            <Grid container mt={2}>
              <Grid container item lg={12}>
                <Grid item mb={2} lg={6}>
                  <Button sx={{ bgcolor: "#8F00FF", color: "white" }}>
                    <ChildModal />
                  </Button>
                </Grid>
                <Grid item lg={6} fontSize={20}>
                  <b>Medication Table</b>
                </Grid>
              </Grid>
              <Grid container item lg={12} component={Paper} bgcolor={"#"}>
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
                  autoHeight
                />
              </Grid>
            </Grid>

            <Grid item xs={12} textAlign={"end"}>
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
                Save
              </Button>
            </Grid>
          </Paper>
        </Box>
      </Modal>
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
          Plan Master
        </Typography>
      </Grid>
      <Grid textAlign={"end"} marginBottom={1}>
        <Button
          onClick={handleOpen}
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
          Plan Master
        </Button>
      </Grid>
    </>
  );
}
