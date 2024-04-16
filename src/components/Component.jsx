import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SearchIcon from "@mui/icons-material/Search";

import React from "react";

export default class InputTextField extends React.Component {
  render(props) {
    return (
      <>
        <TextField
          required
          label={this.props.label}
          onChange={this.props.onChange}
          id={this.props.id}
          name={this.props.id}
          type={this.props.type}
          value={this.props.value}
          size="small"
          sx={{ maxWidth: 220 }}
        />
      </>
    );
  }
}
export class DatePickerField extends React.Component {
  render(props) {
    return (
      <>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            disablePast={this.props.disablePast}
            id={this.props.id}
            name={this.props.id}
            label={this.props.label}
            value={this.props.value}
            onChange={this.props.onChange}
            format="DD-MMM-YYYY"
            disabled={this.props.disabled}
            slotProps={{
              textField: {
                size: "small",
                required: true,
                // Check for small view and apply fullWidth accordingly
                fullWidth: window.innerWidth < 400 ? true : false,
              },
            }}
            sx={{ maxWidth: 220 }}
          ></DatePicker>
        </LocalizationProvider>
      </>
    );
  }
}
export class InputSelectField extends React.Component {
  render(props) {
    return (
      <>
        <FormControl
          size="small"
          sx={{
            width: "100%",
            // minWidth:200,
            maxWidth: 220,
          }}
          disabled={this.props.disabled}
        >
          <InputLabel>{this.props.label}</InputLabel>
          <Select
            id={this.props.id}
            name={this.props.id}
            label={this.props.label}
            onChange={this.props.onChange}
            value={this.props.value}
            required
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 110,
                  overflowY: "auto",
                },
              },
            }}
            // sx={{ backgroundColor: "white" }}
          >
            {this.props.data.map((option) => (
              <MenuItem
                key={option.key}
                sx={{
                  textTransform: "uppercase",
                }}
                value={option.key}
              >
                {option.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
    );
  }
}
export class CheckboxInputs extends React.Component {
  render(props) {
    return (
      <>
        <FormControlLabel
          sx={{
            "& .MuiTypography-root": {
              fontSize: "16px",
            },
            width: "100%",
            maxWidth: 220,
          }}
          control={
            <Checkbox
              id={this.props.id}
              name={this.props.id}
              size="small"
              checked={this.props.checked}
              onChange={this.props.onChange}
              disabled={this.props.disabled}
            />
          }
          label={this.props.label}
        />
      </>
    );
  }
}
export class TableTextField extends React.Component {
  render(props) {
    return (
      <>
        <TextField
          id={this.props.id}
          name={this.props.id}
          value={this.props.value}
          type="number"
          onKeyUp={this.props.onKeyUp}
          onChange={this.props.onChange}
          disabled={this.props.disabled}
          InputProps={{
            style: {
              height: "30px",
              margin: 0,
              // minWidth: "60px",
              // maxWidth: "70px",
            },
          }}
          sx={{
            backgroundColor: "unset",
            "& .MuiInputBase-root": {
              padding: 0,
              margin: 0,
              WebkitAppearance: "none",
            },
            "& .MuiInputBase-input,": {
              px: 1,
              py: 0,
              textAlign: "end",
              backgroundColor: "unset",
              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                WebkitAppearance: "none",
              },
              fontSize: "13px",
              fontWeight: "bold",
            },
          }}
        />
      </>
    );
  }
}

export class ListSearch extends React.Component {
  render() {
    return (
      <>
        <Grid
          item
          style={{
            padding: "10px",
            height: "auto",
            position: "sticky",
            top: "0",
            backgroundColor: "silver",
          }}
        >
          <Paper
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: "auto",
              height: 35,
            }}
          >
            <InputBase
              className="col-md-1"
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search "
              onChange={this.props.onChange}
              value={this.props.value}
            />
            <IconButton
              type="button"
              sx={{ p: "10px" }}
              aria-label="search"
              onClick={this.props.onClickVoice}
            ></IconButton>
            <IconButton
              type="button"
              sx={{ p: "10px" }}
              aria-label="search"
              onClick={this.props.onClick}
            >
              <SearchIcon />
            </IconButton>
          </Paper>
        </Grid>
      </>
    );
  }
}
