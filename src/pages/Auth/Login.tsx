import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/button/Button';
import gameLogo from "../../assets/images/game-logo.png";
import loginBg from "../../assets/images/loginBg.jpg"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from '../../redux/store';
import { getUserProfile, loginUser } from '../../redux/authSlice';

const Login: React.FC = () => {
  const navigate=useNavigate()
  const dispatch = useDispatch<AppDispatch>();
const authState = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });


  // Fetch user profile ONLY if there's a token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !authState?.isAuthenticated) {
      dispatch(getUserProfile());
    }
  }, [dispatch, authState?.isAuthenticated]); 

  // console.log("authState is", authState?.isAuthenticated);

  // Redirect based on authentication state
  useEffect(() => {
    if (authState?.isAuthenticated) {
      if(authState?.user?.role=="admin"){
        navigate("/tenders")
      }else{
        navigate("/");
      }
    }
  }, [authState?.isAuthenticated, navigate]); // Depend on navigate to avoid unnecessary renders

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };



  // handle login
  const handleLogin=async(e:any)=>{
    e.preventDefault()
    dispatch(loginUser(formData))

  }

  return (
    <section className='h-screen bg-white'>
      <div className='grid grid-cols-2 h-full'>
        <div className='h-full'>
              <img src={loginBg} className='w-full h-full' alt="" />
        </div>
        <div className=' w-3/4 mx-auto'>
        <div >
          <img src={gameLogo} alt="game-logo" className='h-[200px] w-full object-cover'/>

        </div>
          {/* <p>Login into you account</p> */}
          <form action="" className='space-y-8'>

                 <div>
  <p>Email</p>
  <input type="email" name="email" onChange={handleChange}  className='p-2 border w-full rounded' placeholder='Enter your email'/>
</div>

<div>
  <p>Password</p>
  <input type="password" name="password" onChange={handleChange}  className='p-2 border w-full rounded' placeholder='Enter password'/>
</div>
<div>
  <Button text="Login" color='bg-[#356aef]' isLoading={authState?.loading} onClick={handleLogin}/>
<div className='flex justify-end mt-2'>
           <Link to="/forgot-password" className='text-blue-500'>Forgot Password?</Link>
      </div>
</div>
          </form>
        </div>
      </div>
    </section>




  );
};

export default Login;