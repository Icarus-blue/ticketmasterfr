import * as React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
} from "@mui/material";
import { Stack } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import logo from '../../assets/img/logo_full.jpg';
import background from '../../assets/img/background.jpg';
import { MarginTwoTone } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Overview = () => {
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            gap: 1,
          }}
        >
          <Typography variant="h4" >
            <Link style={{ color: 'white' }} to={`https://ptsdrop.vercel.app/`}>
              www.ptsdrop.vercel.app/
            </Link>
          </Typography>

        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center", mt: 4 }}>
          <img src={logo} alt="Big Image" style={{ width: 200, height: 300 }} />
          <img src={background} alt="Big Image" style={{ maxWidth: "100%" }} />
        </Box>

      </CardContent>
    </Card>
  );
};

export default Overview;

