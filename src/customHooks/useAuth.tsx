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
  user: TUser | null; // Current user object. You can access everything from this, role, username, profile pic, etc. If no one is signed in it is set to null.
  signin: (username: TUser["username"], password: string) => void; // Signs in user. Mostly for the sign in form.
  signup: (newUser: SignUpProps) => void; // Signs up user 
  signout: () => void; // Deletes saved token and set user to null.
  onlyAuthenticated: () => void; // Use this redirect users to sign in page.
  isAllowed: (aRoles?: TUser['userType'][], aIds?: string[]) => boolean;  // For role and id based authorization.
  getToken: () => string | null; // For restricted api calls.
  getLatestUser: () => void;
  error: string; // Set with server message if signin or signout fails.
  existError: string; //Check User registered
  success: string; //Set with server message if api succeeds.
  isLoading: boolean; // True while async calls are happening. Could be used to display loading animation while logging in, etc.
  googleAuth: () => void;
  resetPassword: (email: any) => void;
  changePassword: (password: any) => void;
};

function useProvideAuth(): TAuthReturnType {
  const [user, setUser] = useState<TUser | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [existError, setExistError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    // Auto sigin in on mount
    getLatestUser()
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
          // sign out if token invalid.
          if (!resp.ok) {
            signout();
          } 
        })
    }
  }
  function googleAuth() {
    setUser(null);
    setIsLoading(true);
    setError('');
    const queryParameters = new URLSearchParams(window.location.search);
    const token = queryParameters.get('token');
    localStorage.setItem('jwtToken', token as string);

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
            getLatestUser();
          })
        }
      })
  }

  // Can use this to get latest user updates.
  function getLatestUser() {
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
    }).then(resp => resp.json()).then((json) => {
      if (json.fail) {
        alert(json.fail)
      } else {
        alert('Check your email to activate your account!')
        navigate('/login')
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
      navigate('/login')
    }
  }
  //Reset Password API
  function resetPassword(email: any) {
    setError('');
    setSuccess('');
    //make the reset call
    fetch(`${API_URL}/api/users/sendResetPasswordEmail`, {
      method: "POST",
      body: JSON.stringify(email),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          setSuccess(json.success);
        } else {
          setError(json.fail);
        }
      });
  }
  //Change Password once User has accepted email.
  function changePassword(newPassword: any) {
    fetch("https://bh71phacjb.execute-api.ap-southeast-2.amazonaws.com/api/users/resetPassword", {
      method: "POST",
      body: JSON.stringify(newPassword),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
          setSuccess(json.success)
      });

  }
  

  // Returns the currently saved token.
  // Useful for api calls that need authorisation.
  function getToken() {
    return localStorage.getItem('jwtToken')
  }

  // Checks if the current user is authorised based on given roles and ids
  function isAllowed(
    allowedRoles?: TUser['userType'][],
    allowedIds?: string[] | null) 
    {
      if (user && allowedRoles && allowedRoles.includes(user.userType)) {
        return true;
      } else if (user && allowedIds && allowedIds.includes(user._id)) {
        return true
      }
      return false;
  }

  return {
    user,
    signin,
    signup,
    signout,
    onlyAuthenticated,
    isAllowed,
    getToken,
    getLatestUser,
    error,
    existError,
    success,
    isLoading,
    googleAuth,
    resetPassword,
    changePassword
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