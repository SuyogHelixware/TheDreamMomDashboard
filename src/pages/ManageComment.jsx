import AddIcon from "@mui/icons-material/Add";
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import EditNoteIcon from '@mui/icons-material/EditNote';
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import * as React from "react";



export default function ManageComment() {
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [data, setData] = React.useState({
    id: "",
    Password: "",
    Firstname: "",
    Middlename: "",
    Lastname: "",
  });

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

          <IconButton color="error">
            <DeleteForeverSharpIcon />
          </IconButton>
        </>
      ),
    },

    { field: "id", headerName: "Sr.No", width: 130, sortable: false },
    {
      field: "Name",
      headerName: "Name",
      width: 250,
      sortable: false,
    },
    {
      field: "Comment",
      headerName: "Comment",
      width: 500,
      sortable: false,
    },
    {
      field: "Type",
      headerName: "Type",
      width: 100,
      sortable: false,
    },
    
  ];

  const rows = [
    {
      id: 1,
      Comment: "hello the video is good",
      Name: "Jelly",
      Type: "Blogs",
    },
    {
      id: 2,
      Comment: "Wow i loved the video",
      Name: "Cersei",
      Type: "Video",
    },
    { id: 3, Comment: "Great work", Name: "Jaime", Type: "Video" },
    {
      id: 4,
      Comment: "Appreciate your work",
      Name: "Arya",
      Type: "Blogs",
    },
    {
      id: 5,
      Comment: "Hello your content is best",
      Name: "Daenerys",
      Type: "Blogs",
    },
    {
      id: 6,
      Comment: "Seriously Great Great Knowledge",
      Name: "Shilla",
      Type: "Newsletter",
    },
    {
      id: 7,
      Comment: "Great worked and the content is very helpful Thankyou ",
      Name: "Ferrara",
      Type: "Video",
    },
    {
      id: 8,
      Comment: "Successfully worked the Exercise",
      Name: "Rossini",
      Type: "Video",
    },
    {
      id: 9,
      Comment: "Just Wooooow",
      Name: "Harvey",
      Type: "Video",
    },
  ];

  const handleClose = () => {
    setOn(false);
  };

  const onchangeHandler = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
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
            justifyContent: "center",
            background: "linear-gradient(to right,#E5D9F2, #CDC1FF)",
          }}
        >
          <Grid
            container
            xs={12}
            item
            spacing={3}
            display={"flex"}
            flexDirection={"column"}
            padding={4}
            justifyContent={"center"}
          >
            <Grid item xs={12}>
              <Typography fontWeight="bold">Add Comment</Typography>
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
                value={data.name}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size="small" required>
                <InputLabel id="demo-select-small-label">
                  Select Type
                </InputLabel>

                <Select
                  labelId="ChooseType"
                  id="ChooseType"
                  label="Choose Type"
                  onChange={onchangeHandler}
                  value={data.name}
                  style={{ textAlign: "left" }}
                  MenuProps={{ PaperProps: { style: { maxHeight: 150 } } }}
                >
                  <MenuItem value={10}>Blogs and Newsletter</MenuItem>
                  <MenuItem value={20}>Videos</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                label="Comment"
                name="Comment"
                id="outlined-multiline-static"
                style={{ borderRadius: 10, width: "100%" }}
                value={data.Comment}
                multiline
                rows={4}
                onChange={onchangeHandler}
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
          Manage Comments
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
          Add Comments
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
