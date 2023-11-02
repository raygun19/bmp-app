import SignUp from "./SignUp";
import SignIn from "./SignIn";
import './styles/Welcome.css';

/*

Component: Welcome

This is the main login page.

Props: 

Parents: App
Children: SignIn

*/

const Welcome = () => {
  return (
    <div className="page-container background-container">
      <div className="flex-v-center">
        <img id="logo" src={`${process.env.PUBLIC_URL}/logo.webp`} alt="bravo logo, piano and violin" />
        <SignIn></SignIn>
      </div>
      {/* <SignUp></SignUp> */}
    </div>
  );
};

export default Welcome;