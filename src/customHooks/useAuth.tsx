import { useState, useContext, createContext, Context } from "react";
import { TUser } from "../model/TUser";
import { API_URL } from "../api/config";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface SignUpProps {
  name: TUser["name"];
  email: TUser["email"];
  // username: TUser["username"] //N
  password: string;
}

type TAuthReturnType = {
  user: TUser | null;
  signin: (username: TUser["username"], password: string) => void;
  signup: (newUser: SignUpProps) => void;
  signout: () => void;
  onlyAuthenticated: () => void;
  isAllowed: (allowedRoles: TUser["userType"][]) => boolean;
  getToken: () => string | null;
  error: string;
  isLoading: boolean;
};

function useProvideAuth(): TAuthReturnType {
  const [user, setUser] = useState<TUser | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // gets the current user (checks if user is logged in)
  // does this through the getCurrentUser api call.
  const getUserPromise = (savedToken: string | null) => {
    return fetch(`${API_URL}/api/users/getCurrentUser/me`, {
      method: "GET",
      headers: {
        "x-auth-token": savedToken as string, // This will be set to 'undefined' if token doesn't exist
      },
    });
  };

  const getTokenPromise = (username: TUser["username"], password: string) => {
    return fetch(`${API_URL}/api/auth`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
  };

  function signin(username: TUser["username"], password: string = "null") {
    const savedToken = localStorage.getItem("jwtToken");
    setIsLoading(true);
    getUserPromise(savedToken).then((resp) => {
      if (resp.ok) {
        resp.json().then((user) => {
          setUser(user);
          setError("");
          setIsLoading(false);
        });
      } else {
        setUser(null);
        localStorage.removeItem("jwtToken");
        resp.text().then((err) => setError(err));
        getTokenPromise(username, password).then((resp) => {
          if (!resp.ok) {
            resp.text().then((err) => setError(err));
          } else {
            resp.text().then((token) => {
              localStorage.setItem("jwtToken", token);
              getUserPromise(token)
                .then((resp) => resp.json())
                .then((user) => {
                  setUser(user);
                  setIsLoading(false);
                  setError("");
                })
                .catch((err) => setError(err));
            });
          }
        });
      }
    });
  }

  function signup(newUser: SignUpProps) {
    const postBody = JSON.stringify({
      ...newUser,
      username: newUser.email,
    });
    console.log(postBody);
    setIsLoading(true);
    fetch(`${API_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: postBody,
    }).then((resp) => {
      if (resp.ok) {
        return;
      } else {
        resp.text().then((err) => setError(err));
      }
      setIsLoading(false);
    });
  }

  function signout() {
    setUser(null);
    localStorage.removeItem("jwtToken");
  }

  function onlyAuthenticated() {
    if (user) {
      signin(user.username);
    } else {
      navigate("/projects");
      console.log("not authorised");
    }
  }

  function getToken() {
    return localStorage.getItem("jwtToken");
  }

  function isAllowed(allowedRoles: TUser["userType"][]) {
    return user !== null && allowedRoles.includes(user.userType);
  }

  return {
    user,
    signin,
    signup,
    signout,
    onlyAuthenticated,
    isAllowed,
    getToken,
    error,
    isLoading,
  };
}

const authContext = createContext<TAuthReturnType>({
  user: null,
  signin: (username: TUser["username"], password: string) => {},
  signup: (newUser: SignUpProps) => {},
  signout: () => {},
  onlyAuthenticated: () => {},
  isAllowed: (allowedRoles: TUser["userType"][]) => false,
  getToken: () => null,
  error: "",
  isLoading: false,
});

export function AuthProvider({ children }: { children: any }) {
  // Gave any type but might need to be React.ReactNode
  return (
    <authContext.Provider value={useProvideAuth()}>
      {children}
    </authContext.Provider>
  );
}

export const useAuth = () => useContext(authContext);
