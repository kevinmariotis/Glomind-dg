import React from "react";
import { Box, Divider, Paper, Stack, styled, Typography } from "@mui/material";

// IMPORTADOS
import "./cardPensum.scss";

interface CardPensumProps {
  code?: string;
  img?: string;
  title?: string;
  description?: string;
  path: string;
  value?: string;
  footer?: string;
  index?: number;
  items?: any[];
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  fontSize: "clamp(18px, 2dvw, 32px) !important",
  boxShadow: "none",
  color: "#fff",
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

const CardPensum = ({
  code,
  img,
  title,
  description,
  path,
  footer,
  index,
  items = [],
  value,
}: CardPensumProps) => {
  return (
    <Box className="contentCardPensum">
      {/**********/}
      {/* IMAGEN */}
      {/**********/}
      <Box className="img" sx={{ background: `url(${img})` }}>
        <Box>
          <Typography className="title size25">{title}</Typography>
        </Box>
      </Box>
      {/* <Box className="img" sx={{ background: `url(${img})` }} /> */}

      {/***************/}
      {/* INFORMACION */}
      {/***************/}
      <Box className="info">
        {/**********/}
        {/* TITULO */}
        {/**********/}
        <Typography className="title size20">{title}</Typography>

        {/***************/}
        {/* DESCRIPTION */}
        {/***************/}
        <Typography className="description size16">
          {description}{" "}
          <a
            href={
              code === "program" ||
              code === "doctorate" ||
              code === "mastery" ||
              code === "course"
                ? `${path}?${code}&${index}`
                : `${path}`
            }
            target="_blank"
          >
            Ver más
          </a>
        </Typography>
        <div className="row">
          {items.map((item) => (
            <div className="col-6" style={{fontWeight: "normal"}}>{item}</div>
          ))}
        </div>
      </Box>

      {/*********/}
      {/* VALOR */}
      {/*********/}
      <Box className="value">
        <Typography className="size25">MX$ {value}</Typography>
        <Typography className="size16">{footer}</Typography>
      </Box>
    </Box>
  );
};

export default CardPensum;
