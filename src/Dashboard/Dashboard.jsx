import { ExpandLess, ExpandMore } from "@mui/icons-material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AppSettingsAltIcon from "@mui/icons-material/AppSettingsAlt";
// import ApprovalIcon from "@mui/icons-material/Approval";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import CommentIcon from "@mui/icons-material/Comment";
import AdUnitsOutlinedIcon from "@mui/icons-material/AdUnitsOutlined";
import ApprovalIcon from "@mui/icons-material/Approval";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
// import GroupsIcon from "@mui/icons-material/Groups";
import LightModeIcon from "@mui/icons-material/LightMode";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MenuIcon from "@mui/icons-material/Menu";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import NoFoodIcon from "@mui/icons-material/NoFood";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import PostAddIcon from "@mui/icons-material/PostAdd";
import QuizIcon from "@mui/icons-material/Quiz";
import RemoveIcon from "@mui/icons-material/Remove";
import SettingsIcon from "@mui/icons-material/Settings";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import TodayIcon from "@mui/icons-material/Today";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import VideoSettingsIcon from "@mui/icons-material/VideoSettings";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";

import {
  Avatar,
  Button,
  Collapse,
  Grid,
  MenuItem,
  Modal,
  Paper,
  useMediaQuery,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import * as React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../../src/assets/logo.png";

import "../Dashboard/Dashboard.css";
// import avatar from "../assets/avtar.png";
import { Bunny_Image_URL } from "../Constant";
import { isLogin } from "./Auth";

import { Tooltip } from "@mui/material";
import { useThemeMode } from "./Theme";

import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { keyframes } from "@mui/system";
import { useState } from "react";

const drawerWidth = 260;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#5C5CFF",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100%)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      borderRight: "none",
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      borderRight: "none",
    },
  }),
}));
const style = {
  position: "absolute",
  top: 15,
  right: 10,
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  marginTop: 7,
};

const rotateIcon = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Styled component with rotation animation
const RotatingIcon = styled(SettingsIcon)(({ theme }) => ({
  animation: `${rotateIcon} 5s linear infinite`,
}));

