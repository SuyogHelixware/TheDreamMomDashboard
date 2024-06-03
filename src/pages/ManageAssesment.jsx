import { Box, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import * as React from "react";
import { BASE_URL } from "../Constant";
import dayjs from "dayjs";

export default function ManageAssesment() {
  const [data, setData] = React.useState([
    {
      id: "",
      Weight: "",
      Height: "",
      SonogramDate: "",
      DueDate: "",
      DelDate: "",
      DelType: "",
      BabyGender: "",
      MaternityHistory: "",
      Remarks: "",
      Status: " ",
      DOB: "",
      BloodGroup: "",
      UserId: "",
    },
  ]);
  const getUserData = () => {
    axios.get(`${BASE_URL}assesment/`).then((response) => {
      setData(response.data.values || []);
    });
  };
  React.useEffect(() => {
    getUserData();
  }, []);
  
  const columns = [
    { field: "id", headerName: "SR.NO", width: 90, sortable: false },
    {
      field: "Weight",
      headerName: "Weight",
      width: 150,
      sortable: false,
    },
    {
      field: "Height",
      headerName: "Height",
      width: 150,
      sortable: false,
    },
    {
      field: "SonogramDate",
      headerName: "SonogramDate",
      width: 150,
      sortable: false,
      valueFormatter: (params) => dayjs(params.value).format("YYYY-MM-DD"),
    },

    {
      field: "DueDate",
      headerName: "DueDate",
      width: 160,
      sortable: false,
      valueFormatter: (params) => dayjs(params.value).format("YYYY-MM-DD"),
    },
    {
      field: "DelDate",
      headerName: "DelDate",
      width: 150,
      sortable: false,
      valueFormatter: (params) => dayjs(params.value).format("YYYY-MM-DD"),
    },
    {
      field: "DelType",
      headerName: "DelType",
      width: 150,
      sortable: false,
    },
    {
      field: "BabyGender",
      headerName: "BabyGender",
      width: 130,
      sortable: false,
    },
    {
      field: "MaternityHistory",
      headerName: "MaternityHistory",
      width: 100,
      sortable: false,
    },
    {
      field: "Status",
      headerName: "Status",
      width: 100,
      sortable: false,
      valueGetter: (params) => (params.row.Status === 1 ? "Active" : "Inactive"),
    },
    {
      field: "DOB",
      headerName: "DOB",
      width: 100,
      sortable: false,
      valueFormatter: (params) => dayjs(params.value).format("YYYY-MM-DD"),
    },
    {
      field: "BloodGroup",
      headerName: "BloodGroup",
      width: 100,
      sortable: false,
    },
    // {
    //   field: "MedConIds",
    //   headerName: "MedConIds",
    //   width: 100,
    //   sortable: false,
    // },
  ];
  return (
    <>
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
          color={"#5C5CFF"}
          padding={1}
          noWrap
        >
          Manage Assesment
        </Typography>
      </Grid>

      {/* <Grid textAlign={"end"} marginBottom={1}>
        <Button
          onClick={handleOnSave}
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
          <AddIcon />
          Add Assesment
        </Button>
      </Grid> */}

      <Paper
        sx={{
          marginTop: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "#",
        }}
        elevation={7}
      >
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            className="datagrid-style"
            getRowId={(row) => row.id}
            rows={data.map((data, id) => ({ ...data, id: id + 1 }))}
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
