import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL, Bunny_Image_URL } from "../Constant";

const PostNatalPrecaution = ({ sendPrecautionDataToParent, ...props }) => {
  const [childDialogOpen, setChildDialogOpen] = useState(false);
  const [childData, setChildData] = useState([]);
  const [PrecautionData, setPrecautionData] = useState([]);
  const [selectedPrecautionRows, setSelectedPrecautionRows] = useState([]);

   // ========================
   const getApiToken = async () => {
    const data = sessionStorage.getItem('userData');
    if (data !== null) {
      const fetchedData = JSON.parse(data);
      return fetchedData.Token;
    }
  };
  // ========================


  useEffect(() => {
    const fetchPrecautionData = async () => {
      try {
        const token = await getApiToken(); 
  
        const response = await axios.get(`${BASE_URL}precaution/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
  
        const updatedPrecautionData = response.data.values
          .flat()
          .map((item) => ({
            _id: item._id,
            Name: item.Name,
            Description: item.Description,
            Image: item.Image,
          }));
  
        setPrecautionData(updatedPrecautionData);
        setChildData(props.PrecautionData || []);  
      } catch (error) {
        console.error('Error fetching precaution data:', error);
      }
    };
  
    fetchPrecautionData(); 
  
  }, [props.PrecautionData]);

  const handleChildDialogOpen = () => {
    setChildDialogOpen(true);
  };

  const handleChildDialogClose = () => {
    setChildDialogOpen(false);
  };

  const handlePrecautionRowClick = (id) => {
    const selectedIDs = new Set(id);
    const selectedRows = PrecautionData.filter((row) =>
      selectedIDs.has(row._id)
    );
    setSelectedPrecautionRows(
      selectedRows.map((item) => ({
        _id: item._id,
        Name: item.Name,
        Description: item.Description,
        Image: item.Image,
      }))
    );
  };

  const handleDelete = (data) => {
    setChildData((prevState) => {
      const updatedData = [...prevState];
      updatedData.splice(data.SrNo - 1, 1);

      sendPrecautionDataToParent(updatedData);

      return updatedData;
    });
  };

  const handleSavePrecautionSelection = () => {
    setChildData((prev) => [...childData, ...selectedPrecautionRows]);
    setChildDialogOpen(false);
    sendPrecautionDataToParent([...childData, ...selectedPrecautionRows]);
  };

  const columns = [
    {
      field: "actions",
      headerName: "Action",
      width: 100,
      sortable:false,
      renderCell: (params) => (
        <>
          <IconButton color="error" onClick={() => handleDelete(params.row)}>
            <DeleteForeverIcon />
          </IconButton>
        </>
      ),
    },
    {
      field: "SrNo",
      headerName: "Sr.No",
      width: 100,
      sortable:true,
    },
    { field: "Name", headerName: "Name", width: 250,sortable:false },
    { field: "Description", headerName: "Description", width: 400,flex:1,sortable:false },
    {
      field: "Image",
      headerName: "Image",
      width: 100,
      sortable:false,
      renderCell: (params) => (
        <img
          src={`${Bunny_Image_URL}/Schedule/Precaution/${params.row.Image}`}
          alt="Img"
          height={50}
          width={80}
        />
      ),
    },
  ];

  return (
    <>
      <Grid container mt={2}>
        <Grid container item lg={12}>
          <Grid item my={2} width={"30%"}>
            <Button
              onClick={handleChildDialogOpen}
              sx={{
                p: 1,
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
              Add Precautions
            </Button>
          </Grid>
          <Grid
            item
            width={"70%"}
            fontSize={20}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <b>Precautions Table</b>
          </Grid>
        </Grid>

        <Grid container item height={380} lg={12} component={Paper}>
          <DataGrid
            className="datagrid-style"
            rows={
              childData.map((data, index) => ({
                ...data,
                SrNo: index + 1,
              })) || []
            }
            rowHeight={70}
            getRowId={(row) => row._id}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: (theme) => theme.palette.custome.datagridcolor,
              },
            }}
          />
        </Grid>
      </Grid>

      <Dialog
      sx={{
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      }}
        open={childDialogOpen}
        onClose={handleChildDialogClose}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>
          <b>Select Precautions</b>
          <IconButton
            aria-label="close"
            onClick={handleChildDialogClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ height: 400 }}>
          <DataGrid
            rows={PrecautionData.map((data, index) => ({
              ...data,
              id: index + 1,
            }))}
            className="datagrid-style"
            rowHeight={80}
            columns={[
              { field: "id", headerName: "SR.NO", width: 100 ,sortable:true },
              { field: "Name", headerName: "Name", width: 300 ,sortable:false},
              { field: "Description", headerName: "Description", width: 300 ,sortable:false, flex:1 },
              {
                field: "Image",
                headerName: "Image",
                width: 100,
                sortable:false,
                renderCell: (params) => (
                  <img
                    src={`${Bunny_Image_URL}/Schedule/Precaution/${params.row.Image}`}
                    alt=""
                    height={50}
                    width={80}
                  />
                ),
              },
            ]}
            checkboxSelection
            getRowId={(row) => row._id}
            isRowSelectable={(params) => {
              return childData === undefined
                ? true
                : !childData.map((obj) => obj._id).includes(params.row._id);
            }}
            onRowSelectionModelChange={(ids) => handlePrecautionRowClick(ids)}
            disableRowSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: (theme) => theme.palette.custome.datagridcolor,
              },
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button
            sx={{
              p: 1,
              px: 3,
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
            onClick={handleSavePrecautionSelection}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostNatalPrecaution;