export default function Dashboard() {
  const [fullscreen, setFullscreen] = React.useState(false);
  const Navigate = useNavigate();

  const router = useLocation();
  const [open, setOpen] = React.useState(true);
  const [openList, setOpenList] = React.useState(false);
  const [on, setOn] = React.useState(false);
  const { themeMode, LightMode, DarkMode } = useThemeMode();
  const [themestatus, setThemeStatus] = useState();
  // const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [userData, setUserData] = React.useState({
    Name: "",
    Phone: "",
    Address: "",
    Email: "",
    BloodGroup: "",
    Avatar: "",
    _id: "",
  });

  // const [openMenu, setOpenMenu] = React.useState(false);
  const [list, setList] = React.useState(false);

  const [openProcessTransactions, setOpenProcessTransactions] =
    React.useState(false);

  const handleOn = () => {
    // console.log(`${Bunny_Image_URL}/Users/${userData._id}/${userData.Avatar}`);
    setOn(true);
  };
  const handleClose = () => {
    setOn(false);
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // ------------------Full Screen-------------------
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setFullscreen(false));
    }
  };
  // ---------------------------------------

  React.useEffect(() => {
    const userData = sessionStorage.getItem("userData");
    // console.log(JSON.parse(userData));
    setUserData(JSON.parse(userData));
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  const location = useLocation();

  const handleDrawerOpen = () => {
    // setDrawerOpen(true);
    setOpen(!open);
    handleClickTransaction();
  };

  const handleClickMasters = () => {
    if (!open) {
      setOpen(true);
    }
    setOpenList(!openList);
    if (openProcessTransactions) {
      setOpenProcessTransactions(!openProcessTransactions);
    }
    handleClickTransaction();
  };
  const handleClickTransaction = () => {
    setOpenProcessTransactions(!openProcessTransactions);
    if (openList) {
      setOpenList(!openList);
    } else if (list) {
      setList(!list);
    }
  };

  const menuId = "primary-search-account-menu";

  // const handleUploadProfile = () => {
  //   setOpen(true);
  // };

  React.useEffect(() => {
    if (!isLogin()) {
      Navigate("/");
    }
  });
  // const themeChange = (e) => {
  //   const themestatus = e.currentTarget.checked;
  //   if (themestatus) {
  //     DarkMode();
  //   } else {
  //     LightMode();
  //   }
  // };

  const themechange = () => {
    if (themestatus) {
      DarkMode();

      setThemeStatus(false);
    } else {
      LightMode();

      setThemeStatus(true);
    }
  };

  const actions = [
    {
      icon: (
        <IconButton
          size="large"
          aria-label="toggle theme"
          color="inherit"
          onClick={themechange}
        >
          {themeMode === "dark" ? <LightModeIcon /> : <ModeNightIcon />}
        </IconButton>
      ),
      name: "Change Theme",
    },

    {
      icon: (
        <IconButton onClick={toggleFullscreen}>
          {fullscreen ? <FullscreenIcon /> : <FullscreenExitIcon />}
        </IconButton>
      ),
      name: "Screen",

    },
    // { icon: <ShareIcon />, name: "Share" },
  ];
  return (
    <Box
      sx={{
        display: "flex",
        //  backgroundColor: "#F5F6FA",
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <CssBaseline />
      <Modal open={on} onClose={handleClose}>
        <Paper elevation={10} sx={{ ...style, width: 300 }}>
          <center>
            <Grid
              container
              item
              height={"100%"}
              width={"100%"}
              justifyContent={"center"}
              alignItems="center"
              position="relative"
            >
              <Avatar
                alt="Avatar"
                src={`${Bunny_Image_URL}/Users/${userData._id}/${userData.Avatar}`}
                sx={{
                  width: 80,
                  height: 80,
                  position: "absolute",
                  top: "calc(28% - 50px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 1,
                  border: "1px solid black",
                }}
              />
              <Grid
                item
                height={100}
                width={"100%"}
                style={{
                  backgroundColor: "#5C5CFF",
                  backgroundImage:
                    "linear-gradient(360deg, #647DEE 0%, #7F53AC 74%)",
                }}
              />

              <Paper
                style={{
                  width: "270px",
                  marginTop: -40,
                  borderRadius: 10,
                  position: "relative",
                  marginLeft: 15,
                  marginRight: 15,
                  zIndex: 0,
                }}
              >
                <Grid
                  paddingTop={7}
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                >
                  <MenuItem sx={{ fontSize: 13 }}>
                    <b>Name : {userData.Name}</b>
                  </MenuItem>
                  <MenuItem sx={{ fontSize: 13, paddingTop: 0 }}>
                    <b>Mob :</b> {userData.Phone}
                  </MenuItem>

                  <MenuItem sx={{ fontSize: 13, paddingTop: 0 }}>
                    <b>Address :</b> {userData.Address}
                  </MenuItem>
                </Grid>

                <Grid
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  paddingBottom={2}
                >
                  <Button
                    onClick={() => {
                      Navigate("/");
                    }}
                    sx={{
                      boxShadow: 9,
                      borderRadius: 10,
                      backgroundColor: "#70b2d9",

                      backgroundImage:
                        "linear-gradient(180deg, #647DEE 0%, #7F53AC 180%)",

                      color: "white",
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  >
                    Log Out
                    {/* <b>Log Out</b> */}
                  </Button>
                </Grid>
              </Paper>
            </Grid>
          </center>
        </Paper>
      </Modal>
      <AppBar position="fixed" open={open}>
        <Toolbar
          sx={{
            width: "100vw",
            backgroundColor: (theme) =>
              theme.palette.customAppbar?.appbarcolor || "defaultColor",

            boxShadow: "0px 5px 7px rgba(0, 0, 0, 0.1)",
            elevation: 8,
            display: "flex",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              color: "white",
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            textAlign="center"
            width="100%"
            className="flash-animation"
            sx={{ elevation: 6, color: "white" }}
          >
            The Dream Mom
          </Typography>

          {/* <IconButton
            size="large"
            aria-label="toggle theme"
            color="inherit"
            onClick={themechange}
          >
            {themeMode === "dark" ? <LightModeIcon /> : <ModeNightIcon />}
          </IconButton> 

          {/* <Tooltip title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            <IconButton
              sx={{ color: "white" }}
              size="large"
              edge="end"
              aria-label="toggle fullscreen"
              onClick={toggleFullscreen}
              color="inherit"
            >
              {fullscreen ? <FullscreenIcon /> : <FullscreenExitIcon />}
            </IconButton>
          </Tooltip> */}

          <Tooltip title={userData.Name}>
            <IconButton
              size="small"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleOn}
              color="inherit"
            >
              <Avatar
                src={
                  `${Bunny_Image_URL}/Users/${userData._id}/${userData.Avatar}` || (
                    <AccountCircle />
                  )
                }
              />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} PaperProps={{ elevation: 7 }}>
        <DrawerHeader>
          <IconButton>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Grid
          style={{
            height: 90,
            // backgroundColor: "white",
          }}
        >
          <img
            src={logo}
            alt="logo"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              paddingTop: 10,
              // borderRadius:30,
            }}
          />
        </Grid>
        <Grid
          sx={{
            width: "100%",
            // maxWidth: 340,
            height: "100%",
            // backgroundColor: "White",
            overflow: "hidden",
            "&:hover": {
              overflowY: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "#888 transparent",
            },
          }}
        >
          <List
            sx={{
              width: "100%",
              maxWidth: 340,
              height: "100%",
              ...(open && {
                margin: "0 0",
              }),
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <div className="dashboard-menu">
              <Link to="home" className="link_style">
                <ListItemButton
                  onClick={handleClickTransaction}
                  selected={location.pathname === "/dashboard/home"}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#5C5CFF",
                      borderRadius: 1,
                      "& .MuiListItemIcon-root, & .MuiTypography-root": {
                        color: "#FFFFFF",
                      },
                    },
                    "& .MuiListItemText-primary": {
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ minWidth: "33px", marginRight: "8px" }}
                    onClick={handleDrawerOpen}
                  >
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </Link>
              <Link to="manage-user" className="link_style">
                <ListItemButton
                  onClick={handleClickTransaction}
                  selected={location.pathname === "/dashboard/manage-user"}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#5C5CFF",
                      borderRadius: 1,
                      "& .MuiListItemIcon-root, & .MuiTypography-root": {
                        color: "#FFFFFF",
                      },
                    },
                    "& .MuiListItemText-primary": {
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ minWidth: "33px", marginRight: "8px" }}
                    onClick={handleDrawerOpen}
                  >
                    <ManageAccountsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage User" />
                </ListItemButton>
              </Link>
              <ListItemButton
                onClick={handleClickMasters}
                selected={location.pathname === "/manage-schedule"}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#5C5CFF",

                    borderRadius: 1,
                    "& .MuiListItemIcon-root, & .MuiTypography-root": {
                      color: "#FFFFFF",
                    },
                  },
                  "& .MuiListItemText-primary": {
                    color: theme.palette.text.primary,
                  },
                }}
              >
                <ListItemIcon
                  sx={{ minWidth: "33px", marginRight: "8px" }}
                  // onClick={handleDrawerOpen}
                >
                  <WorkHistoryIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Schedule" />

                {openList ? (
                  <ExpandLess style={{ marginLeft: "auto" }} />
                ) : (
                  <ExpandMore style={{ marginLeft: "auto" }} />
                )}
              </ListItemButton>

              <Collapse in={openList} timeout="auto">
                <List component="div" disablePadding>
                  <Link to="manage-schedule/diet" className="link_style">
                    <ListItemButton
                      selected={
                        router.pathname === "/dashboard/manage-schedule/diet"
                          ? true
                          : false
                      }
                      sx={{
                        "&.Mui-selected": {
                          backgroundColor: "#5C5CFF",
                          borderRadius: 1,
                          "& .MuiListItemIcon-root, & .MuiTypography-root": {
                            color: "#FFFFFF",
                          },
                        },
                        "& .MuiListItemText-primary": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ pl: 4 }}>
                        <RemoveIcon />
                      </ListItemIcon>
                      <ListItemText primary="Diet" sx={{ pl: 2 }} />
                    </ListItemButton>
                  </Link>

                  <Link to="manage-schedule/exercise" className="link_style">
                    <ListItemButton
                      selected={
                        router.pathname ===
                        "/dashboard/manage-schedule/exercise"
                          ? true
                          : false
                      }
                      sx={{
                        "&.Mui-selected": {
                          backgroundColor: "#5C5CFF",
                          borderRadius: 1,
                          "& .MuiListItemIcon-root, & .MuiTypography-root": {
                            color: "#FFFFFF",
                          },
                        },
                        "& .MuiListItemText-primary": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ pl: 4 }}>
                        <RemoveIcon />
                      </ListItemIcon>
                      <ListItemText primary="Exercise" sx={{ pl: 2 }} />
                    </ListItemButton>
                  </Link>

                  <Link to="manage-schedule/medical" className="link_style">
                    <ListItemButton
                      selected={
                        router.pathname === "/dashboard/manage-schedule/medical"
                          ? true
                          : false
                      }
                      sx={{
                        "&.Mui-selected": {
                          backgroundColor: "#5C5CFF",
                          borderRadius: 1,
                          "& .MuiListItemIcon-root, & .MuiTypography-root": {
                            color: "#FFFFFF",
                          },
                        },
                        "& .MuiListItemText-primary": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ pl: 4 }}>
                        <RemoveIcon />
                      </ListItemIcon>
                      <ListItemText primary="Medical Test" sx={{ pl: 2 }} />
                    </ListItemButton>
                  </Link>

                  <Link to="manage-schedule/MedDetils" className="link_style">
                    <ListItemButton
                      selected={
                        router.pathname ===
                        "/dashboard/manage-schedule/MedDetils"
                          ? true
                          : false
                      }
                      sx={{
                        "&.Mui-selected": {
                          backgroundColor: "#5C5CFF",
                          borderRadius: 1,
                          "& .MuiListItemIcon-root, & .MuiTypography-root": {
                            color: "#FFFFFF",
                          },
                        },
                        "& .MuiListItemText-primary": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ pl: 4 }}>
                        <RemoveIcon />
                      </ListItemIcon>
                      <ListItemText primary="Medical Details" sx={{ pl: 2 }} />
                    </ListItemButton>
                  </Link>

                  <Link to="manage-schedule/medication" className="link_style">
                    <ListItemButton
                      selected={
                        router.pathname ===
                        "/dashboard/manage-schedule/medication"
                          ? true
                          : false
                      }
                      sx={{
                        "&.Mui-selected": {
                          backgroundColor: "#5C5CFF",
                          borderRadius: 1,
                          "& .MuiListItemIcon-root, & .MuiTypography-root": {
                            color: "#FFFFFF",
                          },
                        },
                        "& .MuiListItemText-primary": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ pl: 4 }}>
                        <RemoveIcon />
                      </ListItemIcon>
                      <ListItemText primary="Medications" sx={{ pl: 2 }} />
                    </ListItemButton>
                  </Link>

                  <Link to="manage-schedule/precaution" className="link_style">
                    <ListItemButton
                      selected={
                        router.pathname ===
                        "/dashboard/manage-schedule/precaution"
                          ? true
                          : false
                      }
                      sx={{
                        "&.Mui-selected": {
                          backgroundColor: "#5C5CFF",
                          borderRadius: 1,
                          "& .MuiListItemIcon-root, & .MuiTypography-root": {
                            color: "#FFFFFF",
                          },
                        },
                        "& .MuiListItemText-primary": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ pl: 4 }}>
                        <RemoveIcon />
                      </ListItemIcon>
                      <ListItemText primary="Precaution" sx={{ pl: 2 }} />
                    </ListItemButton>
                  </Link>

                  <Link to="manage-schedule/vaccination" className="link_style">
                    <ListItemButton
                      selected={
                        router.pathname ===
                        "/dashboard/manage-schedule/vaccination"
                          ? true
                          : false
                      }
                      sx={{
                        "&.Mui-selected": {
                          backgroundColor: "#5C5CFF",
                          borderRadius: 1,
                          "& .MuiListItemIcon-root, & .MuiTypography-root": {
                            color: "#FFFFFF",
                          },
                        },
                        "& .MuiListItemText-primary": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ pl: 4 }}>
                        <RemoveIcon />
                      </ListItemIcon>
                      <ListItemText primary="Vaccination" sx={{ pl: 2 }} />
                    </ListItemButton>
                  </Link>
                </List>
              </Collapse>
              <Link to="post-natal" className="link_style">
                <ListItemButton
                  onClick={handleClickTransaction}
                  selected={location.pathname === "/dashboard/post-natal"}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#5C5CFF",
                      borderRadius: 1,
                      "& .MuiListItemIcon-root, & .MuiTypography-root": {
                        color: "#FFFFFF",
                      },
                    },
                    "& .MuiListItemText-primary": {
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ minWidth: "33px", marginRight: "8px" }}
                    onClick={handleDrawerOpen}
                  >
                    <ApprovalIcon />
                  </ListItemIcon>
                  <ListItemText primary="Post Natal" />
                </ListItemButton>
              </Link>

              <Link to="plan-master" className="link_style">
                <ListItemButton
                  onClick={handleClickTransaction}
                  selected={location.pathname === "/dashboard/plan-master"}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#5C5CFF",
                      borderRadius: 1,
                      "& .MuiListItemIcon-root, & .MuiTypography-root": {
                        color: "#FFFFFF",
                      },
                    },
                    "& .MuiListItemText-primary": {
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ minWidth: "33px", marginRight: "8px" }}
                    onClick={handleDrawerOpen}
                  >
                    <TodayIcon />
                  </ListItemIcon>
                  <ListItemText primary="Plan Master" />
                </ListItemButton>
              </Link>

              <Link to="manage-assesment" className="link_style">
                <ListItemButton
                  onClick={handleClickTransaction}
                  selected={location.pathname === "/dashboard/manage-assesment"}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#5C5CFF",
                      borderRadius: 1,
                      "& .MuiListItemIcon-root, & .MuiTypography-root": {
                        color: "#FFFFFF",
                      },
                    },
                    "& .MuiListItemText-primary": {
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ minWidth: "33px", marginRight: "8px" }}
                    onClick={handleDrawerOpen}
                  >
                    <NoteAltIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage Assesment" />
                </ListItemButton>
              </Link>

              <Link to="medical-condition" className="link_style">
                <ListItemButton
                  onClick={handleClickTransaction}
                  selected={
                    location.pathname === "/dashboard/medical-condition"
                  }
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#5C5CFF",
                      borderRadius: 1,
                      "& .MuiListItemIcon-root, & .MuiTypography-root": {
                        color: "#FFFFFF",
                      },
                    },
                    "& .MuiListItemText-primary": {
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ minWidth: "33px", marginRight: "8px" }}
                    onClick={handleDrawerOpen}
                  >
                    <MonitorHeartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Medical Condition" />
                </ListItemButton>
              </Link>
              <Link to="manage-avoid-food" className="link_style">
                <ListItemButton
                  onClick={handleClickTransaction}
                  selected={
                    location.pathname === "/dashboard/manage-avoid-food"
                  }
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#5C5CFF",
                      borderRadius: 1,
                      "& .MuiListItemIcon-root, & .MuiTypography-root": {
                        color: "#FFFFFF",
                      },
                    },
                    "& .MuiListItemText-primary": {
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ minWidth: "33px", marginRight: "8px" }}
                    onClick={handleDrawerOpen}
                  >
                    <NoFoodIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage Avoid Foods" />
                </ListItemButton>
              </Link>
              <Link to="manage-videos" className="link_style">
                <ListItemButton
                  onClick={handleClickTransaction}
                  selected={location.pathname === "/dashboard/manage-videos"}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#5C5CFF",
                      // backgroundColor: (theme) => theme.palette.customAppbar?.appbarcolor || 'defaultColor',

                      // m:0.5,
                      borderRadius: 1,
                      "& .MuiListItemIcon-root, & .MuiTypography-root": {
                        color: "#FFFFFF",
                      },
                    },
                    "& .MuiListItemText-primary": {
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ minWidth: "33px", marginRight: "8px" }}
                    onClick={handleDrawerOpen}
                  >
                    <VideoSettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage Videos" />
                </ListItemButton>
              </Link>
              <Link to="manage-posts" className="link_style">
                <ListItemButton
                  onClick={handleClickTransaction}
                  selected={location.pathname === "/dashboard/manage-posts"}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#5C5CFF",
                      // m:0.5,
                      borderRadius: 1,
                      "& .MuiListItemIcon-root, & .MuiTypography-root": {
                        color: "#FFFFFF",
                      },
                    },
                    "& .MuiListItemText-primary": {
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ minWidth: "33px", marginRight: "8px" }}
                    onClick={handleDrawerOpen}
                  >
                    <PostAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage Posts" />
                </ListItemButton>
              </Link>
              <Link to="manage-faq" className="link_style">
                <ListItemButton
                  onClick={handleClickTransaction}
                  selected={location.pathname === "/dashboard/manage-faq"}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#5C5CFF",

                      borderRadius: 1,
                      "& .MuiListItemIcon-root, & .MuiTypography-root": {
                        color: "#FFFFFF",
                      },
                    },
                    "& .MuiListItemText-primary": {
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ minWidth: "33px", marginRight: "8px" }}
                    onClick={handleDrawerOpen}
                  >
                    <QuizIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage FAQ's" />
                </ListItemButton>
              </Link>

              <Link to="manage-subscription" className="link_style">
                <ListItemButton
                  onClick={handleClickTransaction}
                  selected={
                    location.pathname === "/dashboard/manage-subscription"
                  }
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#5C5CFF",

                      borderRadius: 1,
                      "& .MuiListItemIcon-root, & .MuiTypography-root": {
                        color: "#FFFFFF",
                      },
                    },
                    "& .MuiListItemText-primary": {
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ minWidth: "33px", marginRight: "8px" }}
                    onClick={handleDrawerOpen}
                  >
                    <SubscriptionsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage Subscription" />
                </ListItemButton>
              </Link>
              <Link to="manage-report" className="link_style">
                <ListItemButton
                  onClick={handleClickTransaction}
                  selected={location.pathname === "/dashboard/manage-report"}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#5C5CFF",

                      borderRadius: 1,
                      "& .MuiListItemIcon-root, & .MuiTypography-root": {
                        color: "#FFFFFF",
                      },
                    },
                    "& .MuiListItemText-primary": {
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ minWidth: "33px", marginRight: "8px" }}
                    onClick={handleDrawerOpen}
                  >
                    <NoteAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage Report" />
                </ListItemButton>
              </Link>
              <Link to="manage-advertise" className="link_style">
                <ListItemButton
                  onClick={handleClickTransaction}
                  selected={location.pathname === "/dashboard/manage-advertise"}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#5C5CFF",

                      borderRadius: 1,
                      "& .MuiListItemIcon-root, & .MuiTypography-root": {
                        color: "#FFFFFF",
                      },
                    },
                    "& .MuiListItemText-primary": {
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ minWidth: "33px", marginRight: "8px" }}
                    onClick={handleDrawerOpen}
                  >
                    <AppSettingsAltIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage Advertise" />
                </ListItemButton>
              </Link>
              <Link to="manage-blog" className="link_style">
                <ListItemButton
                  onClick={handleClickTransaction}
                  selected={location.pathname === "/dashboard/manage-blog"}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#5C5CFF",

                      borderRadius: 1,
                      "& .MuiListItemIcon-root, & .MuiTypography-root": {
                        color: "#FFFFFF",
                      },
                    },
                    "& .MuiListItemText-primary": {
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ minWidth: "33px", marginRight: "8px" }}
                    onClick={handleDrawerOpen}
                  >
                    <NewspaperIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage Blog & letter" />
                </ListItemButton>
              </Link>
              {/* <Link to="manage-expert" className="link_style">
                <ListItemButton
                  onClick={handleClickTransaction}
                  selected={location.pathname === "/dashboard/manage-expert"}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#5C5CFF",
                      // m:0.5,
                      borderRadius: 1,
                      "& .MuiListItemIcon-root, & .MuiTypography-root": {
                        color: "#FFFFFF",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ minWidth: "32px", marginRight: "8px" }}
                    onClick={handleDrawerOpen}
                  >
                    <GroupsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage Expert ANS" />
                </ListItemButton>
              </Link> */}
              {/* <Link to="manage-comments" className="link_style">
              <ListItemButton
                onClick={handleClickTransaction}
                selected={location.pathname === "/dashboard/manage-comments"}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#5C5CFF",
                    // m:0.5,
                    borderRadius: 1,
                    "& .MuiListItemIcon-root, & .MuiTypography-root": {
                      color: "#FFFFFF",
                    },
                  },
                   "& .MuiListItemText-primary": {
                      color: theme.palette.text.primary,
                    },
                }}
              >
                <ListItemIcon sx={{ minWidth: "32px", marginRight: "8px" }}>
                  <CommentIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Comments" />
              </ListItemButton>
            </Link> */}
              {/* ------------------------------------------ */}

              <Link to="manage-banner" className="link_style">
                <ListItemButton
                  onClick={handleClickTransaction}
                  selected={location.pathname === "/dashboard/manage-banner"}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#5C5CFF",
                      borderRadius: 1,
                      "& .MuiListItemIcon-root, & .MuiTypography-root": {
                        color: "#FFFFFF",
                      },
                    },
                    "& .MuiListItemText-primary": {
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "33px", marginRight: "8px" }}>
                    <AdUnitsOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage Banners" />
                </ListItemButton>
              </Link>
              {/* ----------------------------------------- */}
              <Link to="manage-doses" className="link_style">
                <ListItemButton
                  onClick={handleClickTransaction}
                  selected={location.pathname === "/dashboard/manage-doses"}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#5C5CFF",

                      borderRadius: 1,
                      "& .MuiListItemIcon-root, & .MuiTypography-root": {
                        color: "#FFFFFF",
                      },
                    },
                    "& .MuiListItemText-primary": {
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ minWidth: "33px", marginRight: "8px" }}
                    onClick={handleDrawerOpen}
                  >
                    <VaccinesIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage Dosage" />
                </ListItemButton>
              </Link>
              <Link to="manage-tags" className="link_style">
                <ListItemButton
                  onClick={handleClickTransaction}
                  selected={location.pathname === "/dashboard/manage-tags"}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#5C5CFF",

                      borderRadius: 1,
                      "& .MuiListItemIcon-root, & .MuiTypography-root": {
                        color: "#FFFFFF",
                      },
                    },
                    "& .MuiListItemText-primary": {
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ minWidth: "33px", marginRight: "8px" }}
                    onClick={handleDrawerOpen}
                  >
                    <LocalOfferIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage Tags" />
                </ListItemButton>
              </Link>
            </div>
          </List>
        </Grid>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ...(open && { width: `calc(100% - ${drawerWidth}px)` }),

          ...(!open && {
            width: theme.spacing(7),
            [theme.breakpoints.up("sm")]: {
              width: theme.spacing(9),
            },
          }),
        }}
      >
        <DrawerHeader />
        <Grid
          style={{
            position: "fixed",
            bottom: "55px",
            right: "0px",
            transform: "translateZ(4px)",
            flexGrow: 1,
            zIndex: 999,
          }}
        >
          <SpeedDial
            ariaLabel="SpeedDial"
            sx={{ position: "absolute", bottom: 16, right: 16 }}
            icon={<RotatingIcon />}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
              />
            ))}
          </SpeedDial>
        </Grid>

        <Outlet />
      </Box>
    </Box>
  );
}
