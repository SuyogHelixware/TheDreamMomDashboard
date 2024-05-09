import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import InputTextField, { InputDescriptionField } from "../components/Component";
import PlanMasterDiet from "./PlanMasterDiet";
import PlanMasterVaccination from "./PlanMasterVaccination";
import PlanMasterMedication from "./PlanMasterMedication";
import PlanMasterExercise from "./PlanMasterExercise";
import PlanMasterMedical from "./PlanMasterMedical";

const PlanMaster = () => {
  const [open, setOpen] = useState(false);
  // const [data, setData] = useState({
  //   Name: "",
  //   Description: "",
  //   Age: "",
  //   Height: "",
  //   Weight: "",
  // });

  const handleParentDialogOpen = () => {
    setOpen(true);
  };

  const handleParentDialogClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    console.log("------");
    handleParentDialogClose();
  };

  return (
    <>
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
        elevation={4}
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
          onClick={handleParentDialogOpen}
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
          Open Plan Master
        </Button>
      </Grid>

      <Dialog
        open={open}
        onClose={handleParentDialogClose}
        aria-labelledby="parent-dialog-title"
        aria-describedby="parent-dialog-description"
        fullScreen
        // fullWidth
      >
        <DialogTitle>
          <b>Plan Master</b>
          <IconButton
            aria-label="close"
            onClick={handleParentDialogClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            background: "linear-gradient(to right,#E5D9F2, #CDC1FF)",
            overflowY: { xs: "scroll", md: "auto" },
            "&::-webkit-scrollbar": {
              display: "none",
            },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <Grid container spacing={2} pt={3}>
            <Grid item xs={12} sm={4}>
              <InputTextField
                size="small"
                fullWidth
                id="Name"
                label="Enter Name"
                name="Name"
                // value={data.Name}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputTextField
                size="small"
                fullWidth
                id="Age"
                label="Enter Age"
                name="Age"
                // value={data.Age}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputDescriptionField
                size="small"
                required
                fullWidth
                id="Description"
                label="Enter Description"
                name="Description"
                multiline
                rows={3}
                // value={data.Description}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputTextField
                size="small"
                fullWidth
                id="Weight"
                label="Enter Weight"
                name="Weight"
                // value={data.Weight}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputTextField
                size="small"
                fullWidth
                id="Height"
                label="Enter Height"
                name="Height"
                // value={data.Height}
              />
            </Grid>
          </Grid>

          <PlanMasterDiet />
          <PlanMasterVaccination />
          <PlanMasterMedication />
          <PlanMasterExercise />
          <PlanMasterMedical />

          <DialogActions>
            <Button
              sx={{
                p: 1,
                px: 4,
                color: "white",
                backgroundColor: "#8F00FF",
                boxShadow: 5,
                position: "fixed",
                bottom: 10,
                right: 10,
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
              onClick={handleSave}
            >
              Save
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlanMaster;
