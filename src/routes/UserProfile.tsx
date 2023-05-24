import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Divider, Stack, Typography, styled } from "@mui/material";
import { getProject } from "../api/getProject";
import { getUser } from "../api/getUser";
import { TUser } from "../model/TUser";
import { TProject } from "../model/TProject";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectsGrid from "../components/projects/ProjectsGrid";
import MyTabs from "../components/MyTabs";
import ExternalLinkBtn from "../components/projectPage/ExternalLinkBtn";
import { useAuth } from "../customHooks/useAuth";
import EditUser from "../components/EditUser";
import Error from "../components/Error";
import MyComment from "../components/projectPage/Comments/MyComment";
import { TComment } from "../model/TComment";
import { getUserComments } from "../api/getUserComments";
import { deleteComment } from "../api/deleteComment";

const UserProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<TUser | undefined>();
  const [project, setProject] = useState<TProject | undefined>();
  const [likedProjects, setLikedProjects] = useState<TProject[]>([]);
  const [comments, setComments] = useState<TComment[]>([]);
  const [open, setOpen] = useState(false);
  let { userID } = useParams();
  let token = "";
  let isLoggedIn = false;
  const CustomScroll = styled(Box)({
    overflowX: "hidden",
    "&::-webkit-scrollbar": {
      width: 7,
    },
    "&::-webkit-scrollbar-track": {
      display: "none",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "darkgrey",
      borderRadius: "10px",
      opacity: "50`%",
    },
  });
  const userTabs = [
    {
      label: "Overview",
      index: "1",
      Component: (
        <Stack height="100%">
          <Box padding="5px 24px 10px 24px" width="100%">
            <Typography variant="h6">Bio</Typography>
            {typeof user != "undefined" && (
              <CustomScroll
                minHeight="75px"
                maxHeight={{ xs: "200px", md: "220px", xl: "300px" }}
                overflow="scroll"
              >
                {!user.bio && (
                  <Typography variant="body1" color="grey">
                    {"It's empty in here..."}
                  </Typography>
                )}
                <Typography
                  sx={{ wordBreak: "break-word" }}
                  whiteSpace="pre-line"
                >
                  {user.bio}
                </Typography>
              </CustomScroll>
            )}
          </Box>

          {project && (
            <Box>
              <Divider />
              <Box padding="10px 24px 24px 24px">
                <Typography variant="h6" paddingBottom="10px">
                  {"Project"}
                </Typography>
                <ProjectCard
                  title={project.name}
                  semester={project.semester.value}
                  image={
                    typeof project.thumbnail != "undefined"
                      ? project.thumbnail
                      : ""
                  }
                  teamname={project.teamname ? project.teamname : "teamname"}
                  category={project.category.value}
                  likes={project.likes}
                  badges={
                    project.badges ? project.badges.value : "" // Yathi - Updated to fix null error
                  }
                  projectID={project._id}
                ></ProjectCard>
              </Box>
            </Box>
          )}
        </Stack>
      ),
    },
    {
      label: "Likes",
      index: "2",
      Component: (
        <Box height="100%" padding="5px 24px 10px 24px">
          <Typography variant="h6">Likes</Typography>
          {likedProjects.length === 0 && (
            <Typography variant="body1" color="grey">
              {"It's empty in here..."}
            </Typography>
          )}
          <ProjectsGrid projects={likedProjects} justifyContent="start" />
        </Box>
      ),
    },
    {
      label: "Comments",
      index: "3",
      Component: (
        <Box height="100%" padding="5px 24px 10px 24px">
          <Typography variant="h6">Comments</Typography>
          {comments.length === 0 && (
            <Typography variant="body1" color="grey">
              {"It's empty in here..."}
            </Typography>
          )}
          {comments.map((comment) => (
            <MyComment
              key={comment._id}
              comment={comment}
              deleteComment={() => userDeleteComment(comment._id, token)}
            />
          ))}
        </Box>
      ),
    },
  ];

  const userDeleteComment = async (commentId: string, token: string) => {
    if (isLoggedIn) {
      deleteComment(commentId, token).then(() => {
        const updatedComments = comments.filter(
          (comment) => comment._id != commentId
        );
        setComments(updatedComments);
      });
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!userID) return;
      const newUser = await getUser(userID);
      setUser(newUser);
      setIsLoading(false);
    };
    fetchUser();
  }, [userID]);

  const auth = useAuth();
  if (auth.user) {
    if (auth.user._id === user?._id || auth.user.userType === "admin") {
      isLoggedIn = true;
      token = auth.getToken() as string;
    }
  }

  useEffect(() => {
    if (typeof user === "undefined") return;
    const fetchProject = async () => {
      if (typeof user.project === "undefined" || user.project === null) return;
      const newProject = await getProject(user.project._id);
      setProject(newProject);
    };
    const fetchLikes = async () => {
      let likedProjects: TProject[] = [];
      for (const projectId of user.likedProjects) {
        const newProject = await getProject(projectId);
        if (newProject) {
          likedProjects.push(newProject);
        }
      }
      setLikedProjects(likedProjects);
    };
    const fetchComments = async () => {
      if (typeof user === "undefined") return;
      const comments = await getUserComments(user._id);
      setComments(comments);
    };
    fetchProject();
    fetchLikes();
    fetchComments();
  }, [user]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (typeof user === "undefined") {
    return (
      <Box>
        {isLoading ? (
          <Box />
        ) : (
          <Error errorMessage={`User "${userID}" does not exist`} />
        )}
      </Box>
    );
  }

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      justifyContent={{ xs: "start", md: "center" }}
      spacing={0}
      minHeight="92vh"
      margin="8vh auto 0vh auto"
      paddingTop="20px"
      width={{ xs: "97%", sm: "95%", md: "80%" }}
    >
      <Stack
        display="flex"
        direction="column"
        alignItems="start"
        width={{ xs: "100%", md: "305px" }}
        padding={{ xs: "0px 24px", md: "24px" }}
      >
        <Box display={{ xs: "flex", md: "block" }} width="100%">
          <Box
            width={{ xs: "25%", md: "90%" }}
            component="img"
            src={user.profilePicture}
            alt="user profile"
            referrerPolicy="no-referrer"
            borderRadius="50%"
            alignSelf="center"
            sx={{ aspectRatio: "1 / 1", objectFit: "cover" }}
          ></Box>
          <Box paddingLeft={{ xs: "24px", md: "0px" }}>
            <Typography>
              {user.userType.charAt(0).toUpperCase() +
                user.userType.slice(1).toLowerCase()}
            </Typography>
            <Typography
              width="100%"
              variant="h6"
              style={{ wordBreak: "break-word" }}
            >
              {user.name}
            </Typography>
            <Typography style={{ wordBreak: "break-word" }}>
              {user.displayEmail}
            </Typography>
            <Stack
              paddingTop="10px"
              direction={{ xs: "row", md: "column" }}
              spacing={1}
            >
              {user.links.map((link) => (
                <Box key={link._id}>
                  <ExternalLinkBtn
                    type={link.type}
                    value={link.value}
                    _id={link._id}
                  />
                </Box>
              ))}
            </Stack>
            {isLoggedIn && (
              <Box paddingTop="8px">
                <Button
                  onClick={handleClickOpen}
                  variant="outlined"
                  sx={{ width: "180px" }}
                >
                  {"Edit Profile"}
                </Button>
                <EditUser
                  open={open}
                  handleClose={handleClose}
                  user={user}
                  token={token}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Stack>
      <Box height="inherit" width="100%">
        <MyTabs tabs={userTabs} />
      </Box>
    </Stack>
  );
};

export default UserProfile;
