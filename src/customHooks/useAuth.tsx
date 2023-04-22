import { useState, useContext, createContext, useEffect } from "react";
import { TUser } from "../model/TUser";
import { API_URL } from "../api/config";
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
  isAllowed: (aRoles?: TUser['userType'][], aIds?: string[]) => boolean;
  getToken: () => string | null;
  error: string;
  isLoading: boolean;
};

function useProvideAuth(): TAuthReturnType {
  const [user, setUser] = useState<TUser | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Auto sigin in on mount
    signinWithSavedToken()
    // Validates token every 5 seconds.
    // setInterval(validateToken, 5000);
  }, [])

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


  // validates token
  function validateToken() {
    const savedToken = localStorage.getItem('jwtToken');
    if (savedToken) {
      // console.log('validating')
      getUserPromise(savedToken)
        .then((resp) => {
          // If token valid fetch latest user.
          if (resp.ok) {
            // resp.json().then((user) => { setUser(user) })
          } else {
            // Delete token, and sign out.
            signout();
          }
        })
    }
  }

  // signs in user from given username and password
  // saves token locally
  // Any errors are set in the error state variable.
  function signin(username: TUser["username"], password: string) {
    setUser(null) // clear previous user.
    setIsLoading(true);
    setError('');
    getTokenPromise(username, password)
      .then(resp => {
        if (!resp.ok) {
          // Set login error
          resp.text().then(err => {setError(err); setIsLoading(false)} );
        } else {
          // Otherwise save token and signin.
          resp.text().then(token => {
            localStorage.setItem('jwtToken', token);
            signinWithSavedToken();
          })
        }
      })
  }

  function signinWithSavedToken() {
    setError('')
    const savedToken = localStorage.getItem('jwtToken');
    if (savedToken) {
      getUserPromise(savedToken)
        .then((resp) => {
          if (resp.ok) {
            resp.json().then((jsonData) => setUser(jsonData));
          } else {
            resp.text().then(err => setError(err))
          }
        }).finally(() => setIsLoading(false))
    }
  }

  // Registers user given the required data from the above interface
  function signup(newUser: SignUpProps) {
    const postBody = JSON.stringify({
      ...newUser,
      username: newUser.email
    });
    setIsLoading(true);
    fetch(`${API_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: postBody,
    }).then(resp => {
      if (resp.ok) {
        signin(newUser.email, newUser.password);
      } else {
        resp.text().then(err => setError(err));
      }
    }).finally(() => setIsLoading(false));
  }

  // Deletes token and sets user to null
  function signout() {
    setUser(null);
    localStorage.removeItem("jwtToken");
  }

  // Redirects to login page if no valid user is signed in.
  function onlyAuthenticated() {
    validateToken(); // checks if current user is valid.
    if (!user) {
      navigate('/projects')
    }
  }

  // Returns the currently saved token.
  // Useful for api calls that need authorisation.
  function getToken() {
    return localStorage.getItem('jwtToken')
  }

  // Checks if the current user is authorised based on given roles and ids
  function isAllowed(allowedRoles?: TUser['userType'][], allowedIds?: string[]) {
    if (!user) {
      return false;
    } else if (allowedIds && !allowedIds.includes(user._id)) {
      return false;
    } else if (allowedRoles && !allowedRoles.includes(user.userType)) {
      return false;
    }
    return true
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

// Create context with default value.
// The default value is never used so I'm just gonna cast a empty object as the desired type.
const authContext = createContext<TAuthReturnType>({} as TAuthReturnType);

export function AuthProvider({ children }: { children: any }) { // Gave any type but might need to be React.ReactNode
  return (
    <authContext.Provider value={useProvideAuth()}>
      {children}
    </authContext.Provider>
  )
}

export const useAuth = () => useContext(authContext);