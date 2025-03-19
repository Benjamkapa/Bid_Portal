
import Button from '../../components/button/Button'
import gameLogo from "../../assets/images/game-logo.png"
const Login = () => {
  return (
    <div className='bg-gray-800 min-h-screen h-full flex jusify-center items-center'>
      <form action="" autoComplete='off' className='space-y-9 bg-white rounded p-5 w-[400px] mx-auto '>
      <div className=''>
        <img src={gameLogo} className='h-[90px]' alt="game logo" />
        <p className='text-xl font-bold'>Admin Login</p>
       </div>
        <div>
          <p className='text-sm font-bold'>Email address</p>
          <input type="email"  placeholder='Enter email address' className='p-2 w-full rounded border'/>
        </div>
        <div>
          <p className='text-sm font-bold'>Password</p>
          <input type="password"  placeholder='Enter password' className='p-2 w-full rounded border'/>
        </div>
        <Button color="bg-[#e62126]"  text="Login"/>
      </form>
      </div>
  )
}

export default Login