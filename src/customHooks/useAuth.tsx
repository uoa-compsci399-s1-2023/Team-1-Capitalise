import { useState, useContext, createContext, useEffect, useRef } from "react";
import { TUser } from "../model/TUser";
import { API_URL } from "../api/config";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface SignUpProps {
  name: TUser["name"];
  email: TUser["email"];
  password: string;
}

type TAuthReturnType = {
  user: TUser | null;
  signin: (username: TUser["username"], password: string) => void;
  signup: (newUser: SignUpProps) => void;
  signout: () => void;
  onlyAuthenticated: () => void;
  isAllowed: (allowedRoles: TUser['userType'][]) => boolean;
  getToken: () => string | null;
  pauseTokenValidation: () => void,
  resumeTokenValidation: () => void,
  error: string;
  isLoading: boolean;
};

function useProvideAuth(): TAuthReturnType {
  const [user, setUser] = useState<TUser | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  // const [isTokenValidation, setIsTokenValidation] = useState(true);
  const isTokenValidation = useRef(true);
  const navigate = useNavigate();

  const getUserPromise = (savedToken: string | null) => {
    return fetch(`${API_URL}/api/users/getCurrentUser/me`, {
      method: "GET",
      headers: {
        "x-auth-token": savedToken as string, // This will be set to 'null' if token doesn't exist
      },
    })
  }

  const getTokenPromise = (username: TUser["username"], password: string) => {
    return fetch(`${API_URL}/api/auth`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
  }

  // validates token and fetches latest user changes
  function validateTokenAndFetchUser() {
    const savedToken = localStorage.getItem('jwtToken');
    if (isTokenValidation.current === true && savedToken) {
      getUserPromise(savedToken)
      .then((resp) => {
        // If token valid fetch latest user.
        if (resp.ok) {
          resp.json().then((user) => { setUser(user) })
        } else {
          // Delete token, and sign out.
          signout();
        }
      })
    }
  }

  // Validates token every 5 seconds.
  useEffect(() => {
    setInterval(validateTokenAndFetchUser, 5000);
  }, [])

  // signs in user from given username and password
  // saves token locally
  // Any errors are set in the error state variable.
  function signin(username: TUser["username"], password: string) {
    setIsLoading(true);
    setError('');
    getTokenPromise(username, password)
      .then(resp => {
        if (!resp.ok) {
          // Set login error
          resp.text().then(err => setError(err));
        } else {
          // Otherwise save token and signin.
          resp.text().then(token => {
            localStorage.setItem('jwtToken', token);
            validateTokenAndFetchUser();
          })
        }
      });
  }


  // Registers user given the required data from the above interface
  function signup(newUser: SignUpProps) {
    const postBody = JSON.stringify({
      ...newUser,
      username: newUser.email
    });
    console.log(postBody)
    setIsLoading(true);
    fetch(`${API_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: postBody,
    }).then(resp => {
      if (resp.ok) {
        return;
      } else {
        resp.text().then( err => setError(err) );
      }
      setIsLoading(false);
    });
  }

  // Deletes token and sets user to null
  function signout() {
    setUser(null);
    localStorage.removeItem("jwtToken");
  }

  // Redirects to login page if no valid user is signed in.
  function onlyAuthenticated() {
    validateTokenAndFetchUser(); // checks if current user is valid.
    if (!user) {
      navigate('/projects')
      console.log('not authorised')
    }
  }

  // Returns the currently saved token.
  // Useful for api calls that need authorisation.
  function getToken() {
    return localStorage.getItem('jwtToken')
  }

  // Checks if the current user is authorised based on given roles
  function isAllowed(allowedRoles: TUser['userType'][]) {
    return (user !== null && allowedRoles.includes(user.userType)) 
  }

  // Pauses token validation.
  // Maybe useful when making local changes to the user, 
  // and you don't when them to rewritten every 5 seconds.
  // If you call this, please please please don't forget to resume!
  function pauseTokenValidation() {
    isTokenValidation.current = false;
    console.log(isTokenValidation.current, 'set to false')
  }
  function resumeTokenValidation() {
    isTokenValidation.current = true;
  }
  
  return {
    user,
    signin,
    signup,
    signout,
    onlyAuthenticated,
    isAllowed,
    getToken,
    pauseTokenValidation,
    resumeTokenValidation,
    error,
    isLoading,
  };
}

// Create context with default value.
// The value isn't important it's just there cause createContext
// needs an initial value.
const authContext = createContext<TAuthReturnType>({
  user: null,
  signin: (username: TUser["username"], password: string) => { },
  signup: (newUser: SignUpProps) => { },
  signout: () => { },
  onlyAuthenticated: () => { },
  isAllowed: (allowedRoles: TUser['userType'][]) => false,
  getToken: () => null,
  pauseTokenValidation: () => { },
  resumeTokenValidation: () => { },
  error: '',
  isLoading: false,
});

export function AuthProvider({ children }: { children: any }) { // Gave any type but might need to be React.ReactNode
  return (
    <authContext.Provider value={useProvideAuth()}>
      {children}
    </authContext.Provider>
  )
}

export const useAuth = () => useContext(authContext);