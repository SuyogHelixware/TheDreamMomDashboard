import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Card,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Pagination,
  Paper,
  Select,
} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import * as React from "react";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import diet from "../../assets/diet.jpg";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const styles = {
  typography: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    height: 40,
  },
};

const PNDiet = () => {
  const [uploadedImg, setUploadedImg] = React.useState("");
  const [formData, setFormData] = React.useState("");
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [page, setPage] = React.useState(1);
  const cardsPerPage = 8;

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log("Uploaded file:", file);
    setUploadedImg(file);
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

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmitForm = () => {
    axios
      .request({
        method: "PUT",
        maxBodyLength: Infinity,
        url: `https://storage.bunnycdn.com/thedreammomstoragezone1/PostNatal/Diet/${
          new Date().getTime() + "_" + uploadedImg.name
        }`,
        headers: {
          "Content-Type": "image/jpeg",
          AccessKey: "eb240658-afa6-44a1-8b32cffac9ba-24f5-4196",
        },
        data: uploadedImg,
      })
      .then((response) => {
        console.log(response);
      });
    handleClose();
  };

  // const getAllImgList = () => {
  //   axios
  //     .request({
  //       method: "GET",
  //       url: "https://storage.bunnycdn.com/thedreammomstoragezone1/admin/",
  //       headers: {
  //         AccessKey: "fddbd3df-9f4e-4a10-8df9a37562f7-e1d6-4424",
  //       },
  //     })
  //     .then((response) => {
  //       console.log("Instance created");
  //       console.log(response);
  //     });
  // };

  React.useEffect(() => {
    // getAllImgList();
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

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
            spacing={2}
            display={"flex"}
            flexDirection={"column"}
            padding={4}
            justifyContent={"center"}
          >
            <Grid item xs={12}>
              <Typography fontWeight="bold">Add Diet</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                spacing={"5"}
                required
                fullWidth
                id="name"
                label="Enter Name"
                name="blogName"
                onChange={handleInputChange}
                autoFocus
                style={{ borderRadius: 10, width: "100%" }}
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
                  onChange={handleInputChange}
                  // value={data.name}
                  style={{ textAlign: "left" }}
                  MenuProps={{ PaperProps: { style: { maxHeight: 150 } } }}
                >
                  <MenuItem value={10}>Blogs and Newsletter</MenuItem>
                  <MenuItem value={20}>Videos</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} paddingTop={1}>
              <TextField
                size="small"
                required
                fullWidth
                id="outlined-multiline-static"
                label="Enter Description"
                name="description"
                onChange={handleInputChange}
                multiline
                rows={3}
                placeholder="Enter your Description..."
              />
            </Grid>

            <Grid item xs={12} md={6} lg={12}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
              />

              <label htmlFor="file-upload">
                <Button
                  fullWidth
                  variant="contained"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    backgroundColor: "#8F00FF",
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: "#3B444B",
                    },
                  }}
                >
                  {uploadedImg.name ? uploadedImg.name : "Upload Photo"}
                </Button>
              </label>
            </Grid>

            <Grid item xs={12} md={12} textAlign={"end"}>
              <Button
                onClick={handleClose}
                type="reset"
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
                onClick={handleSubmitForm}
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
          Manage Diet
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
          Add Diet
        </Button>
      </Grid>

      <Grid container spacing={3} justifyContent="start">
        {[...Array(19)].slice(startIndex, endIndex).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card sx={{ width: "100%" }}>
              <CardMedia
                sx={{ height: 140 }}
                image={diet}
                alt="img"
                title="green iguana"
              />
              <CardContent>
                <Typography
                  noWrap
                  height={25}
                  gutterBottom
                  component="div"
                  textAlign={"start"}
                >
                  <b>Title:</b>
                </Typography>
                <Typography
                  textAlign={"start"}
                  variant="body2"
                  style={styles.typography}
                  color="textSecondary"
                  component="div"
                >
                  Description are a widespread group of squamate reptiles, with
                  over 6,000 species, ranging across all continents except
                  Antarctica
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  pt: "0",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <IconButton color="primary" onClick={() => handleClick()}>
                  <EditNoteIcon />
                </IconButton>

                <Button size="medium" sx={{ color: "red" }}>
                  <DeleteForeverIcon />
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} width="100%" pt={5}>
        <Grid item xs={12}>
          <Pagination
            count={Math.ceil(19 / 8)}
            color="primary"
            page={page}
            onChange={handlePageChange}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default PNDiet;
