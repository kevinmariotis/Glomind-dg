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
  course?: string;
  state?: string;
  time?: string;
  dateFirst?: string;
  dateLast?: string;
  value?: string;
  index?: number;
  items: any[];
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
  index,
  items = [],
  value,
}: CardPensumProps) => {
  console.log(items);
  return (
    <Box className="contentCardPensum">
      {/**********/}
      {/* IMAGEN */}
      {/**********/}
      <Box className="img" sx={{ background: `url(${img})` }}></Box>
      {/* <Box className="img" sx={{ background: `url(${img})` }} /> */}

      {/***************/}
      {/* INFORMACION */}
      {/***************/}
      <Box className="info">
        <Typography
          className="title size20"
          style={{
            color: "var(--Lavander)",
          }}
        >
          {title}
        </Typography>
        {/***************/}
        {/* DESCRIPTION */}
        {/***************/}
        <Typography className="description size16">
          {description?.split("<separador>")[0]}{" "}
          <a href={description?.split("<separador>")[1]} target="_blank">Ver más</a>
        </Typography>
        <div className="section-block my-2"></div>
        {/*****************/}
        {/* DATOS CARRERA */}
        {/*****************/}
        <Stack
          className="counter stackInfo"
          direction={{ xs: "column", sm: "row" }}
          divider={<Divider orientation="vertical" flexItem />}
          spacing={{ xs: 1, sm: 2 }}
        >
          <Item>
            <Typography className="size16" style={{ color: "black" }}>
              {items[0]}
            </Typography>
          </Item>
          <Item>
            <Typography className="size16" style={{ color: "black" }}>
              Online
            </Typography>
          </Item>
          <Item>
            <Typography
              className="size16"
              sx={{ textWrap: "nowrap", color: "black" }}
            >
              {items[1]} {items[4]}
              {items[4] == 1 ? "" : "s"}
            </Typography>
          </Item>
        </Stack>
        <div className="section-block my-2"></div>
        {/*****************/}
        {/* FECHA CARRERA */}
        {/*****************/}
        <Stack
          className="counter stackInfo"
          direction={{ xs: "column", sm: "row" }}
          divider={<Divider orientation="vertical" flexItem />}
          spacing={{ xs: 1, sm: 2 }}
        >
          <Item>
            <Typography
              className="size16"
              sx={{ textWrap: "nowrap", color: "black" }}
            >
              Inicio: {items[2]}
            </Typography>
          </Item>
          <Item>
            <Typography
              className="size16"
              sx={{ textWrap: "nowrap", color: "black" }}
            >
              Fin: {items[3]}
            </Typography>
          </Item>
        </Stack>
      </Box>

      {/*********/}
      {/* VALOR */}
      {/*********/}
      <Box className="value">
        <Typography className="title size20">{title}</Typography>
        <Typography className="size25">MX$ {value}</Typography>
      </Box>
    </Box>
  );
};

export default CardPensum;
