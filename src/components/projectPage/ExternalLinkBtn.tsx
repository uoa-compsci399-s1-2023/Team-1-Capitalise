import React from "react";
import { Button, SvgIcon, Box, useMediaQuery, useTheme, Stack } from "@mui/material";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import SquareOutlinedIcon from "@mui/icons-material/SquareOutlined";
import { TProject } from "../../model/TProject";
import { ButtonProps } from "@mui/material";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import { notionSvg, kaggleSvg, codePenSvg, linkedinIcon, githubIcon } from "./btnSvgs";



interface LinkBtnProps {
  startIcon: React.ReactNode;
  color: ButtonProps["color"];
  text: string;
  link: string;
  textColor: string;
  variant: ButtonProps["variant"];
}

function LinkBtn({
  startIcon,
  color,
  text,
  link,
  textColor,
  variant,
}: LinkBtnProps) {

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const handleClick = () => {
    window.open(link, "_blank", "noreferrer");
  };

  return (
    <Button
      {...{ color }}
      startIcon={!isSmall && startIcon}
      onClick={handleClick}
      endIcon={
        !isSmall && <LaunchOutlinedIcon />
      }
      variant={variant}
      sx={{
        fontWeight: 400,
        minWidth: "28px",
        width: { xs: 'fit-content', md: 180 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textTransform: "capitalize",
        color: textColor, // Text color
      }}
    >
      <Stack
        width={'100%'}
        alignContent={'center'}
      >
        {!isSmall && text}
        {isSmall && startIcon}
      </Stack>
      {/* {isSmall && 'sadfasdfas'} */}
    </Button>
  );
}

export default function ExternalLinkBtn({ type, value }: TProject["links"][0]) {
  let buttonProps: LinkBtnProps = {} as LinkBtnProps;

  switch (type) {
    case "github":
      buttonProps = {
        startIcon: githubIcon,
        color: "githubBtn",
        text: "Repository",
        textColor: "white",
        link: value,
        variant: "contained",
      };
      break;
    case "linkedin":
      buttonProps = {
        startIcon: linkedinIcon,
        color: "linkedinBtn",
        text: "Linkedin",
        textColor: "white",
        link: value,
        variant: "contained",
      };
      break;
    case "codesandbox":
      buttonProps = {
        startIcon: <SquareOutlinedIcon />,
        color: "black",
        text: "Sandbox",
        textColor: "white",
        link: value,
        variant: "contained",
      };
      break;
    case "deployedSite":
      buttonProps = {
        startIcon: <AspectRatioIcon />,
        color: "neutral",
        text: "Demo",
        textColor: "black",
        link: value,
        variant: "outlined",
      };
      break;
      case "kaggle":
        buttonProps = {
          startIcon: kaggleSvg,
          color: "kaggleBtn",
          text: "Kaggle",
          textColor: "white",
          link: value,
          variant: "contained",
        };
        break;
      case "notion":
        buttonProps = {
          startIcon: notionSvg,
          color: "neutral",
          text: "Notion",
          textColor: "black",
          link: value,
          variant: "outlined",
        };
        break;
      case "codepen":
        buttonProps = {
          startIcon: codePenSvg,
          color: "black",
          text: "CodePen",
          textColor: "white",
          link: value,
          variant: "contained",
        };
        break;
  }

  return <LinkBtn {...buttonProps} />;
}
