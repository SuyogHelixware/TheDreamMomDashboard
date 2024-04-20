import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
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
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import * as React from "react";
import { BASE_URL, Bunny_Image_URL } from "../../Constant";

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

export default function ManageMedical() {
  const [uploadedImg, setUploadedImg] = React.useState("");
  const [on, setOn] = React.useState(false);
  const [SaveUpdateButton, setSaveUpdateButton] = React.useState("UPDATE");
  const [page, setPage] = React.useState(1);
  const [imgData, setImgData] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const cardsPerPage = 8;

  const [data, setData] = React.useState({
    Name: "",
    Description: "",
    Image: "",
  });

  const clearFormData = () => {
    setData({
      id: "",
      Name: "",
      Description: "",
      Image: "",
      TagsIds: [],
      Status: 1,
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log("Uploaded file:", file);
    setUploadedImg(file);

    setData((prevData) => ({
      ...prevData,
      Image: file.name,
    }));
  };

  const handleClose = () => {
    setOn(false);
  };
  const handleClick = (item) => {
    setData({
      id: item.id,
      Name: item.Name,
      Description: item.Description,
      Image: item.Image,
      TagsIds: item.TagsIds,
      Status: item.Status,
    });
    setSaveUpdateButton("Update");
    setOn(true);
  };

  const handleOnSave = () => {
    setSaveUpdateButton("Save");
    setOn(true);
    clearFormData();
    setData([]);
  };

  const onchangeHandler = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmitForm = () => {
    const filename = new Date().getTime() + "_" + uploadedImg.name;

    axios
      .request({
        method: "PUT",
        maxBodyLength: Infinity,
        url: `https://storage.bunnycdn.com/thedreammomstoragezone1/Schedule/Medical/${filename}`,
        headers: {
          "Content-Type": "image/jpeg",
          AccessKey: "eb240658-afa6-44a1-8b32cffac9ba-24f5-4196",
        },
        data: uploadedImg,
      })
      .then((response) => {
        console.log(response);
        axios
          .post("http://192.168.1.12:3011/api/medicaltests", {
            Name: data.name,
            Description: data.description,
            Image: filename,
          })
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
    handleClose();
  };

  const getAllImgList = () => {
    axios.get(`${BASE_URL}medicaltests/`).then((response) => {
      setImgData(response.data.values.flat());
    });
  };

  const getTagData = () => {
    axios.get(`${BASE_URL}tags`).then((response) => {
      setTags(response.data.values);
    });
  };

  React.useEffect(() => {
    getAllImgList();
  }, []);

  React.useEffect(() => {
    getTagData();
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

  const isSubmitDisabled = () => {
    if (data.name && data.description && data.tag) {
      return false;
    } else {
      // console.log("Please fill all fields");
      return true;
    }
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
            spacing={2}
            display={"flex"}
            flexDirection={"column"}
            padding={4}
            justifyContent={"center"}
          >
            <Grid item xs={12}>
              <Typography fontWeight="bold">Add Medical Test</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                spacing={"5"}
                required
                fullWidth
                id="name"
                label="Enter Title"
                name="name"
                onChange={onchangeHandler}
                value={data.Name}
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
                  id="tag"
                  label="Tag"
                  name="tag"
                  onChange={onchangeHandler}
                  style={{ textAlign: "left" }}
                  MenuProps={{ PaperProps: { style: { maxHeight: 150 } } }}
                >
                  {tags.map((item) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                size="small"
                required
                fullWidth
                id="description"
                label="Enter Description"
                name="description"
                onChange={onchangeHandler}
                value={data.Description}
                multiline
                rows={3}
                placeholder="Enter your Description..."
              />
            </Grid>

            <Grid item xs={12} lg={12}>
              <input
                accept="image/*"
                id="contained-button-file"
                type="file"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <label htmlFor="contained-button-file">
                <Button
                  fullWidth
                  variant="contained"
                  component="span"
                  disabled={isSubmitDisabled()}
                  sx={{
                    backgroundColor: "#8F00FF",
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: "#3B444B",
                    },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <CloudUploadIcon sx={{ marginRight: 1 }} />
                  <Typography noWrap>
                    {uploadedImg && uploadedImg.name
                      ? uploadedImg.name
                      : "Upload File"}
                  </Typography>
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
          Manage Medical test
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
          Add Medical Test
        </Button>
      </Grid>

      <Grid container spacing={3} justifyContent="start">
        {imgData.slice(startIndex, endIndex).map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card sx={{ width: "100%" }}>
              <CardMedia
                sx={{ height: 170 }}
                image={`${Bunny_Image_URL}/Schedule/Medical/${item.Image}`}
                alt="img"
                title={item.Name}
              />
              <CardContent>
                <Typography
                  noWrap
                  height={25}
                  gutterBottom
                  component="div"
                  textAlign={"start"}
                >
                  <b>Title:{item.Name}</b>
                </Typography>
                <Typography
                  textAlign={"start"}
                  variant="body2"
                  style={styles.typography}
                  color="textSecondary"
                  component="div"
                >
                  <b>Description: </b> {item.Description}
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  pt: "0",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <IconButton color="primary" onClick={() => handleClick(item)}>
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
}
