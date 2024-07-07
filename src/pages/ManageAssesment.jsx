import ArticleIcon from "@mui/icons-material/Article";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import dayjs from "dayjs";

import * as React from "react";
import { BASE_URL, Bunny_Image_URL } from "../Constant";

export default function ManageAssesment() {
  const PaperItem = ({ children }) => (
    <Paper
      variant="outlined"
      style={{ padding: "8px", margin: "4px", borderRadius: "4px" }}
    >
      {children}
    </Paper>
  );
  const [open, setOpen] = React.useState(false);
  const [selectedData, setSelectedData] = React.useState({
    MedConIds: [],
    Documents: [],
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [data, setData] = React.useState([]);

  const getUserData = () => {
    axios.get(`${BASE_URL}assesment/`).then((response) => {
      setData(response.data.values || []);
      // const medCon = response.data.values[0]?.MedConIds?.[0]?.Name || '';
      // setMedConName(medCon);
    });
  };

  React.useEffect(() => {
    getUserData();
  }, []);

  const columns = [
    {
      field: "Action",
      headerName: "Action",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            sx={{
              "& .MuiButtonBase-root,": {
                padding: 0,
              },
            }}
            color="primary"
            // size="small"
            onClick={() => handleOpenModal(params.row)}
          >
            <RemoveRedEyeIcon />
          </IconButton>
        </>
      ),
    },

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
      headerName: "Sonogram Date",
      width: 150,
      sortable: false,
      valueFormatter: (params) => dayjs(params.value).format("YYYY-MM-DD"),
    },

    {
      field: "DueDate",
      headerName: "Due Date",
      width: 160,
      sortable: false,
      valueFormatter: (params) => dayjs(params.value).format("YYYY-MM-DD"),
    },
    {
      field: "DelDate",
      headerName: "Delivery Date",
      width: 150,
      sortable: false,
      valueFormatter: (params) => dayjs(params.value).format("YYYY-MM-DD"),
    },
    {
      field: "DelType",
      headerName: "Delivery Type",
      width: 150,
      sortable: false,
    },
    {
      field: "BabyGender",
      headerName: "Baby Gender",
      width: 130,
      sortable: false,
    },
    {
      field: "MaternityHistory",
      headerName: "Maternity History",
      width: 100,
      sortable: false,
    },
    {
      field: "Status",
      headerName: "Status",
      width: 100,
      sortable: false,
      valueGetter: (params) =>
        params.row.Status === 1 ? "Active" : "Inactive",
    },
    {
      field: "DOB",
      headerName: "Date of Birth",
      width: 120,
      sortable: false,
      valueFormatter: (params) => dayjs(params.value).format("YYYY-MM-DD"),
    },
    {
      field: "BloodGroup",
      headerName: "Blood Group",
      width: 100,
      sortable: false,
    },
  ];

  const handleOpenModal = (rowData) => {
    setSelectedData(rowData);
    console.log("--------------");
    console.log(rowData);
    handleOpen();
  };

  const onopen = (userId, fileName) => {
    window.open(`${Bunny_Image_URL}/Users/${userId}/${fileName}`, "_blank");
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        // sx={{width:"100%"}}
        fullWidth={true}
        maxWidth="md"
      > 
      
      <DialogTitle id="dialog-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',  textAlign: 'center' }}>
  <b style={{ flexGrow: 1 }}>Assessment Details</b>
  <IconButton onClick={handleClose} style={{ color: "black" }}>
    <CloseIcon />
  </IconButton>
</DialogTitle>

        <DialogContent>
          {selectedData && (
            <Paper elevation={3} style={{ marginBottom: 0 }}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <PaperItem>
                    <Typography variant="body1">
                      <strong>Baby Gender:</strong> {selectedData.BabyGender}
                    </Typography>
                  </PaperItem>
                </Grid>
                <Grid item xs={4}>
                  <PaperItem>
                    <Typography variant="body1">
                      <strong>Blood Group:</strong> {selectedData.BloodGroup}
                    </Typography>
                  </PaperItem>
                </Grid>
                <Grid item xs={4}>
                  <PaperItem>
                    <Typography variant="body1">
                      <strong>Due Date:</strong>{" "}
                      {dayjs(selectedData.DueDate).format("YYYY-MM-DD")}
                    </Typography>
                  </PaperItem>
                </Grid>

                <Grid item xs={4}>
                  <PaperItem>
                    <Typography variant="body1">
                      <strong>Height:</strong> {selectedData.Height}
                    </Typography>
                  </PaperItem>
                </Grid>
                <Grid item xs={4}>
                  <PaperItem>
                    <Typography variant="body1">
                      <strong>Mat History:</strong>{" "}
                      {selectedData.MaternityHistory || "NA"}
                    </Typography>
                  </PaperItem>
                </Grid>
                <Grid item xs={4}>
                  <PaperItem>
                    <Typography variant="body1">
                      <strong>Date of Birth:</strong>{" "}
                      {dayjs(selectedData.DOB).format("YYYY-MM-DD")}
                    </Typography>
                  </PaperItem>
                </Grid>

                <Grid item xs={4}>
                  <PaperItem>
                    <Typography variant="body1">
                      <strong>Weight:</strong> {selectedData.Weight}
                    </Typography>
                  </PaperItem>
                </Grid>
                <Grid item xs={4}>
                  <PaperItem>
                    <Typography variant="body1">
                      <strong>Remarks:</strong> {selectedData.Remarks || "NA"}
                    </Typography>
                  </PaperItem>
                </Grid>
                <Grid item xs={4}>
                  <PaperItem>
                    <Typography variant="body1">
                      <strong>Sono Date:</strong>{" "}
                      {dayjs(selectedData.SonogramDate).format("YYYY-MM-DD")}
                    </Typography>
                  </PaperItem>
                </Grid>
              </Grid>
            </Paper>
          )}

          <Paper
            elevation={3}
            style={{ textAlign: "center", padding: 10, marginBottom: 20 }}
          >
            <Typography variant="h6" gutterBottom>
              <b>Complications</b>
            </Typography>
            <Divider />
            <Grid
              container
              spacing={2}
              // sx={{ justifyContent: "center", textAlign: "center" }}
            >
              <Grid item>
                <List dense>
                  {selectedData.MedConIds.length > 0 ? (
                    selectedData.MedConIds.map((data, index) => (
                      <ListItem key={index}>
                        <FiberManualRecordIcon
                          sx={{ color: "#1B1212", fontSize: "0.8rem" }}
                        />
                        &nbsp;&nbsp;
                        <ListItemText primary={data.Name} />
                      </ListItem>
                    ))
                  ) : (
                    <Typography
                      sx={{
                        pt: 5,
                      }}
                    >
                      No documents available
                    </Typography>
                  )}
                </List>
              </Grid>
            </Grid>
          </Paper>

          {/* ----------------------------------- */}
          <Paper elevation={3} style={{ textAlign: "center", marginBottom: 4 }}>
            <Typography variant="h6" gutterBottom>
              <b>Documents </b>
            </Typography>

            {/* <Grid container spacing={2}>
              
              {selectedData.Documents.map((item, index) => (
                <Grid item key={index}  sx={{ width: "33.33%"}}>
                   <Card sx={{ width: "100%" ,display:"flex"}}  onClick={() => {
                      onopen(selectedData.UserId , item.DocFile,);
                    }}>
                      <ArticleIcon sx={{ fontSize: "4.5rem" , color:"#5C5CFF" }}  />
                      <CardContent> 
                        <Typography noWrap width={"60%"} height={35} >
                          <b>{item.Name}</b>
                        </Typography>
                      </CardContent>
                    </Card>
                </Grid>
              ))}
            </Grid> */}
            <Grid container spacing={2}>
              {selectedData.Documents.length > 0 ? (
                selectedData.Documents.map((item, index) => (
                  <Grid item key={index} sx={{ width: "33.33%" }}>
                    <Card
                      sx={{ width: "100%", display: "flex" }}
                      onClick={() => onopen(selectedData.UserId, item.DocFile)}
                    >
                      <ArticleIcon
                        sx={{ fontSize: "4.5rem", color: "#5C5CFF" }}
                      />
                      <CardContent sx={{ flex: 1, overflow: "hidden" }}>
                        <Typography
                          noWrap
                          sx={{
                            width: "100%",
                            height: 35,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <b>{item.Name}</b>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography
                  sx={{
                    pt: 5,
                    width: "100%",
                  }}
                >
                  No documents available
                </Typography>
              )}
            </Grid>
          </Paper>

          {/* -------------------------------------- */}
        </DialogContent>
      </Dialog>

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
          Manage Assesment
        </Typography>
      </Grid>

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
